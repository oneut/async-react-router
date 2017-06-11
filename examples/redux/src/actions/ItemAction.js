import ItemActionTypes from "../actionTypes/ItemActionTypes";

const ItemAction = {
    addComments: (comments) => {
        return {
            type: ItemActionTypes.ADD_COMMENTS,
            comments: comments
        };
    }
};

export default ItemAction;
