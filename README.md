# async-react-router

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

```
npm install async-react-router react react-dom --save
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
    static async getInitialProps() {
        console.log('Taking a break...');
        await sleep(5000);
        console.log('Five second later');
        return {
            message: 'Home is five second sleep.'
        };
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
### `getInitialProps`

Components defined at `<Route>` can have `getInitialProps`.

And `getInitialProps` has arguments.

+ `pathname` - String of the current path.
+ `params` - Object with the parsed url parameter. Defaults to {}.

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