import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import userReducer from "../reducers/user";
import UserContainer from "../containers/UserContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import UserActionTypes from "../actionTypes/UserActionTypes";
import NotFoundPage from "./NotFoundPage";

const store = createStore(userReducer);

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
            store.dispatch({
                type: UserActionTypes.NEW_USER,
                user: props.user
            });
        }
    }

    static initialPropsDidGet() {
        NProgress.done();
    }

    render() {
        if (!this.props.user) return (<NotFoundPage/>);

        return (
            <Provider store={store}>
                <UserContainer params={this.props.params}/>
            </Provider>
        );
    }
}