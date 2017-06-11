import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import newsReducer from "../reducers/news";
import NewsContainer from "../containers/NewsContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NewsActionTypes from "../actionTypes/NewsActionTypes";
import "nprogress/nprogress.css";

const store = createStore(newsReducer);

export default class NewsPage extends React.Component {
    static initialPropsWillGet() {
        NProgress.remove();
        NProgress.start();
        NProgress.set(0.0);
        NProgress.set(0.3);
    }

    static async getInitialProps(attributes) {
        const page  = +attributes.params.page || 1;
        const items = await HackerNewsApi.getTopStoryItems(page);
        store.dispatch({
            type: NewsActionTypes.ADD_ITEMS,
            items: items
        });
    }

    static initialPropsDidGet() {
        NProgress.done();
    }

    render() {
        return (
            <Provider store={store}>
                <NewsContainer params={this.props.params}/>
            </Provider>
        );
    }
}