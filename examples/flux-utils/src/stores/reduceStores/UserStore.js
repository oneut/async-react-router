import { ReduceStore } from "flux/utils";
import UserType from "../../storeTypes/UserType";
import User from "../../models/User";

export default class UserStore extends ReduceStore {
    getInitialState() {
        return null;
    }

    reduce(state, action) {
        switch (action.type) {
            case UserType.NEW_INSTANCE:
                return new User(action.attributes);
            default:
                return state;
        }
    }
}