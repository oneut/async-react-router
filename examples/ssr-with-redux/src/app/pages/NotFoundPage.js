import NProgress from "nprogress";
import React from "react";

export default class NotFoundPage extends React.Component {
    static initialPropsWillGet() {
        NProgress.start();
    }

    static initialPropsDidGet() {
        NProgress.done();
    }

    render() {
        return (
            <h1 className="text-center">404 Not Found.</h1>
        );
    }
}
