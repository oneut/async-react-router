import { userActionType } from "../actionTypes/UserType";

export const userAction = {
  newInstance: attributes => {
    return {
      type: userActionType.NEW_INSTANCE,
      attributes: attributes
    };
  }
};
