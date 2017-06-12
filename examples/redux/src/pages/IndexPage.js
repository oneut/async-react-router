import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import indexReducer from "../reducers/index";
import IndexContainer from "../containers/IndexContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import IndexActionTypes from "../actionTypes/IndexActionTypes";
import "nprogress/nprogress.css";

const store = createStore(indexReducer);

export default class IndexPage extends React.Component {
    static initialPropsWillGet() {
        NProgress.start();
    }

    static async getInitialProps() {
        const items = await HackerNewsApi.getTopStoryItems();
        store.dispatch({
            type: IndexActionTypes.ADD_ITEMS,
            items: items
        });
    }

    static initialPropsDidGet() {
        NProgress.done();
    }

    render() {
        return (
            <Provider store={store}>
                <IndexContainer/>
            </Provider>
        );
    }
}