import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import indexReducer from "../reducers/index";
import IndexContainer from "../containers/IndexContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import IndexActionTypes from "../actionTypes/IndexActionTypes";
import NotFoundPage from "./NotFoundPage";

const store = createStore(indexReducer);

export default class IndexPage extends React.Component {
    static initialPropsWillGet() {
        NProgress.start();
    }

    static async getInitialProps() {
        return {
            items: await HackerNewsApi.getTopStoryItems()
        };
    }

    static initialPropsStoreHook(props) {
        if (props.items.length) {
            store.dispatch({
                type: IndexActionTypes.ADD_ITEMS,
                items: props.items
            });
        }
    }

    static initialPropsDidGet() {
        NProgress.done();
    }

    render() {
        if (!this.props.items.length) return (<NotFoundPage/>);

        return (
            <Provider store={store}>
                <IndexContainer/>
            </Provider>
        );
    }
}