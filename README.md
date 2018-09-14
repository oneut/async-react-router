# async-react-router

[![Build Status](https://travis-ci.org/oneut/async-react-router.svg?branch=master)](https://travis-ci.org/oneut/async-react-router)
[![npm version](https://img.shields.io/npm/v/async-react-router.svg?style=flat)](https://www.npmjs.com/package/async-react-router) 
[![Coverage Status](https://coveralls.io/repos/github/oneut/async-react-router/badge.svg?branch=master)](https://coveralls.io/github/oneut/async-react-router?branch=master)
[![Code Climate](https://codeclimate.com/github/oneut/async-react-router/badges/gpa.svg)](https://codeclimate.com/github/oneut/async-react-router)
[![dependencies Status](https://david-dm.org/oneut/async-react-router/status.svg)](https://david-dm.org/oneut/async-react-router)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Async-react-router is react router that can easily get initial props using async/await or promise.  
If you use this library, You can get the initial props like Next.js.   
And this library works only on client also.

## Version

|Version|React|RxJS|README|
|:---:|:---:|:---:|:---:|
|2.0|15.X or 16.X|6.X|[Link](https://github.com/oneut/async-react-router/tree/master)|
|1.0|15.X or 16.X|5.X|[Link](https://github.com/oneut/async-react-router/tree/1.0-stable)|

In order to correspond to dynamic import, v2 has breaking change from v1.

## Features
+ Support `getInitialProps()` like Next.js.
+ Support only on client-side.
+ Support sever-side rendering.
+ Support URL parameters.
+ Support [history](https://www.npmjs.com/package/history) package. The following history type is supported.
    + Hash history
    + Browser history
    + Memory history
+ Support dynamic import.
+ No depend on react-router.

## Demo
+ [Basic Example.](https://oneut.github.io/async-react-router/basic/)
+ [Redux Example.](https://oneut.github.io/async-react-router/redux/)
+ [Flux Utils Example.](https://oneut.github.io/async-react-router/flux-utils/)
+ Server-side rendering (only [example source](https://github.com/oneut/async-react-router/tree/master/examples/ssr-with-redux))

## Installation

Async-react-router has peer dependencies of [rxjs@6.x.x](https://github.com/Reactive-Extensions/RxJS) which will have to be installed.

```
npm install async-react-router react react-dom rxjs --save
```

## Example
```javascript
import React from 'react';
import { render } from "react-dom";
import { createRouter } from "async-react-router";

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class Home extends React.Component {
    static initialPropsWillGet(attributes, prevAttributes) {
        console.log('Taking a break...');
    }
    
    static async getInitialProps(attributes, prevAttributes) {
        await sleep(5000);
        return {
            message: 'Home is five second sleep.'
        };
    }
    
    static initialPropsDidGet(props, prevProps) {
        console.log('Five second later');
    }

    render() {
        return (
            <div>
                <h2>Home</h2>
                <dl>
                    <dt>Message</dt>
                    <dd>{this.props.message}</dd>
                </dl>
                <ul>
                    <li><Link to="/page">Page Index</Link></li>
                    <li><Link to="/page/1">Page 1</Link></li>
                </ul>
            </div>
        );
    };
}

const router = createRouter();
router.route("/", Home);
router.run((Root) => {
  render(<Root/>, document.getElementById("app"));
});
```

# API
## createRouter()

`createRouter()` generates router instance. Default history type is **Hash history**. 

```javascript
import { createRouter } from "async-react-router";

const router = createRouter();
```

If you want to change history type to browser history or memory history, you can define below.

```javascript
// Browser history
import { createRouter, createBrowserHistory } from "async-react-router";
const router = createRouter(createBrowserHistory());

// Memory history
import { createRouter, createMemoryHistory } from "async-react-router";
const router = createRouter(createMemoryHistory());
```

### router.route(path, component, name)

Route links a path and a component.

+ `path` - Any valid URL path that [path-to-regexp](https://github.com/pillarjs/path-to-regexp) understands. Required.
+ `component` - A react component to render only when the location matches. Required.
+ `name` - Route name. You can use at `Request.name(name)`, or `URL.name(name)`. Optional.

```javascript
import React from 'react';
import { createRouter } from 'async-react-router';
import Home from "./components/Home";

const router = createRouter();
router.route("/", Home, "Home");
router.run((Root) => {
  render(<Root/>, document.getElementById("app"));
});
```

### router.asyncRoute(path, () => promise, name)

If you want to use dynamic import, You can define using `asyncRoute()`. 

+ `path` - Any valid URL path that [path-to-regexp](https://github.com/pillarjs/path-to-regexp) understands. Required.
+ `component` - A react component to render only when the location matches. Required.
+ `name` - Route name. You can use `Request.name(name)`, or `URL.name(name)`. Optional.

```javascript
import { createRouter } from 'async-react-router';

const router = createRouter();
router.asyncRoute("/", () => import("./components/Home"), "Home");
router.run((Root) => {
  hydrate(<Root />, document.getElementById("app"));
});
```

### router.run((RootComponent) => void)

`run` generates the root component.

```javascript
import { createRouter } from 'async-react-router';
import Home from "./components/Home";

const router = createRouter();
router.route("/", Home, "Home");
router.run((Root) => {
  render(<Root />, document.getElementById("app"));
});
```

If you want to add parameters, you can define parameters with the root component parameters.

```javascript
import { createRouter } from 'async-react-router';
import Home from "./components/Home";

const router = createRouter();
router.route("/", Home, "Home");
router.run((Root) => {
  render(<Root any={"any"}/>, document.getElementById("app"));
});
```

### router.setFirstComponent(component)

If you want to render any component at first rendering, you can define component.

```javascript
import { createRouter } from 'async-react-router';
function FirstComponent() {
  return (
    <div className="text-center" style={{margin: "100px 0"}}>
      <i className="fa fa-cog fa-spin fa-5x fa-fw"/>
    </div>
  )
}

const router = createRouter();

// Set first rendered component.
router.setFirstComponent(FirstComponent);

router.run((Root) => {
  hydrate(<Root />, document.getElementById("app"));
});
```

### router.setInitialProps(parameters)

If you want to render server-side, you will want to give initial data. 
In that case, you can set initial data with `setInitialProps()`.  
When you use `setInitialProps()`, `initialPropsWillGet()` and `initialPropsDidGet()` are not called for the first time.  
Only `getInitialProps()` is called.

```javascript
import { createRouter } from 'async-react-router';

const router = createRouter();

// Set data from server.
router.setInitialProps(
  JSON.parse(document.getElementById("initial-props").innerText);
);

router.run((Root) => {
  hydrate(<Root/>, document.getElementById("app"));
});
```

## Link

`<Link>` makes a request event and renders component matching route path.

```javascript
import { Link } from 'async-react-router';

<Link to="/">Home</Link>
```

## Route component
### `component.initialPropsWillGet(attributes, prevAttributes): void`

Route component can have `initialPropsWillGet()`.  
`initialPropsWillGet()` is invoked immediately before mounting occurs. It is called before `getInitialProps()`
This method is static.

`initialPropsWillGet()` has arguments below.

+ `attributes` - Current route attributes. 
    + `pathname` - String of the current path.
    + `params` - Object with the parsed url parameter. Defaults to {}.
+ `prevAttributes` - Previous route attributes. Defaults to {}.
    + `pathname` - String of the previous path.
    + `params` - Object with the parsed url parameter at previous page. Defaults to {}.

**async/await is not supported.**


### `component.getInitialProps(attributes, prevAttributes): Object`

Route component can have `getInitialProps()` that can use async/await.  
`getInitialProps()` perform the rendering after promise has been resolved, The resolved data can be retrieved as props of component.
This method is static.

And `getInitialProps()` has arguments below.

+ `attributes` - Current route attributes. 
    + `pathname` - String of the current path.
    + `params` - Object with the parsed url parameter. Defaults to {}.
+ `prevAttributes` - Previous route attributes. Defaults to {}.
    + `pathname` - String of the previous path.
    + `params` - Object with the parsed url parameter at previous page. Defaults to {}.

```javascript
import { createRouter } from 'async-react-router';

class User extends React.Component {
    static async getInitialProps(attributes, prevAttributes) {
        console.log(attributes.params.userId);
        return { 
          data: "Get initial props!!" 
        };
    }
    
    render() {
        return (
            <div>
                <div>UserId: {this.props.params.userId}</div>
                <div>Data: {this.props.data}</div>
            </div>
        );
    }
}

const router = createrRouter();
router.route("/user/:userId", User);
router.run((Root) => {
  render(<Root/>, document.getElementById("app"));
});
```


### `component.initialPropsDidGet(props, prevProps): void`

Route component can have `initialPropsDidGet()`.  
`initialPropsDidGet()` is called after `getInitialProps()`.  
If more than one promise is pending, Async-react-router gets only data of last executed promise.  
For this reason, `initialPropsDidGet()` is executed only when the last promise is resolved.
This method is static.

`initialPropsDidGet()` has arguments.

+ `props` - Current props of components defined at route. 
    + `pathname` - String of the current path.
    + `params` - Object with the parsed url parameter. Defaults to {}.
    + `{data}` - Data retrieved using `getInitialProps()`. 
+ `prevProps` - Previous props of components defined at route. First rendering to {}.
    + `pathname` - String of the previous path.
    + `params` - Object with the parsed url parameter at previous page. Defaults to {}.
    + `{data}` - Data retrieved using `getInitialProps()`. 
    
**async/await is not supported.**

## Request
### `Request.to(path)`

When you want to push next request, you can use `to` of `Request`.

+ `path` - String of next path.

```javascript
import { Request } from 'async-react-router';

Request.to('/next'); // Change url to `#/next`.
```


### `Request.name(routeName, urlParameters)`

You can make next request from the `name` defined at route.

+ `routeName` - Route name for next request.
+ `urlParameters` - Object of next url parameters. Optional.

```javascript
import React from 'react';
import { render } from 'react-dom';
import { createRouter, Request } from 'async-react-router';

class User extends React.Component {
    render() { return (<div>{this.props.params.userId}</div>); };
}

const router = createRouter();
router.route("/user/:userId", User, "User");
router.run((Root) => {
  render(<Root/>, document.getElementById("app"));
});

Request.name("User", {userId: 1}); // Change url to `#/user/1`.
```

### `Request.isActive(path)`

When you want to check path, you can use `isActive()` of `Request`.

```javascript
import { Request } from 'async-react-router';

// When current path is `/`...
Request.isActive('/');     // true
Request.isActive('/path'); // false
```


## URL
### `URL.to(path)`

When you want to make path, you can use `to` of `URL`.

+ `path` - String of path.

```javascript
import { URL } from 'async-react-router';

URL.to('/next'); // String `#/next`.
```

### `URL.name(routeName, urlParameters)`

You can make URL from the `name` defined at route.

+ `routeName` - Route name.
+ `urlParameters` - Object of url parameter, if it requires.

```javascript
import React from 'react';
import { render } from 'react-dom';
import { createRouter, URL } from 'async-react-router';

class User extends React.Component {
    render() { return (<div>{this.props.params.userId}</div>); };
}

const router = createRouter();
router.route("/user/:userId", User, "User");
router.run((Root) => {
  render(<Root/>, document.getElementById("app"));
});

URL.name("User", {userId: 1}); // String `#/user/1`.
```

# Server Side Rendering

Async-react-router supports server-side rendering.

+ `createServerRouter` generates server-side router instance.
+ You can deal with SSR just by changing `async-react-router/createRouter` to `async-react-router/ssr/createRouter` on client side.
+ It is also possible to obtain resolved data on the server side via HTML on client-side.

## Server Side
### `createServerRouter()`

`createServerRouter()` generates server-side router instance. Supported history type is only **memory history**. 
`createServerRouter()` has `route()` and `asyncRoute()` also.

```javascript
import { createServerRouter } from "async-react-router/ssr";

app.get("*", function(req, res) {
  function setRoutes(router) {
    router.route("/", IndexPage);
    router.asyncRoute("/user", () => import("./UserPage"));
  }
  
  const serverRouter = createServerRouter();
  setRoutes(serverRouter);
}
```


### serverRouter.runUsingPathname(pathname, callback(RootComponent, data) => void)

`serverRouter.runUsingPathname()` generates root component and initial data.  
`getInitialProps` and `initialPropsWillGet`, `initialPropsDidGet` are not called for the first time.

```javascript
import ejs from "ejs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import express from "express";
import { createServerRouter } from "async-react-router/ssr";
import fs from "fs";

const app = express();

app.get("*", function(req, res) {
  // Please make another file and import.
  function setRoutes(router) {
    router.route("/", IndexPage);
    router.asyncRoute("/user", () => import("./UserPage"));
  }
  
  const serverRouter = createServerRouter();
  setRoutes(serverRouter);
  serverRouter.runUsingPathname(req.url, (Root, data) => {
    fs.readFile("index.html", function(err, result) {
          const compiled = ejs.compile(result.toString("utf8"), "utf8");
          const html = compiled({
            component: ReactDOMServer.renderToString(<Root/>),
            data: data
          });
    
          res.write(html);
          res.end();
        });
  });
}
```

## Client Side
### `createRouter()`

You can use `async-react-router/ssr/createrRouter`.
`async-react-router/ssr/createrRouter` has the same function as `async-react-router/createrRouter`.  
The only difference is history type.  
Supported history type is only **browser history**.
**Hash History** and **Memory History** cannot be used.

```javascript
import React from "react";
import { hydrate } from "react-dom";
import { createRouter } from "async-react-router/ssr";

// Please make another file and import.
function setRoutes(router) {
    router.route("/", IndexPage);
    router.asyncRoute("/user", () => import("./UserPage"));
}

const router = createRouter();
setRoutes(router);
router.setInitialProps(JSON.parse(document.getElementById("initial-props").innerText));
router.run((Root) => {
  hydrate(<Root/>, document.getElementById("app"));
});
```

This is the same process as below.

```javascript
import React from "react";
import { hydrate } from "react-dom";
import { createRouter, createBrowserHistory } from "async-react-router";

// Please make another file and import.
function setRoutes(router) {
    router.route("/", IndexPage);
    router.asyncRoute("/user", () => import("./UserPage"));
}

const router = createRouter(createBrowserHistory());
setRoutes(router);
router.setInitialProps(JSON.parse(document.getElementById("initial-props").innerText));
router.run((Root) => {
  hydrate(<Root/>, document.getElementById("app"));
});
```

## Thanks for the inspiration
+ [next.js](https://github.com/zeit/next.js/)
+ [react-router](https://github.com/ReactTraining/react-router)
+ [react-enroute](https://github.com/tj/react-enroute)
+ [enroute](https://github.com/lapwinglabs/enroute)
+ [path-to-regex](https://github.com/pillarjs/path-to-regexp)

## License

MIT
