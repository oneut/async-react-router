import NProgress from "nprogress";
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import userRootReducer from "../rootReducers/user";
import UserContainer from "../containers/UserContainer";
import HackerNewsApi from "../api/HackerNewsApi";
import NotFoundPage from "./NotFoundPage";
import UserAction from "../actions/UserAction";

const store = createStore(userRootReducer);

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
            store.dispatch(UserAction.newInstance(props.user));
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