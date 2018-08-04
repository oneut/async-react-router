import { combineReducers } from "redux";
import comments from "../../reducers/comments";
import item from "../../reducers/item";

const rootReducer = combineReducers({
  comments,
  item
});

export default rootReducer;
