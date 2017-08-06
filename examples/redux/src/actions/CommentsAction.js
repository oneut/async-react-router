import CommentsType from "../actionTypes/CommentsType";

const CommentsAction = {
    sync: (comments) => {
        return {
            type: CommentsType.SYNC,
            comments: comments
        };
    }
};

export default CommentsAction;
