import Immutable from "immutable";
import { commentsActionType } from "../actionTypes/CommentsType";
import Comment from "../models/Comment";

export default function comments(state = Immutable.List(), action) {
  switch (action.type) {
    case commentsActionType.SYNC:
      const newState = Immutable.List();
      return newState.withMutations((newState) => {
        action.comments.forEach((commentAttributes) =>
          newState.push(new Comment(commentAttributes))
        );
      });
    default:
      return state;
  }
}
