import React from "react";

export default class ComponentResolver {
  constructor() {
    this.component = null;
  }

  setComponentFromRenderer(renderer) {
    this.setComponent(renderer.getComponent(), renderer.getComponentProps());
  }

  setComponent(component, componentProps) {
    this.component = (props) => {
      return React.createElement(component, {
        ...componentProps,
        ...props
      });
    };
  }

  getComponent() {
    return this.component;
  }
}
