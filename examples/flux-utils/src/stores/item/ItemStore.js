import ItemDispatcher from "../../dispatchers/ItemDispatcher";
import ItemStore from "../reduceStores/ItemStore";

const itemStore = new ItemStore(ItemDispatcher);
export default itemStore;