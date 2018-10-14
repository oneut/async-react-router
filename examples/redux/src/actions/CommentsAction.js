import { commentsActionType } from "../actionTypes/CommentsActionType";

export const commentsAction = {
  sync: (comments) => {
    return {
      type: commentsActionType.SYNC,
      comments: comments
    };
  }
};
