import React from "react";
import { connect } from "react-redux";
import Header from "../components/common/Header";
import ItemsComponent from "../components/index/ItemsComponent";

class IndexContainer extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <ItemsComponent items={this.props.items} />
      </div>
    );
  }
}

export default connect((state) => ({
  items: state.items
}))(IndexContainer);
