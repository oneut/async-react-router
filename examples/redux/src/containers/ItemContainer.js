import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Header from "../components/common/Header";
import ItemComponent from "../components/item/ItemComponent";
import ItemAction from "../actions/ItemAction";

class ItemContainer extends React.Component {
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
                <ItemComponent item={this.props.item} comments={this.props.comments} actions={this.props.actions}/>
            </div>
        );
    }
}

ItemContainer.propTypes = {
    item: PropTypes.object.isRequired,
    comments: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    item: state.item,
    comments: state.comments
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(ItemAction, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemContainer);