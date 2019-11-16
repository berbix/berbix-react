# Berbix React SDK

This Berbix React library provides simple interfaces to interact with the Berbix Verify flow.

## Installation

    npm install berbix-react

## Usage

### Basic usage

```jsx
import React from "react";
import BerbixVerify from "berbix-react";

class ExampleComponent extends React.Component {
  render() {
    return (
      <BerbixVerify
        clientToken="your_client_token"
        onComplete={event => {
          // send event.value to backend to fetch user verification data
        }}
      />
    );
  }
}
```

The above will render an iframe inlined in your app.

If you'd like to render the Berbix Verify Flow as a modal instead, set the `showInModal` bool
prop, and pass a function to handle closure of the modal using `onCloseModal` props.

### PropTypes

```js
BerbixVerify.propTypes = {
  // Required
  clientToken: PropTypes.string,

  // Configurations
  email: PropTypes.string,
  phone: PropTypes.string,
  showInModal: PropTypes.bool,

  // Event handlers
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onDisplay: PropTypes.func,
  onStateChange: PropTypes.func,
  onCloseModal: PropTypes.func // If provided, onCloseModal below gets called when the user clicks the "close modal" button
};
```

## Publishing

    # Update the version in package.json
    npm run build
    npm publish
