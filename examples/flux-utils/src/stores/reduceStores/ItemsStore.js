import Immutable from "immutable";
import { ReduceStore} from "flux/utils";
import ItemsType from "../../storeTypes/ItemsType";
import Item from "../../models/Item";

export default class ItemsStore extends ReduceStore {
    getInitialState() {
        return Immutable.List();
    }

    reduce(state, action) {
        switch (action.type) {
            case ItemsType.SYNC:
                const newState = Immutable.List();
                return newState.withMutations((newState) => {
                    action.items.map((itemAttributes) => newState.push(new Item(itemAttributes)));
                });
            default:
                return state;
        }
    }
}