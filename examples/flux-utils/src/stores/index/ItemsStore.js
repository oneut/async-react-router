import IndexDispatcher from "../../dispatchers/IndexDispatcher";
import ItemsStore from "../reduceStores/ItemsStore";

const itemsStore = new ItemsStore(IndexDispatcher);
export default itemsStore;