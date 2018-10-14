import Immutable from "immutable";
import Item from "../../models/Item";
import { itemsActionType } from "../../actionTypes/ItemsActionType";

export default function items(state = Immutable.List(), action) {
  switch (action.type) {
    case itemsActionType.SYNC:
      const newState = Immutable.List();
      return newState.withMutations((newState) => {
        action.items.map((itemAttributes) =>
          newState.push(new Item(itemAttributes))
        );
      });
    default:
      return state;
  }
}
