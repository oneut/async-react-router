import { itemActionType } from "../actionTypes/ItemActionType";

export const itemAction = {
  newInstance: (attributes) => {
    return {
      type: itemActionType.NEW_INSTANCE,
      attributes: attributes
    };
  }
};
