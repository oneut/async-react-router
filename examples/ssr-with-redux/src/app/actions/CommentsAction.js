import { commentsActionType } from "../actionTypes/CommentsType";

export const commentsAction = {
  sync: comments => {
    return {
      type: commentsActionType.SYNC,
      comments: comments
    };
  }
};
