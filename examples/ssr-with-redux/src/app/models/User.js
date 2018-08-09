import Immutable from "immutable";

const UserRecord = Immutable.Record({
  id: "",
  karma: 0,
  created: null
});

export default class User extends UserRecord {}
