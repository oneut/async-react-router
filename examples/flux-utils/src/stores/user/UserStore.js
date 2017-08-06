import UserDispatcher from "../../dispatchers/UserDispatcher";
import UserStore from "../reduceStores/UserStore";

const userStore = new UserStore(UserDispatcher);
export default userStore;