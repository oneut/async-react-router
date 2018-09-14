import Immutable from "immutable";
import ItemActionTypes from "../../actionTypes/ItemActionTypes";
import Comment from "../../models/Comment";

export default function comments(state = Immutable.List(), action) {
  switch (action.type) {
    case ItemActionTypes.ADD_COMMENTS:
      const newState = Immutable.List();
      return newState.withMutations((newState) => {
        action.comments.forEach((commentAttributes) =>
          newState.push(new Comment(commentAttributes))
        );
      });
    case ItemActionTypes.CLEAR_COMMENTS:
      return Immutable.List();
    default:
      return state;
  }
}
