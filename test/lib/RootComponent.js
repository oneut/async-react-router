import React from "react";
import test from "ava";
import { mount } from "enzyme/build";
import RootComponent from "../../src/lib/RootComponent";
import ComponentResolver from "../../src/lib/ComponentResolver";

// Define DummyConnector
class DummyConnector {
  constructor() {
    this.component = null;
    this.onStateChange = () => {};
    this.componentResolver = new ComponentResolver();
  }

  subscribe(onStateChange) {
    this.onStateChange = onStateChange;
  }
}

test.serial("Render component", (t) => {
  // Create test component
  class FirstPage extends React.Component {
    render() {
      return <div>Hello, first page</div>;
    }
  }

  class NextPage extends React.Component {
    render() {
      return <div>Hello, next page</div>;
    }
  }

  // RootComponent test
  const dummyConnector = new DummyConnector();
  dummyConnector.componentResolver.setComponent(FirstPage);
  const mountedActual = mount(<RootComponent connector={dummyConnector} />);
  const expectedFirstPage = mount(<FirstPage />);
  t.is(mountedActual.html(), expectedFirstPage.html());

  dummyConnector.componentResolver.setComponent(NextPage);
  dummyConnector.onStateChange();
  const expectedNextPage = mount(<NextPage />);
  t.is(mountedActual.html(), expectedNextPage.html());
});

test.serial("Render null", (t) => {
  // RootComponent test
  const dummyConnector = new DummyConnector();
  const mountedActual = mount(<RootComponent connector={dummyConnector} />);
  t.is(mountedActual.html(), null);
});
