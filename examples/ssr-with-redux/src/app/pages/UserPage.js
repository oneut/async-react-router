import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import userRootReducer from "../reducers/user";
import UserContainer from "../containers/UserContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NotFoundPage from "./NotFoundPage";
import { bindActionCreators } from "redux";
import { userAction } from "../actions/UserAction";

export default class UserPage extends React.Component {
  static initialPropsWillGet() {
    NProgress.start();
  }

  static async getInitialProps(attributes) {
    return {
      user: await HackerNewsApi.findUser(attributes.params.userId)
    };
  }

  static initialPropsDidGet() {
    NProgress.done();
  }

  render() {
    if (!this.props.user) return <NotFoundPage />;

    const ProviderWrapper = () => {
      const store = createStore(userRootReducer);

      const actions = {
        user: bindActionCreators(userAction, store.dispatch)
      };
      actions.user.newInstance(this.props.user);

      return (
        <Provider store={store}>
          <UserContainer params={this.props.params} actions={actions} />
        </Provider>
      );
    };

    return <ProviderWrapper />;
  }
}
