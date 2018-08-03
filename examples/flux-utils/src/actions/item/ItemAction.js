import { itemType } from "../../storeTypes/ItemType";

class ItemAction {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }

  newInstance(attributes) {
    this.dispatcher.dispatch({
      type: itemType.NEW_INSTANCE,
      attributes: attributes
    });
  }
}

export function newItemAction(dispatcher) {
  return new ItemAction(dispatcher);
}
