import Immutable from "immutable";
import { ReduceStore } from "flux/utils";
import { itemsType } from "../storeTypes/ItemsType";
import Item from "../models/Item";

class ItemsStore extends ReduceStore {
  getInitialState() {
    return Immutable.List();
  }

  reduce(state, action) {
    switch (action.type) {
      case itemsType.SYNC:
        const newState = Immutable.List();
        return newState.withMutations(newState => {
          action.items.map(itemAttributes =>
            newState.push(new Item(itemAttributes))
          );
        });
      default:
        return state;
    }
  }
}

export function newItemsStore(dispatcher) {
  return new ItemsStore(dispatcher);
}
