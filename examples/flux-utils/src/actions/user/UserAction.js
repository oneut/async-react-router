import UserDispatcher from "../../dispatchers/UserDispatcher";
import UserType from "../../storeTypes/UserType";

export default class UserAction {
    static newInstance(attributes) {
        UserDispatcher.dispatch({
            type: UserType.NEW_INSTANCE,
            attributes: attributes
        });
    }
}