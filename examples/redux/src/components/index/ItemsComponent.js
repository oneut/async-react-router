import React from 'react';
import ItemComponent from "./ItemComponent";
import { URL } from "async-react-router";
import 'bootstrap/dist/css/bootstrap.css';

export default class ItemsComponent extends React.Component {
    render() {
        const itemComponents = this.props.items.map((item) => (<ItemComponent key={item.id} item={item}/>));
        return (
            <div className="container">
                {itemComponents}
                <h3>
                    <a href={URL.name("NewsPage", {page: 2})}>more</a>
                </h3>
            </div>
        );
    }
}
