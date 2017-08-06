import UserType from "../actionTypes/UserType";

const UserAction = {
    newInstance: (attributes) => {
        return {
            type: UserType.NEW_INSTANCE,
            attributes: attributes
        };
    }
};

export default UserAction;