import NProgress from "nprogress";
import React from "react";
import { render } from "react-dom";
import { createRouter, Link } from "async-react-router";
import "nprogress/nprogress.css";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Home extends React.Component {
  static initialPropsWillGet(attributes, prevAttributes) {
    console.log("initialPropsWillGet() called...");
    console.log(attributes);
    console.log(prevAttributes);
    NProgress.remove();
    NProgress.start();
    NProgress.set(0.0);
    NProgress.set(0.3);
  }

  static async getInitialProps(attributes, prevAttributes) {
    console.log("getInitialProps() called...");
    console.log(attributes);
    console.log(prevAttributes);
    await sleep(1000);
    return {
      message: "Home is one second sleep."
    };
  }

  static initialPropsDidGet(props, prevProps) {
    console.log("initialPropsDidGet() called...");
    console.log(props);
    console.log(prevProps);
    NProgress.done();
  }

  render() {
    return (
      <div>
        <h2>Home</h2>
        <p>This sample uses async / await to control sleep.</p>
        <p>{this.props.message}</p>
        <ul>
          <li>
            <Link to="/page">Page Index</Link>
            <ul>
              <li>
                <Link to="/page/1">Page 1</Link>
              </li>
              <li>
                <Link to="/page/2">Page 2</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

class PageIndex extends React.Component {
  static initialPropsWillGet(attributes, prevAttributes) {
    console.log("initialPropsWillGet() called...");
    console.log(attributes);
    console.log(prevAttributes);
    NProgress.remove();
    NProgress.start();
    NProgress.set(0.0);
    NProgress.set(0.3);
  }

  static async getInitialProps(attributes, prevAttributes) {
    console.log("getInitialProps() called...");
    console.log(attributes);
    console.log(prevAttributes);
    await sleep(2000);
    return {
      message: "Page Index is two second sleep."
    };
  }

  static initialPropsDidGet(props, prevProps) {
    console.log("initialPropsDidGet() called...");
    console.log(props);
    console.log(prevProps);
    NProgress.done();
  }

  render() {
    return (
      <div>
        <h2>Page Index</h2>
        <p>{this.props.message}</p>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page">Page Index</Link>
            <ul>
              <li>
                <Link to="/page/1">Page 1</Link>
              </li>
              <li>
                <Link to="/page/2">Page 2</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

class Page extends React.Component {
  static initialPropsWillGet(attributes, prevAttributes) {
    console.log("initialPropsWillGet() called...");
    console.log(attributes);
    console.log(prevAttributes);
    NProgress.remove();
    NProgress.start();
    NProgress.set(0.0);
    NProgress.set(0.3);
  }

  static async getInitialProps(attributes, prevAttributes) {
    console.log("getInitialProps() called...");
    console.log(attributes);
    console.log(prevAttributes);
    await sleep(3000);
    return {
      message: `Page [${attributes.params.pageId}] is three second sleep.`
    };
  }

  static initialPropsDidGet(props, prevProps) {
    console.log("initialPropsDidGet() called...");
    console.log(props);
    console.log(prevProps);
    NProgress.done();
  }

  render() {
    return (
      <div>
        <h2>Page is {this.props.params.pageId}</h2>
        <p>{this.props.message}</p>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page">Page Index</Link>
            <ul>
              <li>
                <Link to="/page/1">Page 1</Link>
              </li>
              <li>
                <Link to="/page/2">Page 2</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}

const router = createRouter();
router.route("/", Home);
router.route("/page", PageIndex);
router.route("/page/:pageId", Page);
router.run((Root) => {
  render(<Root />, document.getElementById("app"));
});
