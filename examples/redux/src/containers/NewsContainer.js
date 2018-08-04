import React from "react";
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
        <Header />
        <ItemsComponent items={this.props.items} params={this.props.params} />
      </div>
    );
  }
}

export default connect(state => ({
  items: state.items
}))(NewsContainer);
