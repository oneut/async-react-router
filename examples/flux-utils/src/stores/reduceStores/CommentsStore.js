import Immutable from "immutable";
import { ReduceStore } from "flux/utils";
import Comment from "../../models/Comment";
import CommentsType from "../../storeTypes/CommentsType";

export default class CommentsStore extends ReduceStore {
    getInitialState() {
        return Immutable.List();
    }

    reduce(state, action) {
        switch (action.type) {
            case CommentsType.SYNC:
                const newState = Immutable.List();
                return newState.withMutations((newState) => {
                    action.comments.forEach((commentAttributes) => newState.push(new Comment(commentAttributes)));
                });
            default:
                return state;
        }
    }
}