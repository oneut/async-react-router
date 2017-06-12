import React from "react";
import { URL } from "async-react-router";

export default class ItemComponent extends React.Component {
    render() {
        return (
            <div className="news-item">
                <h3 className="title"><a href={this.props.item.getUrl()}>{this.props.item.title}</a></h3>
                <div>
                    <ul className="list-inline">
                        <li className="score">{this.props.item.score} points</li>
                        <li className="by">by <a href={URL.name("UserPage", {userId: this.props.item.by})}>{this.props.item.by}</a></li>
                        <li className="time">{this.props.item.getTimeAgo()}</li>
                        <li className="comments-link"><a href={URL.name("ItemPage", {itemId: this.props.item.id})}>{this.props.item.descendants} comments</a></li>
                    </ul>
                </div>
            </div>
        );
    }
}
