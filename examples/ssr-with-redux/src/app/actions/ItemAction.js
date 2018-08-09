import { itemActionType } from "../actionTypes/ItemType";

export const itemAction = {
  newInstance: attributes => {
    return {
      type: itemActionType.NEW_INSTANCE,
      attributes: attributes
    };
  }
};
