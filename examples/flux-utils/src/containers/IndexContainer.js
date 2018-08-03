import React from "react";
import { Container } from "flux/utils";
import Header from "../components/common/Header";
import ItemsComponent from "../components/index/ItemsComponent";

class IndexContainer extends React.Component {
  static getStores(props) {
    return [props.stores.itemsStore];
  }

  static calculateState(prevState, props) {
    return {
      items: props.stores.itemsStore.getState()
    };
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
        <Header />
        <ItemsComponent items={this.state.items} />
      </div>
    );
  }
}

const indexContainer = Container.create(IndexContainer, {
  withProps: true
});
export default indexContainer;
