import React from "react";
import { URL } from "async-react-router";

export default class Header extends React.Component {
    render () {
        return (
            <header className="navbar navbar-default">
                <nav className="container">
                    <div className="d-flex justify-content-between hidden-lg-up">
                        <a className="navbar-brand" href={URL.name("IndexPage")}>
                            Redux Example - Hacker News
                        </a>
                    </div>
                </nav>
            </header>
        );
    }
}
