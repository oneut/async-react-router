import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import itemRootReducer from "../reducers/item";
import ItemContainer from "../containers/ItemContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NotFoundPage from "./NotFoundPage";
import { bindActionCreators } from "redux";
import { commentsAction } from "../actions/CommentsAction";
import { itemAction } from "../actions/ItemAction";

export default class ItemPage extends React.Component {
  static initialPropsWillGet() {
    NProgress.start();
  }

  static async getInitialProps(attributes) {
    return {
      item: await HackerNewsApi.findItem(attributes.params.itemId)
    };
  }

  static initialPropsDidGet() {
    NProgress.done();
  }

  render() {
    if (!this.props.item) return <NotFoundPage />;

    const ProviderWrapper = () => {
      const store = createStore(itemRootReducer);

      const actions = {
        item: bindActionCreators(itemAction, store.dispatch),
        comments: bindActionCreators(commentsAction, store.dispatch)
      };
      actions.item.newInstance(this.props.item);

      return (
        <Provider store={store}>
          <ItemContainer actions={actions} />
        </Provider>
      );
    };

    return <ProviderWrapper />;
  }
}
