import NewsDispatcher from "../../dispatchers/NewsDispatcher";
import ItemsStore from "../reduceStores/ItemsStore";

const itemsStore = new ItemsStore(NewsDispatcher);
export default itemsStore;