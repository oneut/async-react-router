import assert from "power-assert";
import Request from "./Request";
import React from "react";

export default class Link extends React.Component {
    click(e) {
        e.preventDefault();
        Request.to(this.props.to);
    }

    render() {
        assert(this.props.to, 'Link is missing the "to" property');
        return (
            <a href={this.props.to} onClick={this.click.bind(this)}>
                {this.props.children}
            </a>
        );
    }
}

