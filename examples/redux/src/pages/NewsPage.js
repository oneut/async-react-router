import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import newsRootReducer from "../rootReducers/news";
import NewsContainer from "../containers/NewsContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NotFoundPage from "./NotFoundPage";
import ItemsAction from "../actions/ItemsAction";

const store = createStore(newsRootReducer);

export default class NewsPage extends React.Component {
    static initialPropsWillGet() {
        NProgress.start();
    }

    static async getInitialProps(attributes) {
        if (isNaN(parseFloat(attributes.params.page)) || !(isFinite(attributes.params.page))) {
            return {
                items: [],
            };
        }

        const page  = attributes.params.page || 1;
        return {
            items: await HackerNewsApi.getTopStoryItems(page)
        };
    }

    static initialPropsStoreHook(props) {
        if (props.items.length) {
            store.dispatch(ItemsAction.sync(props.items));
        }
    }

    static initialPropsDidGet() {;
        NProgress.done();
    }

    render() {
        if (!this.props.items.length) return (<NotFoundPage/>);

        return (
            <Provider store={store}>
                <NewsContainer params={this.props.params}/>
            </Provider>
        );
    }
}