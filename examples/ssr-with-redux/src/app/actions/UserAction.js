import { userActionType } from "../actionTypes/UserActionType";

export const userAction = {
  newInstance: (attributes) => {
    return {
      type: userActionType.NEW_INSTANCE,
      attributes: attributes
    };
  }
};
