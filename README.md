# react-async-router

## Motivation
Next.js is wonderful. However, it is difficult to manage State.   
Because next.js does SSR.  
So, I made a react module.

You get initial props from getInitialProps() at first rendering in client side!

## Features
+ Support async/await like next.js.
+ History Support is Hash History Only.
+ No SSR.

## Installation

## Example
```javascript
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link } from '../../async-react-router/src';

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


## Todo
+ Test...
+ Browser History Support.
+ Error Handling Support.
+ NavLink Support.
+ Context Support.
     + location
     + helper method (isActive etc...)

## Thanks for the inspiration
+ [next.js](https://github.com/zeit/next.js/)
+ [react-router](https://github.com/ReactTraining/react-router)
+ [react-enroute](https://github.com/tj/react-enroute)
+ [enroute](https://github.com/lapwinglabs/enroute)
+ [path-to-regex](https://github.com/pillarjs/path-to-regexp)

## License

MIT