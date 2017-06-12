import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import itemReducer from "../reducers/item";
import ItemContainer from "../containers/ItemContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import ItemActionTypes from "../actionTypes/ItemActionTypes";
import "nprogress/nprogress.css";

const store = createStore(itemReducer);

export default class ItemPage extends React.Component {
    static initialPropsWillGet() {
        NProgress.start();
    }

    static async getInitialProps(attributes) {
        const item = await HackerNewsApi.findItem(attributes.params.itemId);
        store.dispatch({
            type: ItemActionTypes.NEW_ITEM,
            item: item
        });
        store.dispatch({
            type: ItemActionTypes.CLEAR_COMMENTS,
        });
    }

    static initialPropsDidGet() {
        NProgress.done();
    }

    render() {
        return (
            <Provider store={store}>
                <ItemContainer />
            </Provider>
        );
    }
}