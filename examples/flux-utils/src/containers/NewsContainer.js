import React from "react";
import { Container } from "flux/utils";
import Header from "../components/common/Header";
import ItemsComponent from "../components/news/ItemsComponent";
import ItemsStore from "../stores/news/ItemsStore";

class NewsContainer extends React.Component {
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
                <ItemsComponent items={this.state.items} params={this.props.params}/>
            </div>
        );
    }
}

const newsContainer = Container.create(NewsContainer);
export default newsContainer;