import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Header from "../components/common/Header";
import UserComponent from "../components/user/UserComponent";

class UserContainer extends React.Component {
    render() {
        return (
            <div>
                <Header/>
                <UserComponent user={this.props.user}/>
            </div>
        );
    }
}

UserContainer.proptypes = {
    user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({}, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserContainer);
