# Berbix React SDK

This Berbix React library provides simple interfaces to interact with the Berbix Verify flow.

## Installation

    npm install berbix-react

## Usage

### Basic usage

```jsx
import React from 'react';
import BerbixVerify from 'berbix-react';

class ExampleComponent extends React.Component {
  render() {
    return (
      <BerbixVerify
        clientId="your_client_id"
        role="your_role_key"
        onComplete={event => {
          // send event.value to backend to fetch user verification data
        }}
      />
    );
  }
}
```

### Full propTypes

```js
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
```

## Publishing

    # Update the version in package.json
    npm run build
    npm publish
