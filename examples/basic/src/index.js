import NProgress from "nprogress";
import React from "react";
import { render } from "react-dom";
import { Link, Route, Router } from "async-react-router";
import "nprogress/nprogress.css";

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class Home extends React.Component {
    static async getInitialProps({ pathname, params }) {
        NProgress.start();
        await sleep(1000);
        NProgress.done();
        return {
            message: 'Home is one second sleep.'
        };
    }

    render() {
        return (
            <div>
                <h2>Home</h2>
                <p>
                    This sample uses async / await to control sleep.
                </p>
                <p>
                    {this.props.message}
                </p>
                <ul>
                    <li>
                        <Link to="/page">
                            Page Index
                        </Link>
                        <ul>
                            <li>
                                <Link to="/page/1">
                                    Page 1
                                </Link>
                            </li>
                            <li>
                                <Link to="/page/2">
                                    Page 2
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        );
    };
}

class PageIndex extends React.Component {
    static async getInitialProps({ pathname, params }) {
        NProgress.start();
        await sleep(2000);
        NProgress.done();
        return {
            message: 'Page Index is two second sleep.'
        };
    }

    render() {
        return (
            <div>
                <h2>Page Index</h2>
                <p>
                    {this.props.message}
                </p>
                <ul>
                    <li>
                        <Link to="/">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/page">
                            Page Index
                        </Link>
                        <ul>
                            <li>
                                <Link to="/page/1">
                                    Page 1
                                </Link>
                            </li>
                            <li>
                                <Link to="/page/2">
                                    Page 2
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        );
    };
}

class Page extends React.Component {
    static async getInitialProps({ pathname, params }) {
        NProgress.start();
        await sleep(3000);
        NProgress.done();
        return {
            message: `Page [${params.pageId}] is three second sleep.`
        };
    }

    render() {
        return (
            <div>
                <h2>Page is {this.props.params.pageId}</h2>
                <p>
                    {this.props.message}
                </p>
                <ul>
                    <li>
                        <Link to="/">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/page">
                            Page Index
                        </Link>
                        <ul>
                            <li>
                                <Link to="/page/1">
                                    Page 1
                                </Link>
                            </li>
                            <li>
                                <Link to="/page/2">
                                    Page 2
                                </Link>
                            </li>
                        </ul>
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
