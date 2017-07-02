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
        const user = await HackerNewsApi.findUser(attributes.params.userId);
        if (!user) {
            return {
                notFound: true
            };
        }

        store.dispatch({
            type: UserActionTypes.NEW_USER,
            user: user
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
                <UserContainer params={this.props.params}/>
            </Provider>
        );
    }
}