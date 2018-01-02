import Immutable from "immutable";
import User from "../../models/User";
import UserActionTypes from "../../actionTypes/UserActionTypes";

export default function user(state = Immutable.List(), action) {
    switch (action.type) {
        case UserActionTypes.NEW_USER:
            return new User(action.user);
        default:
            return state;
    }
}
