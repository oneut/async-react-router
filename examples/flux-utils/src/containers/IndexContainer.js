import React from "react";
import { Container } from "flux/utils";
import Header from "../components/common/Header";
import ItemsComponent from "../components/index/ItemsComponent";
import ItemsStore from "../stores/index/ItemsStore";

class IndexContainer extends React.Component {
    static getStores() {
        return [ItemsStore];
    }

    static calculateState() {
        return {
            items: ItemsStore.getState()
        }
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
                <Header/>
                <ItemsComponent items={this.state.items}/>
            </div>
        );
    }
}

const indexContainer = Container.create(IndexContainer);
export default indexContainer;