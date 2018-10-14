import { userType } from "../../actionTypes/UserType";

class UserAction {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  newInstance(attributes) {
    this.dispatcher.dispatch({
      type: userType.NEW_INSTANCE,
      attributes: attributes
    });
  }
}

export function newUserAction(dispatcher) {
  return new UserAction(dispatcher);
}
