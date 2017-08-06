import React from "react";
import { Container } from "flux/utils";
import Header from "../components/common/Header";
import ItemComponent from "../components/item/ItemComponent";
import CommentsStore from "../stores/item/CommentsStore";
import ItemStore from "../stores/item/ItemStore";

class ItemContainer extends React.Component {
    static getStores() {
        return [
            CommentsStore,
            ItemStore
        ];
    }

    static calculateState() {
        return {
            comments: CommentsStore.getState(),
            item: ItemStore.getState()
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
                <ItemComponent comments={this.state.comments} item={this.state.item}/>
            </div>
        );
    }
}

const itemContainer = Container.create(ItemContainer);
export default itemContainer;