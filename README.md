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
        onComplete={() => {
          // the user has completed the verification flow
        }}
      />
    );
  }
}
```

The above will render an iframe inlined in your app.

### Displaying the Berbix Verify Flow in a modal

If you'd like to render the Berbix Verify Flow as a modal, set the `showInModal` bool
prop, and pass a function to handle closure of the modal using `onCloseModal` props.

Set the `showCloseModalButton` if you'd like a close button to appear at the top of the modal. The modal will not close itself when the user clicks on the close button rendered within it.
Rather, you should use the `onCloseModal` prop as a way to trigger the removal of the modal
from the view (e.g. by removing the `BerbixVerify` component from the DOM).

For the modal to be rendered properly, you might need to either include the `BerbixVerify`
component at the root node of the DOM, or use a [React Portal](https://reactjs.org/docs/portals.html)
to correctly position it within the DOM.

### PropTypes

```js
BerbixVerify.propTypes = {
  // Required
  clientToken: PropTypes.string,

  // Configurations
  showInModal: PropTypes.bool,
  showCloseModalButton: PropTypes.bool,

  // Event handlers
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onDisplay: PropTypes.func,
  onStateChange: PropTypes.func,
  onCloseModal: PropTypes.func, // If provided, onCloseModal below gets called when the user clicks the "close modal" button
};
```

## Publishing

    # Update the version in package.json
    npm run build
    npm publish
