import NProgress from "nprogress";
import React from "react";
import ItemContainer from "../containers/ItemContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NotFoundPage from "./NotFoundPage";
import { newItemDispatcher } from "../dispatchers/ItemDispatcher";
import { newCommentsAction } from "../actions/item/CommentsAction";
import { newItemAction } from "../actions/item/ItemAction";
import { newItemStore } from "../stores/ItemStore";
import { newCommentsStore } from "../stores/CommentsStore";

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

    const itemDispatcher = newItemDispatcher();
    const itemAction = newItemAction(itemDispatcher);
    const itemStore = newItemStore(itemDispatcher);
    const commentsAction = newCommentsAction(itemDispatcher);
    const commentsStore = newCommentsStore(itemDispatcher);
    itemAction.newInstance(this.props.item);

    const params = {
      stores: {
        commentsStore,
        itemStore
      },
      actions: {
        commentsAction
      }
    };

    return <ItemContainer {...params} />;
  }
}
