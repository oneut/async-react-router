import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import newsRootReducer from "../rootReducers/news";
import NewsContainer from "../containers/NewsContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NotFoundPage from "./NotFoundPage";
import { bindActionCreators } from "redux";
import { itemsAction } from "../actions/ItemsAction";

export default class NewsPage extends React.Component {
  static initialPropsWillGet() {
    NProgress.start();
  }

  static async getInitialProps(attributes) {
    if (
      isNaN(parseFloat(attributes.params.page)) ||
      !isFinite(attributes.params.page)
    ) {
      return {
        items: []
      };
    }

    const page = attributes.params.page || 1;
    return {
      items: await HackerNewsApi.getTopStoryItems(page)
    };
  }

  static initialPropsDidGet() {
    NProgress.done();
  }

  render() {
    if (!this.props.items.length) return <NotFoundPage />;

    const ProviderWrapper = () => {
      const store = createStore(newsRootReducer);

      const actions = {
        items: bindActionCreators(itemsAction, store.dispatch)
      };
      actions.items.sync(this.props.items);

      return (
        <Provider store={store}>
          <NewsContainer params={this.props.params} actions={actions} />
        </Provider>
      );
    };

    return <ProviderWrapper />;
  }
}
