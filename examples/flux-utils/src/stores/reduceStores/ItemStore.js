import { ReduceStore } from "flux/utils";
import ItemType from "../../storeTypes/ItemType";
import Item from "../../models/Item";

export default class ItemStore extends ReduceStore {
    getInitialState() {
        return null;
    }

    reduce(state, action) {
        switch (action.type) {
            case ItemType.NEW_INSTANCE:
                return new Item(action.attributes);
            case ItemType.ADD_COMMENTS:
                return Item
            default:
                return state;
        }
    }
}