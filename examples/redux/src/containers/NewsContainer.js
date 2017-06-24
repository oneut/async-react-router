import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Header from "../components/common/Header";
import ItemsComponent from "../components/news/ItemsComponent";

class NewsContainer extends React.Component {
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
                <ItemsComponent items={this.props.items} params={this.props.params}/>
            </div>
        );
    }
}

NewsContainer.proptypes = {
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
)(NewsContainer);
