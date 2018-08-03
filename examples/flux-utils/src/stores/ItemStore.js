import { ReduceStore } from "flux/utils";
import { itemType } from "../storeTypes/ItemType";
import Item from "../models/Item";

class ItemStore extends ReduceStore {
  getInitialState() {
    return null;
  }

  reduce(state, action) {
    switch (action.type) {
      case itemType.NEW_INSTANCE:
        return new Item(action.attributes);
      case itemType.ADD_COMMENTS:
        return Item;
      default:
        return state;
    }
  }
}

export function newItemStore(dispatcher) {
  return new ItemStore(dispatcher);
}
