import NProgress from "nprogress";
import React from "react";
import NewsContainer from "../containers/NewsContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NotFoundPage from "./NotFoundPage";
import ItemsAction from "../actions/news/ItemsAction";

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

        const page = attributes.params.page || 1;
        return {
            items: await HackerNewsApi.getTopStoryItems(page)
        };
    }

    static initialPropsStoreHook(props) {
        if (props.items.length) {
            ItemsAction.sync(props.items);
        }
    }

    static initialPropsDidGet() {
        NProgress.done();
    }

    render() {
        if (!this.props.items.length) return (<NotFoundPage/>);

        return (<NewsContainer params={this.props.params}/>);
    }
}