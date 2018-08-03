import { commentsType } from "../../storeTypes/CommentsType";

class CommentsAction {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  sync(comments) {
    this.dispatcher.dispatch({
      type: commentsType.SYNC,
      comments: comments
    });
  }
}

export function newCommentsAction(dispatcher) {
  return new CommentsAction(dispatcher);
}
