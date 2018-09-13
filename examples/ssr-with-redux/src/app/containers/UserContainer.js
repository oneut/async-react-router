import React from "react";
import { connect } from "react-redux";
import Header from "../components/common/Header";
import UserComponent from "../components/user/UserComponent";

class UserContainer extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    if (!this.props.user) {
      return null;
    }

    return (
      <div>
        <Header />
        <UserComponent user={this.props.user} />
      </div>
    );
  }
}

export default connect((state) => ({
  user: state.user
}))(UserContainer);
