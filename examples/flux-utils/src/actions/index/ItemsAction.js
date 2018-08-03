import { itemsType } from "../../storeTypes/ItemsType";

class ItemsAction {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  sync(items) {
    this.dispatcher.dispatch({
      type: itemsType.SYNC,
      items: items
    });
  }
}

export function newItemsAction(dispatcher) {
  return new ItemsAction(dispatcher);
}
