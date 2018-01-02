import Immutable from "immutable";
import Item from "../../models/Item";
import NewsActionTypes from "../../actionTypes/NewsActionTypes";

export default function items(state = Immutable.List(), action) {
    switch (action.type) {
        case NewsActionTypes.ADD_ITEMS:
            const newState = Immutable.List();
            return newState.withMutations((newState) => {
                action.items.map((itemAttributes) => newState.push(new Item(itemAttributes)));
            });
        default:
            return state;
    }
}
