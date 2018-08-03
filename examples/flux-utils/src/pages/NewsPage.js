import NProgress from "nprogress";
import React from "react";
import NewsContainer from "../containers/NewsContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NotFoundPage from "./NotFoundPage";
import { newNewsDispatcher } from "../dispatchers/NewsDispatcher";
import { newItemsAction } from "../actions/news/ItemsAction";
import { newItemsStore } from "../stores/ItemsStore";

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

    const newsDispatcher = newNewsDispatcher();
    const itemsAction = newItemsAction(newsDispatcher);
    const itemsStore = newItemsStore(newsDispatcher);
    itemsAction.sync(this.props.items);

    const params = {
      stores: {
        itemsStore
      }
    };

    return <NewsContainer {...params} params={this.props.params} />;
  }
}
