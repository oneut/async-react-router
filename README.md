# async-react-router

## Attention

This package is alpha version yet.

For this, it causes drastic change.

## Motivation
Next.js is wonderful. However, it is difficult to manage state.   
Because next.js does SSR.  
So, I made a router like next.js.

You get initial props from getInitialProps() at first rendering in client side!

## Features
+ Support async/await like next.js.
+ Support URL parameters.
+ Support [history](https://www.npmjs.com/package/history) package.The following history type are supported.
    + Browser History
    + Hash History
+ No SSR.

## Todo
+ Test...
+ Error Handling Support.
+ NavLink Support.
+ example
    + redux
    + flux-utils
    
## Demo
[Basic Example.](https://oneut.github.io/async-react-router/)

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

`<Router>` manages `Route`.

async-react-router supports [history](https://www.npmjs.com/package/history) package.  
Default history type is **Hash History**.  
If you want change history type to browser history, you can use history property.

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
`<Route>` requires the following parameters.

+ `path` - Any valid URL path that [path-to-regexp](https://github.com/pillarjs/path-to-regexp) understands.
+ `component` -A react component to render only when the location matches.

```javascript
import { Router, Route } from 'async-react-router';

render(
    (
        <Router>
            <Route path="/" component={Home}/>
            <Route path="/user/:userId" component={User}/>
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

## Component defined at `<Route>`
### `getInitialProps(attributes, prevAttributes): Object`

Components defined at `<Route>` can have `getInitialProps` that can use async/await.  
`getInitialProps` perform the rendering after promise has been resolved,　Using `return`, you can pass data to the component defined for route.

And `getInitialProps` has arguments.

+ attributes - Current Route Attributes. 
    + `pathname` - String of the current path.
    + `params` - Object with the parsed url parameter. Defaults to {}.
+ prevAttributes - Previous Route Attributes. First rendering to {}.
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

Components defined at `<Route>` can have `initialPropsWillGet`.  
`initialPropsWillGet` is invoked immediately before mounting occurs. It is called before `getInitialProps()`

`initialPropsWillGet` has arguments.

+ attributes - Current Route Attributes. 
    + `pathname` - String of the current path.
    + `params` - Object with the parsed url parameter. Defaults to {}.
+ prevAttributes - Previous Route Attributes. First rendering to {}.
    + `pathname` - String of the previous path.
    + `params` - Object with the parsed url parameter at previous page. Defaults to {}.

**async/await is not supported.**

### `initialPropsDidGet(props, prevProps)`

Components defined at `<Route>` can have `initialPropsDidGet`.  
`initialPropsDidGet` is called after the promise is resolved.  
If more than one promise is pending, async-react-router gets only the last executed promise.  
Therefore, in that case `initialPropsDidGet` is executed only when the last promise is resolved.

`initialPropsDidGet` has arguments.

+ props - Current props of components defined at `<Route>`. 
    + `pathname` - String of the current path.
    + `params` - Object with the parsed url parameter. Defaults to {}.
    + `{data}` - Data retrieved using `getInitialProps`. 
+ prevProps - Previous props of components defined at `<Route>`. First rendering to {}.
    + `pathname` - String of the previous path.
    + `params` - Object with the parsed url parameter at previous page. Defaults to {}.
    + `{data}` - Data retrieved using `getInitialProps`. 
    
**async/await is not supported.**

## Request
### `to`

When you want to push the next request, you can use `to` of `Request`.

```javascript
import Request from 'async-react-router';

Request.to('/next'); // Change url to `/next`.
```

### `isActive`

When you want to know current url, you can use `isActive` of `Request`.

```javascript
import Request from 'async-react-router';

// When current url is `/`...
Request.isActive('/');     // true
Request.isActive('/path'); // false
```

## Thanks for the inspiration
+ [next.js](https://github.com/zeit/next.js/)
+ [react-router](https://github.com/ReactTraining/react-router)
+ [react-enroute](https://github.com/tj/react-enroute)
+ [enroute](https://github.com/lapwinglabs/enroute)
+ [path-to-regex](https://github.com/pillarjs/path-to-regexp)

## License

MIT