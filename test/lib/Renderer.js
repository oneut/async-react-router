import test from "ava";
import React from "react";
import Renderer from "../../src/lib/Renderer";

test("Get default data", async (t) => {
  class Component extends React.Component {
    static async getInitialProps(props, prevProps) {
      return {
        data: "data"
      };
    }

    render() {
      return <div>Hello, World</div>;
    }
  }

  // Make Renderer
  const pathname = "/path";
  const component = Component;
  const params = {
    parameter1: "parameter1"
  };
  const renderer = new Renderer(pathname, component, params);

  // Renderer Setup. Important to the order!.
  t.is(renderer.getPathname(), pathname);
  t.is(renderer.getComponent(), component);
  t.is(renderer.getParams().parameter1, params.parameter1);
});

test("Fire component method", async (t) => {
  class PrevComponent extends React.Component {
    static async getInitialProps() {
      return {
        data: "prev"
      };
    }

    render() {
      return <div>Hello, World</div>;
    }
  }

  class Component extends React.Component {
    static initialPropsWillGet(props, prevProps) {
      t.is(props.pathname, "/path");
      t.is(props.params.parameter1, "parameter1");
      t.is(prevProps.pathname, "/prevPath");
      t.is(prevProps.params.prevParameter1, "prevParameter1");
    }

    static async getInitialProps(props, prevProps) {
      t.is(props.pathname, "/path");
      t.is(props.params.parameter1, "parameter1");
      t.is(prevProps.pathname, "/prevPath");
      t.is(prevProps.params.prevParameter1, "prevParameter1");
      return {
        data: "data"
      };
    }

    static initialPropsDidGet(componentProps, prevComponentProps) {
      t.is(componentProps.pathname, "/path");
      t.is(componentProps.params.parameter1, "parameter1");
      t.is(componentProps.data, "data");
      t.is(prevComponentProps.pathname, "/prevPath");
      t.is(prevComponentProps.params.prevParameter1, "prevParameter1");
      t.is(prevComponentProps.data, "prev");
    }

    render() {
      return <div>Hello, World</div>;
    }
  }

  // Make PrevRenderer.
  const prevPathname = "/prevPath";
  const prevComponent = PrevComponent;
  const prevParams = {
    prevParameter1: "prevParameter1"
  };
  const prevRenderer = new Renderer(prevPathname, prevComponent, prevParams);

  // Renderer Setup. Important to the order!.
  prevRenderer.fireInitialPropsWillGet();
  await prevRenderer.fireGetInitialProps();
  prevRenderer.fireInitialPropsDidGet();

  // Make Renderer
  const pathname = "/path";
  const component = Component;
  const params = {
    parameter1: "parameter1"
  };
  const renderer = new Renderer(pathname, component, params, prevRenderer);

  // Renderer Setup. Important to the order!.
  renderer.fireInitialPropsWillGet();
  await renderer.fireGetInitialProps();
  renderer.fireInitialPropsDidGet();

  t.plan(14);
});

test("Get initial props", async (t) => {
  class Component extends React.Component {
    static async getInitialProps(props, prevProps) {
      return {
        data: "data"
      };
    }

    render() {
      return <div>Hello, World</div>;
    }
  }

  // Make Renderer
  const pathname = "/path";
  const component = Component;
  const params = {
    parameter1: "parameter1"
  };
  const renderer = new Renderer(pathname, component, params);
  await renderer.fireGetInitialProps();
  t.is(renderer.getInitialProps().data, "data");
});

test("Get initial props with undefined", async (t) => {
  class Component extends React.Component {
    static async getInitialProps(props, prevProps) {
      return undefined;
    }

    render() {
      return <div>Hello, World</div>;
    }
  }

  // Make Renderer
  const pathname = "/path";
  const component = Component;
  const params = {
    parameter1: "parameter1"
  };
  const renderer = new Renderer(pathname, component, params);
  await renderer.fireGetInitialProps();
  const initialProps = renderer.getInitialProps();
  t.true(
    Object.keys(initialProps).length === 0 && typeof initialProps === "object"
  );
});

test("Get initial props without `getInitialProps`", async (t) => {
  class Component extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  // Make Renderer
  const pathname = "/path";
  const component = Component;
  const params = {
    parameter1: "parameter1"
  };
  const renderer = new Renderer(pathname, component, params);
  await renderer.fireGetInitialProps();
  const initialProps = renderer.getInitialProps();
  t.true(
    Object.keys(initialProps).length === 0 && typeof initialProps === "object"
  );
});

test("setInitialProps args set object.", async (t) => {
  class Component extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const pathname = "/path";
  const params = {
    parameter1: "parameter1"
  };

  // Make Renderer
  const renderer = new Renderer(pathname, Component, params);

  // Renderer Setup. Important to the order!.
  renderer.setInitialProps({ data: "data" });
  const initialProps = renderer.getInitialProps();
  t.true(
    Object.keys(initialProps).length === 1 && typeof initialProps === "object"
  );
  t.is(initialProps.data, "data");
});

test("setInitialProps args set `null`", (t) => {
  class Component extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const pathname = "/path";
  const params = {
    parameter1: "parameter1"
  };

  // Make Renderer
  const renderer = new Renderer(pathname, Component, params);
  renderer.setInitialProps(null);
  const initialProps = renderer.getInitialProps();
  // initialProps is empty object.
  t.true(
    Object.keys(initialProps).length === 0 && typeof initialProps === "object"
  );
});

test("getPrevComponentProps", (t) => {
  class PrevComponent extends React.Component {
    render() {
      return <div>Hello, Prev World</div>;
    }
  }

  const prevPathname = "/prev-path";
  const prevParams = {
    prevParameter1: "prevParameter1"
  };

  // Make Renderer
  const prevRenderer = new Renderer(prevPathname, PrevComponent, prevParams);

  class Component extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const pathname = "/path";
  const params = {
    parameter1: "parameter1"
  };

  // Make Renderer
  const renderer = new Renderer(pathname, Component, params, prevRenderer);

  const prevComponentProps = renderer.getPrevComponentProps();
  // initialProps is empty object.
  t.true(
    Object.keys(prevComponentProps).length === 2 &&
      typeof prevComponentProps === "object"
  );
  t.is(prevComponentProps.pathname, "/prev-path");
  t.is(prevComponentProps.params.prevParameter1, "prevParameter1");
});

test("getPrevComponentProps of no having PrevRender", (t) => {
  class Component extends React.Component {
    render() {
      return <div>Hello, World</div>;
    }
  }

  const pathname = "/path";
  const params = {
    parameter1: "parameter1"
  };

  // Make Renderer
  const renderer = new Renderer(pathname, Component, params);

  const prevComponentProps = renderer.getPrevComponentProps();
  // initialProps is empty object.
  t.true(
    Object.keys(prevComponentProps).length === 0 &&
      typeof prevComponentProps === "object"
  );
});
