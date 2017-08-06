import NProgress from "nprogress";
import React from "react";
import UserContainer from "../containers/UserContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NotFoundPage from "./NotFoundPage";
import UserAction from "../actions/user/UserAction";

export default class UserPage extends React.Component {
    static initialPropsWillGet() {
        NProgress.start();
    }

    static async getInitialProps(attributes) {
        return {
            user: await HackerNewsApi.findUser(attributes.params.userId)
        };
    }

    static initialPropsStoreHook(props) {
        if (props.user) {
            UserAction.newInstance(props.user);
        }
    }

    static initialPropsDidGet() {
        NProgress.done();
    }

    render() {
        if (!this.props.user) return (<NotFoundPage/>);

        return (<UserContainer params={this.props.params}/>);
    }
}