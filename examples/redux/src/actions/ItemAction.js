import ItemType from "../actionTypes/ItemType";

const ItemAction = {
    newInstance: (attributes) => {
        return {
            type: ItemType.NEW_INSTANCE,
            attributes: attributes
        };
    }
};

export default ItemAction;