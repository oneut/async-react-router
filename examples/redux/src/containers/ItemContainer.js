import React from "react";
import { connect } from "react-redux";
import Header from "../components/common/Header";
import ItemComponent from "../components/item/ItemComponent";

class ItemContainer extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    if (!this.props.item) {
      return null;
    }

    return (
      <div>
        <Header />
        <ItemComponent
          item={this.props.item}
          comments={this.props.comments}
          actions={this.props.actions}
        />
      </div>
    );
  }
}

export default connect((state) => ({
  item: state.item,
  comments: state.comments
}))(ItemContainer);
