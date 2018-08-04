import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import indexRootReducer from "../rootReducers/index";
import IndexContainer from "../containers/IndexContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NotFoundPage from "./NotFoundPage";
import { bindActionCreators } from "redux";
import { itemsAction } from "../actions/ItemsAction";

export default class IndexPage extends React.Component {
  static initialPropsWillGet() {
    NProgress.start();
  }

  static async getInitialProps() {
    return {
      items: await HackerNewsApi.getTopStoryItems()
    };
  }

  static initialPropsDidGet() {
    NProgress.done();
  }

  render() {
    if (!this.props.items.length) return <NotFoundPage />;

    const ProviderWrapper = () => {
      const store = createStore(indexRootReducer);

      const actions = {
        items: bindActionCreators(itemsAction, store.dispatch)
      };
      actions.items.sync(this.props.items);

      return (
        <Provider store={store}>
          <IndexContainer actions={actions} />
        </Provider>
      );
    };

    return <ProviderWrapper />;
  }
}
