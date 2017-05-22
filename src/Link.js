import History from "./History";
import React from "react";

export default class Link extends React.Component {
    click(e) {
        e.preventDefault();
        History.push(this.props.to);
    }

    render() {
        return (
            <a href={this.props.to} onClick={this.click.bind(this)}>
                {this.props.children}
            </a>
        );
    }
}

