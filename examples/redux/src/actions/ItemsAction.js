import ItemsType from "../actionTypes/ItemsType";

const ItemsAction = {
    sync: (items) => {
        return             {
            type: ItemsType.SYNC,
            items: items
        };
    }
};

export default ItemsAction;