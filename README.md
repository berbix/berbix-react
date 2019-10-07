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
        onComplete={event => {
          // send event.value to backend to fetch user verification data
        }}
      />
    );
  }
}
```

### PropTypes

```js
BerbixVerify.propTypes = {
  // Required
  clientId: PropTypes.string.isRequired,

  // Configurations
  templateKey: PropTypes.string,
  clientToken: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,

  // Event handlers
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onDisplay: PropTypes.func,
  onStateChange: PropTypes.func,
}
```

## Publishing

    # Update the version in package.json
    npm run build
    npm publish
