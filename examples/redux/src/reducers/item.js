import Item from "../models/Item";
import ItemType from "../actionTypes/ItemType";

export default function item(state = null, action) {
    switch (action.type) {
        case ItemType.NEW_INSTANCE:
            return new Item(action.attributes);
        default:
            return state;
    }
}
