import { ReduceStore } from "flux/utils";
import { userType } from "../actionTypes/UserType";
import User from "../models/User";

class UserStore extends ReduceStore {
  getInitialState() {
    return null;
  }

  reduce(state, action) {
    switch (action.type) {
      case userType.NEW_INSTANCE:
        return new User(action.attributes);
      default:
        return state;
    }
  }
}

export function newUserStore(dispatcher) {
  return new UserStore(dispatcher);
}
