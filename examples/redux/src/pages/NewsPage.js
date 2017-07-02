import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import newsReducer from "../reducers/news";
import NewsContainer from "../containers/NewsContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NewsActionTypes from "../actionTypes/NewsActionTypes";
import NotFoundPage from "./NotFoundPage";

const store = createStore(newsReducer);

export default class NewsPage extends React.Component {
    static initialPropsWillGet() {
        NProgress.start();
    }

    static async getInitialProps(attributes) {
        if (isNaN(parseFloat(attributes.params.page)) || !(isFinite(attributes.params.page))) {
            return {
                notFound: true
            };
        }

        const page  = attributes.params.page || 1;
        const items = await HackerNewsApi.getTopStoryItems(page)
        if (!items.length) {
            return {
                notFound: true
            };
        }

        store.dispatch({
            type: NewsActionTypes.ADD_ITEMS,
            items: items
        })

        return {
            notFound: false
        };
    }

    static initialPropsDidGet() {;
        NProgress.done();
    }

    render() {
        if (this.props.notFound) {
            return (<NotFoundPage/>);
        }

        return (
            <Provider store={store}>
                <NewsContainer params={this.props.params}/>
            </Provider>
        );
    }
}