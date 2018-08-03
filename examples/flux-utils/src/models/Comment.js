import Immutable from "immutable";
import timeago from "timeago.js";

const CommentRecord = Immutable.Record({
  by: "",
  id: 0,
  parent: 0,
  text: "",
  time: null,
  type: "",
  comments: []
});

export default class Comment extends CommentRecord {
  constructor(attributes) {
    const newCommentList = Immutable.List();
    attributes.comments = newCommentList.withMutations(newCommentList => {
      attributes.comments.map(commentAttributes =>
        newCommentList.push(new Comment(commentAttributes))
      );
    });
    super(attributes);
  }

  getTimeAgo() {
    return timeago().format(new Date(this.time * 1000));
  }
}
