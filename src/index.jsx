import * as React from 'react';
import PropTypes from 'prop-types';

class BerbixVerify extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: 0,
      idx: 0,
      show: true,
    };

    this.handleMessage = this.handleMessage.bind(this);
    this.frameRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('message', this.handleMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }

  handleMessage(e) {
    const { onComplete, onError, onDisplay, onStateChange } = this.props;

    if (e.origin !== this.baseUrl()) {
      return;
    }

    var data = JSON.parse(e.data);
    if (data.type === 'VERIFICATION_COMPLETE') {
      try {
        if (data.payload.success) {
          onComplete({ value: data.payload.code });
        } else {
          onError(data);
        }
      } catch (e) {
        // Continue clean-up even if callback throws
      }
      this.setState({ show: false });
    } else if (data.type === 'DISPLAY_IFRAME') {
      onDisplay();
      this.setState({ height: data.payload.height });
    } else if (data.type === 'RESIZE_IFRAME') {
      this.setState({ height: data.payload.height });
    } else if (data.type === 'RELOAD_IFRAME') {
      this.setState({ height: 0, idx: this.state.idx + 1 });
    } else if (data.type === 'STATE_CHANGE') {
      onStateChange(data.payload);
    } else if (data.type === 'ERROR_RENDERED') {
      onError(data.payload);
    }
  }

  baseUrl() {
    const { baseUrl, environment } = this.props;
    if (baseUrl != null) {
      return baseUrl;
    }
    switch (environment) {
      case 'sandbox':
        return 'https://verify.sandbox.berbix.com';
      case 'staging':
        return 'https://verify.staging.berbix.com'
      default:
        return 'https://verify.berbix.com'
    }
  }

  frameUrl() {
    const { overrideUrl, version, clientId, role, email, phone, continuation } = this.props;
    if (overrideUrl != null) {
      return overrideUrl;
    }
    return (this.baseUrl() + '/' + version + '/verify') +
      ('?client_id=' + clientId) +
      ('&role=' + role) +
      (email ? '&email=' + encodeURIComponent(email) : '') +
      (phone ? '&phone=' + encodeURIComponent(phone) : '') +
      (continuation ? '&continuation=' + continuation : '');
  }

  render() {
    if (!this.state.show) {
      return null;
    }
    return (
      <iframe
        key={this.state.idx}
        ref={this.frameRef}
        src={this.frameUrl()}
        style={{
          backgroundColor: 'transparent',
          border: '0 none transparent',
          padding: 0,
          margin: 0,
          display: 'block',
          width: '100%',
          height: this.state.height + 'px',
          overflow: 'hidden',
        }}
        allow="camera"
        scrolling="no"
      />
    );
  }
}

BerbixVerify.propTypes = {
  onComplete: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  onError: PropTypes.func,
  onDisplay: PropTypes.func,
  onStateChange: PropTypes.func,
  baseUrl: PropTypes.string,
  environment: PropTypes.oneOf(['sandbox', 'staging', 'production']),
  overrideUrl: PropTypes.string,
  version: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  continuation: PropTypes.string,
}

BerbixVerify.defaultProps = {
  onError: function() {},
  onDisplay: function() {},
  onStateChange: function() {},
  version: 'v0',
};

export default BerbixVerify;
