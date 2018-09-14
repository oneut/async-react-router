import React from "react";
import ItemComponent from "./ItemComponent";
import { URL, Link } from "async-react-router";

export default class ItemsComponent extends React.Component {
  render() {
    const itemComponents = this.props.items.map((item) => (
      <ItemComponent key={item.id} item={item} />
    ));
    return (
      <div className="container">
        {itemComponents}
        <h3>
          <Link
            to={URL.name("NewsPage", { page: +this.props.params.page + 1 })}
          >
            more
          </Link>
        </h3>
      </div>
    );
  }
}
