# async-react-router

## Motivation
Next.js is wonderful. However, it is difficult to manage State.   
Because next.js does SSR.  
So, I made a react module.

You get initial props from getInitialProps() at first rendering in client side!

## Features
+ Support async/await like next.js.
+ History Support is Hash History Only.
+ No SSR.

## Todo
+ Test...
+ Browser History Support.
+ Error Handling Support.
+ NavLink Support.
+ example
    + basic
    + redux
    + flux-utils

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

@todo

### `<Route>`

@todo

### `<Link>`

@todo

## Component
### `getInitialProps`

Components defined at `<Route>` can have `getInitialProps`.

And `getInitialProps` has arguments.

+ `pathname` - String of the current path.
+ `params` - Object with the parsed url parameter. Defaults to {}.

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