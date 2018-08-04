import Item from "../models/Item";
import { itemActionType } from "../actionTypes/ItemType";

export default function item(state = null, action) {
  switch (action.type) {
    case itemActionType.NEW_INSTANCE:
      return new Item(action.attributes);
    default:
      return state;
  }
}
