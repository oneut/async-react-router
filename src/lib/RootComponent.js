import React from "react";

export default class RootComponent extends React.Component {
  constructor(props) {
    super(props);
    props.connector.subscribe(this.onStateChange.bind(this));
  }

  onStateChange() {
    this.setState({});
  }

  /**
   * Render the matching route.
   */
  render() {
    const component = this.props.connector.componentResolver.getComponent();
    if (!component) {
      return null;
    }

    return React.createElement(component, { ...this.props });
  }
}
