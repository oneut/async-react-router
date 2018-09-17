import React from "react";
import { hydrate } from "react-dom";
import { SSR } from "async-react-router";
import setRoute from "./routes";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";
import "nprogress/nprogress.css";

// Create route object.
const router = SSR.createRouter();

// Set data from server
router.setInitialProps(
  JSON.parse(document.getElementById("initial-props").innerText)
);

// Set route.
setRoute(router);

// Render.
router.run((Root) => {
  hydrate(<Root />, document.getElementById("app"));
});

if (module.hot) {
  module.hot.accept("./routes", () => {
    const setRoute = require("./routes").default;

    const router = SSR.createRouter();

    // Set route.
    setRoute(router);

    // Render.
    router.run((RootComponent) => {
      hydrate(<RootComponent />, document.getElementById("app"));
    });
  });
}
