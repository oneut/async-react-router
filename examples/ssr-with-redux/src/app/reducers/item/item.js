import Item from "../../models/Item";
import ItemActionTypes from "../../actionTypes/ItemActionTypes";

export default function item(state = null, action) {
  switch (action.type) {
    case ItemActionTypes.NEW_ITEM:
      return new Item(action.item);
    default:
      return state;
  }
}
