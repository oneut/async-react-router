import React from "react";
import { Container } from "flux/utils";
import Header from "../components/common/Header";
import UserComponent from "../components/user/UserComponent";
import UserStore from "../stores/user/UserStore";

class UserContainer extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static calculateState() {
        return {
            user: UserStore.getState()
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    componentDidUpdate() {
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div>
                <Header/>
                <UserComponent user={this.state.user}/>
            </div>
        );
    }
}

const userContainer = Container.create(UserContainer);
export default userContainer;