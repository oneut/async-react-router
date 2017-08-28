import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Header from "../components/common/Header";
import ItemsComponent from "../components/index/ItemsComponent";

class IndexContainer extends React.Component {
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
                <ItemsComponent items={this.props.items}/>
            </div>
        );
    }
}

IndexContainer.propTypes = {
    items: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    items: state.items
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({}, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IndexContainer);
