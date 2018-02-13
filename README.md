# async-react-router

[![Build Status](https://travis-ci.org/oneut/async-react-router.svg?branch=master)](https://travis-ci.org/oneut/async-react-router)
[![Coverage Status](https://coveralls.io/repos/github/oneut/async-react-router/badge.svg?branch=master)](https://coveralls.io/github/oneut/async-react-router?branch=master)
[![Code Climate](https://codeclimate.com/github/oneut/async-react-router/badges/gpa.svg)](https://codeclimate.com/github/oneut/async-react-router)
[![dependencies Status](https://david-dm.org/oneut/async-react-router/status.svg)](https://david-dm.org/oneut/async-react-router)

## Attention

+ I created this package when Nest.js 2.x.

## Motivation

Next.js is wonderful.
But I was dissatisfied with the following points.

+ SSR required
+ I can not decide the URL freely

Therefore, I made a router like Next.js.

The async-react-router can get the initial props from `getInitialProps` at the client in First Rendering.
You can get initial props from `getInitialProps()` at client side in first rendering!

## Features
+ Support React version 15 and 16.
+ Support async/await like next.js.
+ Support client only.
+ Support URL parameters.
+ Support [history](https://www.npmjs.com/package/history) package.The following history type is supported.
    + Browser History
    + Hash History
    + Memory History
+ Support SSR.
+ Depend on [rxjs@5.x.x](https://github.com/Reactive-Extensions/RxJS).
+ No depend on react-router.

## Demo
+ [Basic Example.](https://oneut.github.io/async-react-router/basic/)
+ [Redux Example.](https://oneut.github.io/async-react-router/redux/)
+ [Flux Utils Example.](https://oneut.github.io/async-react-router/flux-utils/)

## Installation

async-react-router has peer dependencies of [rxjs@5.x.x](https://github.com/Reactive-Extensions/RxJS) which will have to be installed.

```
npm install async-react-router react react-dom rxjs --save
```

## Example
```javascript
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from 'async-react-router';

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

hydrate(
    (
        <Router>
            <Route path="/" component={Home}/>
            <Route path="/page" component={PageIndex}>
                <Route path="/:pageId" component={Page}/>
            </Route>
        </Router>
    ),
    document.getElementById('app')
);
```

# API
## Routing
### `<Router>`

`<Router>` manages `<Route>`.

async-react-router supports [history](https://www.npmjs.com/package/history) package.  
Default history type is **Hash History**.  
If you want to change history type to browser history, you can use `history` property.

```javascript
import { Router, Route, createBrowserHistory } from 'async-react-router';

hydrate(
    (
        <Router history={createBrowserHistory()}>
            // Any <Route>.
        </Router>
    ),
    document.getElementById('app')
);
```

### `<Route>`

`<Route>` manages paths and react components.  
`<Route>` has the following properties.

+ `path` - Any valid URL path that [path-to-regexp](https://github.com/pillarjs/path-to-regexp) understands. Required.
+ `component` - A react component to render only when the location matches. Required.
+ `name` - Name of `<Route>`. You can use `name` at Request API, or URL API. Optional.

```javascript
import { Router, Route } from 'async-react-router';

hydrate(
    (
        <Router>
            <Route path="/" component={Home}/>
            <Route path="/user/:userId" component={User} name="User"/>
        </Router>
    ),
    document.getElementById('app')
);
```

### `<Link>`

`<Link>` makes a request and renders component matching `<Route>`.

```javascript
import { Link } from 'async-react-router';

<Link to="/">Home</Link>
```

## `Component` defined at `<Route>`
### `initialPropsWillGet(attributes, prevAttributes)`

`Component` defined at `<Route>` can have `initialPropsWillGet`.  
`initialPropsWillGet` is invoked immediately before mounting occurs. It is called before `getInitialProps()`

`initialPropsWillGet` has arguments.

+ `attributes` - Current Route Attributes. 
    + `pathname` - String of the current path.
    + `params` - Object with the parsed url parameter. Defaults to {}.
+ `prevAttributes` - Previous Route Attributes. First rendering to {}.
    + `pathname` - String of the previous path.
    + `params` - Object with the parsed url parameter at previous page. Defaults to {}.

**async/await is not supported.**

### `getInitialProps(attributes, prevAttributes): Object`

`Component` defined at `<Route>` can have `getInitialProps` that can use async/await.  
`getInitialProps` perform the rendering after promise has been resolved,　Using `return`, you can pass data to the component defined for the route.

And `getInitialProps` has arguments.

+ `attributes` - Current Route Attributes. 
    + `pathname` - String of the current path.
    + `params` - Object with the parsed url parameter. Defaults to {}.
+ `prevAttributes` - Previous Route Attributes. First rendering to {}.
    + `pathname` - String of the previous path.
    + `params` - Object with the parsed url parameter at previous page. Defaults to {}.


```javascript
class User extends React.Component {
    static async getInitialProps({ pathname, params }) {
        console.log(params.userId);
        return { data: "Get Inital Props!!" };
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

hydrate(
    (
        <Router>
            <Route path="/user/:userId" component={User}/>
        </Router>
    ),
    document.getElementById('app')
);
```

### `initialPropsStoreHook(props, prevProps)`

`Component` defined at `<Route>` can have `initialPropsStoreHook`.  
`initialPropsStoreHook` is used for setting store of redux or flux-utils after calling `getInitialProps`.
It can also be set with `getInitialProps`. However, it is implemented to separate responsibility.

+ `props` - Current props of components defined at `<Route>`. 
    + `pathname` - String of the current path.
    + `params` - Object with the parsed url parameter. Defaults to {}.
    + `{data}` - Data retrieved using `getInitialProps`. 
+ `prevProps` - Previous props of components defined at `<Route>`. First rendering to {}.
    + `pathname` - String of the previous path.
    + `params` - Object with the parsed url parameter at previous page. Defaults to {}.
    + `{data}` - Data retrieved using `getInitialProps`. 

**async/await is not supported.**

### `initialPropsDidGet(props, prevProps)`

`Component` defined at `<Route>` can have `initialPropsDidGet`.  
`initialPropsDidGet` is called after the promise is resolved.  
If more than one promise is pending, async-react-router gets only the last executed promise.  
For this, in that case, `initialPropsDidGet` is executed only when the last promise is resolved.

`initialPropsDidGet` has arguments.

+ `props` - Current props of components defined at `<Route>`. 
    + `pathname` - String of the current path.
    + `params` - Object with the parsed url parameter. Defaults to {}.
    + `{data}` - Data retrieved using `getInitialProps`. 
+ `prevProps` - Previous props of components defined at `<Route>`. First rendering to {}.
    + `pathname` - String of the previous path.
    + `params` - Object with the parsed url parameter at previous page. Defaults to {}.
    + `{data}` - Data retrieved using `getInitialProps`. 
    
**async/await is not supported.**

## Request
### `to(path)`

When you want to push the next history-based request, you can use `to` of `Request`.

+ `path` - String of next path.

```javascript
import { Request } from 'async-react-router';

Request.to('/next'); // Change url to `#/next`.
```

### `name(routeName, urlParameters)`

You can make the history-based request from the `name` defined at `<Route>`.

+ `routeName` - Name defined at `<Route>` for next request.
+ `urlParameters` - Object of next url parameter, if it requires.

```javascript
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Request } from 'async-react-router';

class User extends React.Component {
    render() { return (<div>{this.props.params.userId}</div>); };
}

hydrate(
    (
        <Router>
            <Route path="/user/:userId" component={User} name="User"/>
        </Router>
    ),
    document.getElementById('app')
);

Request.name("User", {userId: 1}); // Change url to `#/user/1`.
```

### `isActive(path)`

When you want to know the current path, you can use `isActive` of `Request`.

```javascript
import { Request } from 'async-react-router';

// When current path is `/`...
Request.isActive('/');     // true
Request.isActive('/path'); // false
```

## URL
### ```to(path)```

When you want to make history-based URL, you can use `to` of `URL`.

+ `path` - String of path.

```javascript
import { URL } from 'async-react-router';

URL.to('/next'); // String `#/next`.
```

### ```name(routeName, urlParameters)```

You can make history-based URL from the `name` property of route defined at `<Route>`.

+ `routeName` - Name defined at `<Route>`.
+ `urlParameters` - Object of url parameter, if it requires.

```javascript
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, URL } from 'async-react-router';

class User extends React.Component {
    render() { return (<div>{this.props.params.userId}</div>); };
}

hydrate(
    (
        <Router>
            <Route path="/user/:userId" component={User} name="User"/>
        </Router>
    ),
    document.getElementById('app')
);

URL.name("User", {userId: 1}); // String `#/user/1`.
```

# Server Side Rendering

Async React Router supports Server Side Rendering.
Server-Side Rendering is easy.

+ `RouteResolver` will solve the route very easily on the server side.
+ you can deal with SSR just by changing `<Router>` to `<Router>` of SSR on Client-Side.
+ It is also possible to obtain resolved data on the server side via HTML.

## Server Side
### `RouteResolver`

`RouteResolver` can solve the route on the server side.

+ `routes` - Route information consisting only of `<Route>`. Required.

```javascript
import { RouteResolver } from "async-react-router/ssr";

const routes = (
    <Route path="/" component="IndexPage">
        <Route path="/user" component="UserPage"/>
    </Route
);

RouteResolver
    .make(routes)
    .resolve(req.url, (component, data) => {
        // View Rendering
    });
```

## Client Side
### `<Router>` for SSR

`<Router>` for SSR manages `<Route>`.

Basically, it has the same function as `<Router>` for Client.  
`getInitialProps` and `initialPropsWillGet`, `initialPropsDidGet` are not called for the first time.  
However, there is a parameter called `firstRendererdInitialProps`, so we can pass the initial value.
`initialPropsStoreHook` is called every time.

```javascript
import React from "react";
import { hydrate } from "react-dom";
import { Router } from "async-react-router/ssr";
import routes from "./routes";

function App() {
    return (
        <Router firstRenderedInitialProps={JSON.parse(document.getElementById("initial-props").innerText)}>
            {routes}
        </Router>
    );
}

hydrate(
    (<App/>),
    document.getElementById('app')
);
```

The history that can be used is **Browser History** only.
**Hash History**, **Memory History** cannot be used.

## Thanks for the inspiration
+ [next.js](https://github.com/zeit/next.js/)
+ [react-router](https://github.com/ReactTraining/react-router)
+ [react-enroute](https://github.com/tj/react-enroute)
+ [enroute](https://github.com/lapwinglabs/enroute)
+ [path-to-regex](https://github.com/pillarjs/path-to-regexp)

## License

MIT
