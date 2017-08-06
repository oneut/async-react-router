import NewsDispatcher from "../../dispatchers/NewsDispatcher";
import ItemsType from "../../storeTypes/ItemsType";

export default class ItemsAction {
    static sync(items) {
        NewsDispatcher.dispatch({
            type: ItemsType.SYNC,
            items: items
        })
    }
}