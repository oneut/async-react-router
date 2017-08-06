import IndexDispatcher from "../../dispatchers/IndexDispatcher";
import ItemsType from "../../storeTypes/ItemsType";

export default class ItemsAction {
    static sync(items) {
        IndexDispatcher.dispatch({
            type: ItemsType.SYNC,
            items: items
        })
    }
}