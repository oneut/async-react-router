import ItemDispatcher from "../../dispatchers/ItemDispatcher";
import CommentsStore from "../reduceStores/CommentsStore";

const commentsStore = new CommentsStore(ItemDispatcher);
export default commentsStore;