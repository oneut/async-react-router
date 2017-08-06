import React from "react";

export default class UserComponent extends React.Component {
    render() {
        return (
            <div className="container">
                <h3>User: {this.props.user.id}</h3>
                <p>created: {this.props.user.created}</p>
                <p>karma: {this.props.user.karma}</p>
            </div>
        );
    }
}