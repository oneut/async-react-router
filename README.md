# async-react-router

## Attention

This package is alpha version yet.

For this, it causes drastic change.

## Motivation
Next.js is wonderful. However, it has to do SSR.
And, it is difficult to manage state for Client.   
So, I made a router like next.js.

You get initial props from `getInitialProps()` at first rendering in client side!

## Features
+ Support async/await like next.js.
+ Support URL parameters.
+ Support [history](https://www.npmjs.com/package/history) package.The following history type are supported.
    + Browser History
    + Hash History
+ No support SSR.
+ No depend on react-router.

## Todo
+ Test...
+ Error Handling Support.
+ SSR?
    
## Demo
+ [Basic Example.](https://oneut.github.io/async-react-router/basic/)
+ [Redux Example.](https://oneut.github.io/async-react-router/redux/)
+ [Flux Utils Example.](https://oneut.github.io/async-react-router/flux/)

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
                    <li>
                        <Link to="/page">
                            Page Index
                        </Link>
                    </li>
                    <li>
                        <Link to="/page/1">
                            Page 1
                        </Link>
                    </li>
                </ul>
            </div>
        );
    };
}

render(
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
If you want change history type to browser history, you can use `history` property.

```javascript
import { Router, Route, createBrowserHistory } from 'async-react-router';

render(
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

render(
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
### `getInitialProps(attributes, prevAttributes): Object`

`Component` defined at `<Route>` can have `getInitialProps` that can use async/await.  
`getInitialProps` perform the rendering after promise has been resolved,　Using `return`, you can pass data to the component defined for route.

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
    }
}

render(
    (
        <Router>
            <Route path="/user/:userId" component={User}/>
        </Router>
    ),
    document.getElementById('app')
);
```

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

### `initialPropsDidGet(props, prevProps)`

Components defined at `<Route>` can have `initialPropsDidGet`.  
`initialPropsDidGet` is called after the promise is resolved.  
If more than one promise is pending, async-react-router gets only the last executed promise.  
For this, in that case `initialPropsDidGet` is executed only when the last promise is resolved.

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

When you want to push the next history based request, you can use `to` of `Request`.

+ `path` - String of next path.

```javascript
import { Request } from 'async-react-router';

Request.to('/next'); // Change url to `#/next`.
```

### `name(routeName, urlParameters)`

You can make history based request from the `name` defined at `<Route>`.

+ `routeName` - Name defined at `<Route>` for next request.
+ `urlParameters` - Object of next url parameter, if it requires.

```javascript
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Request } from 'async-react-router';

class User extends React.Component {
    render() { return (<div>{this.props.params.userId}</div>); };
}

render(
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

When you want to know current path, you can use `isActive` of `Request`.

```javascript
import { Request } from 'async-react-router';

// When current path is `/`...
Request.isActive('/');     // true
Request.isActive('/path'); // false
```

## URL
### ```to(path)```

When you want to make history based url, you can use `to` of `URL`.

+ `path` - String of path.

```javascript
import { URL } from 'async-react-router';

URL.to('/next'); // String `#/next`.
```

### ```name(routeName, urlParameters)```

You can make history based url from the `name` property of route defined at `<Route>`.

+ `routeName` - Name defined at `<Route>`.
+ `urlParameters` - Object of url parameter, if it requires.

```javascript
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, URL } from 'async-react-router';

class User extends React.Component {
    render() { return (<div>{this.props.params.userId}</div>); };
}

render(
    (
        <Router>
            <Route path="/user/:userId" component={User} name="User"/>
        </Router>
    ),
    document.getElementById('app')
);

URL.name("User", {userId: 1}); // String `#/user/1`.
```

## Thanks for the inspiration
+ [next.js](https://github.com/zeit/next.js/)
+ [react-router](https://github.com/ReactTraining/react-router)
+ [react-enroute](https://github.com/tj/react-enroute)
+ [enroute](https://github.com/lapwinglabs/enroute)
+ [path-to-regex](https://github.com/pillarjs/path-to-regexp)

## License

MIT