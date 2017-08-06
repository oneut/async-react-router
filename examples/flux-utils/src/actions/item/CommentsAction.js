import ItemDispatcher from "../../dispatchers/ItemDispatcher";
import CommentsType from "../../storeTypes/CommentsType";

export default class CommentsAction {
    static sync(comments) {
        ItemDispatcher.dispatch({
            type: CommentsType.SYNC,
            comments: comments
        })
    }
}