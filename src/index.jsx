import * as React from "react";
import PropTypes from "prop-types";

const SDK_VERSION = "0.0.10";

class BerbixVerify extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: 0,
      marginTop: 0,
      idx: 0,
      show: true,
    };

    this.handleMessage = this.handleMessage.bind(this);
  }

  componentDidMount() {
    if (typeof window !== "undefined") {
      window.addEventListener("message", this.handleMessage);
    }
  }

  componentWillUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("message", this.handleMessage);
    }
  }

  parseMessage(data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      // Could not parse message, discarding as it's likely coming from extension or other source
      return null;
    }
  }

  handleMessage(e) {
    const {
      onComplete,
      onError,
      onDisplay,
      onStateChange,
      onCloseModal,
    } = this.props;

    if (e.origin !== this.baseUrl()) {
      return;
    }

    var data = this.parseMessage(e.data);
    if (data === null) {
      // The message couldn't be parsed, so we skip this step
      return;
    }

    if (data.type === "VERIFICATION_COMPLETE") {
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
    } else if (data.type === "DISPLAY_IFRAME") {
      onDisplay();
      this.setState({
        height: data.payload.height,
        marginTop: data.payload.margin || 0,
      });
    } else if (data.type === "RESIZE_IFRAME") {
      this.setState({ height: data.payload.height });
    } else if (data.type === "RELOAD_IFRAME") {
      this.setState({ height: 0, idx: this.state.idx + 1 });
    } else if (data.type === "STATE_CHANGE") {
      onStateChange(data.payload);
    } else if (data.type === "EXIT_MODAL") {
      onCloseModal();
    } else if (data.type === "ERROR_RENDERED") {
      onError(data.payload);
      this.setState({ height: 200 });
    }
  }

  baseUrl() {
    const { baseUrl, environment } = this.props;
    if (baseUrl != null) {
      return baseUrl;
    }
    switch (environment) {
      case "sandbox":
        return "https://verify.sandbox.berbix.com";
      case "staging":
        return "https://verify.staging.berbix.com";
      default:
        return "https://verify.berbix.com";
    }
  }

  frameUrl() {
    const {
      overrideUrl,
      version,
      clientId,
      role,
      templateKey,
      email,
      phone,
      continuation,
      clientToken,
      showInModal,
    } = this.props;
    if (overrideUrl != null) {
      return overrideUrl;
    }
    const token = clientToken || continuation;
    const template = templateKey || role;
    var options = ["sdk=BerbixReact-" + SDK_VERSION];
    if (clientId) {
      options.push("client_id=" + clientId);
    }
    if (template) {
      options.push("template=" + template);
    }
    if (email) {
      options.push("email=" + encodeURIComponent(email));
    }
    if (phone) {
      options.push("phone=" + encodeURIComponent(phone));
    }
    if (token) {
      options.push("client_token=" + token);
    }
    if (showInModal) {
      options.push("modal=true");
    }
    const height = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    options.push("max_height=" + height);
    return this.baseUrl() + "/" + version + "/verify?" + options.join("&");
  }

  render() {
    if (!this.state.show) {
      return null;
    }
    const iframe = (
      <iframe
        key={this.state.idx}
        src={this.frameUrl()}
        style={{
          backgroundColor: "transparent",
          border: "0 none transparent",
          padding: 0,
          margin: 0,
          display: "block",
          width: "100%",
          height: this.state.height + "px",
          overflow: "hidden",
        }}
        allow="camera"
        scrolling="no"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
    if (this.props.showInModal) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              margin: "0 auto",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "100%",
              overflow: "auto",
              marginTop: this.state.marginTop + "px",
            }}
          >
            {iframe}
          </div>
        </div>
      );
    }
    return iframe;
  }
}

BerbixVerify.propTypes = {
  // Required
  clientToken: PropTypes.string,

  // Configurations
  clientId: PropTypes.string,
  showInModal: PropTypes.bool,

  // Event handlers
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onDisplay: PropTypes.func,
  onStateChange: PropTypes.func,
  onCloseModal: PropTypes.func,

  // Internal use
  baseUrl: PropTypes.string,
  overrideUrl: PropTypes.string,
  environment: PropTypes.oneOf(["sandbox", "staging", "production"]),
  version: PropTypes.string,

  // Deprecated
  continuation: PropTypes.string,
  role: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
};

BerbixVerify.defaultProps = {
  onError: function () {},
  onDisplay: function () {},
  onStateChange: function () {},
  onCloseModal: function () {},
  version: "v0",
};

export default BerbixVerify;
