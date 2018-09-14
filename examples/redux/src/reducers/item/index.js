import { combineReducers } from "redux";
import comments from "./comments";
import item from "./item";

const rootReducer = combineReducers({
  comments,
  item
});

export default rootReducer;
