import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import indexRootReducer from "../rootReducers/index";
import IndexContainer from "../containers/IndexContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NotFoundPage from "./NotFoundPage";
import ItemsAction from "../actions/ItemsAction";

const store = createStore(indexRootReducer);

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
            store.dispatch(ItemsAction.sync(props.items));
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