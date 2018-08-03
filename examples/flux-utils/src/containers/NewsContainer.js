import React from "react";
import { Container } from "flux/utils";
import Header from "../components/common/Header";
import ItemsComponent from "../components/news/ItemsComponent";

class NewsContainer extends React.Component {
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
        <ItemsComponent items={this.state.items} params={this.props.params} />
      </div>
    );
  }
}

const newsContainer = Container.create(NewsContainer, {
  withProps: true
});
export default newsContainer;
