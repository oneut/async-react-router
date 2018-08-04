import React from "react";
import { URL, Link } from "async-react-router";

export default class CommentComponent extends React.Component {
  render() {
    const commentComponents = this.props.comment.comments
      .filter(comment => !!comment.by)
      .map(comment => <CommentComponent key={comment.id} comment={comment} />);
    return (
      <li>
        <dl>
          <dt>
            <ul className="list-inline">
              <li className="by">
                <Link
                  to={URL.name("UserPage", { userId: this.props.comment.by })}
                >
                  {this.props.comment.by}
                </Link>
              </li>
              <li className="time">{this.props.comment.getTimeAgo()}</li>
            </ul>
          </dt>
          <dd>
            <p dangerouslySetInnerHTML={{ __html: this.props.comment.text }} />
            <ul>{commentComponents}</ul>
          </dd>
        </dl>
      </li>
    );
  }
}
