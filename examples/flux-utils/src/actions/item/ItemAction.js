import ItemDispatcher from "../../dispatchers/ItemDispatcher";
import ItemType from "../../storeTypes/ItemType";

export default class ItemAction {
    static newInstance(attributes) {
        ItemDispatcher.dispatch({
            type: ItemType.NEW_INSTANCE,
            attributes: attributes
        });
    }
}