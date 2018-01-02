import React from "react";
import { URL, Link } from "async-react-router";

export default class Header extends React.Component {
    render () {
        return (
            <header className="navbar navbar-default">
                <nav className="container">
                    <div className="d-flex justify-content-between hidden-lg-up">
                        <Link to={URL.name("IndexPage")} className="navbar-brand">
                            Redux Example - Hacker News
                        </Link>
                    </div>
                </nav>
            </header>
        );
    }
}
