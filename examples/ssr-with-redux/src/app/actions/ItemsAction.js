import { itemsActionType } from "../actionTypes/ItemsType";

export const itemsAction = {
  sync: (items) => {
    return {
      type: itemsActionType.SYNC,
      items: items
    };
  }
};
