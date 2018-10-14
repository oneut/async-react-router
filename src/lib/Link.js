import React from "react";

class Link extends React.Component {
  click(e) {
    e.preventDefault();
    this.props.request.to(this.props.to, () => {
      window.scrollTo(0, 0);
    });
  }

  render() {
    return (
      <a
        href={this.props.to}
        className={this.props.className}
        onClick={this.click.bind(this)}
      >
        {this.props.children}
      </a>
    );
  }
}

export function createLink(request) {
  return (props) => {
    return <Link request={request} {...props} />;
  };
}
