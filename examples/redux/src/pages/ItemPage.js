import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import itemReducer from "../reducers/item";
import ItemContainer from "../containers/ItemContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import ItemActionTypes from "../actionTypes/ItemActionTypes";
import NotFoundPage from "./NotFoundPage";

const store = createStore(itemReducer);

export default class ItemPage extends React.Component {
    static initialPropsWillGet() {
        NProgress.start();
    }

    static async getInitialProps(attributes) {
        const item = await HackerNewsApi.findItem(attributes.params.itemId);
        if (!item) {
            return {
                notFound: true
            };            
        }

        store.dispatch({
            type: ItemActionTypes.NEW_ITEM,
            item: item
        });

        return {
            notFound: false
        };
    }

    static initialPropsDidGet() {
        NProgress.done();
    }

    render() {
        if (this.props.notFound) return (<NotFoundPage/>);

        return (
            <Provider store={store}>
                <ItemContainer />
            </Provider>
        );
    }
}