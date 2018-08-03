import React from "react";
import { Container } from "flux/utils";
import Header from "../components/common/Header";
import ItemComponent from "../components/item/ItemComponent";

class ItemContainer extends React.Component {
  static getStores(props) {
    return [props.stores.commentsStore, props.stores.itemStore];
  }

  static calculateState(prevState, props) {
    return {
      comments: props.stores.commentsStore.getState(),
      item: props.stores.itemStore.getState()
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
        <ItemComponent
          actions={this.props.actions}
          comments={this.state.comments}
          item={this.state.item}
        />
      </div>
    );
  }
}

const itemContainer = Container.create(ItemContainer, {
  withProps: true
});
export default itemContainer;
