import User from "../../models/User";
import { userActionType } from "../../actionTypes/UserActionType";

export default function user(state = null, action) {
  switch (action.type) {
    case userActionType.NEW_INSTANCE:
      return new User(action.attributes);
    default:
      return state;
  }
}
