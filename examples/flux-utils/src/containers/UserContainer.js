import React from "react";
import { Container } from "flux/utils";
import Header from "../components/common/Header";
import UserComponent from "../components/user/UserComponent";

class UserContainer extends React.Component {
  static getStores(props) {
    return [props.stores.userStore];
  }

  static calculateState(prevState, props) {
    return {
      user: props.stores.userStore.getState()
    };
  }

  render() {
    return (
      <div>
        <Header />
        <UserComponent user={this.state.user} />
      </div>
    );
  }
}

const userContainer = Container.create(UserContainer, {
  withProps: true
});
export default userContainer;
