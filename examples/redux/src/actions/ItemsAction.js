import { itemsActionType } from "../actionTypes/ItemsActionType";

export const itemsAction = {
  sync: (items) => {
    return {
      type: itemsActionType.SYNC,
      items: items
    };
  }
};
