import React from "react";
import { render } from "react-dom";
import { createRouter } from "async-react-router";
import NotFoundPage from "./pages/NotFoundPage";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";
import "nprogress/nprogress.css";

function FirstComponent() {
  return (
    <div className="text-center" style={{margin: "100px 0"}}>
      <i className="fa fa-cog fa-spin fa-5x fa-fw"/>
    </div>
  )
}

const router = createRouter();
router.setFirstComponent(FirstComponent);
router.asyncRoute("/", () => import("./pages/IndexPage"), "IndexPage");
router.asyncRoute("/news/:page?", () => import("./pages/NewsPage"), "NewsPage");
router.asyncRoute("/item/:itemId", () => import("./pages/ItemPage"), "ItemPage");
router.asyncRoute("/user/:userId", () => import("./pages/UserPage"), "UserPage");
router.asyncRoute("(.*)", NotFoundPage);

router.run((Root) => {
  render(<Root />, document.getElementById("app"));
});
