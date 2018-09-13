import ejs from "ejs";
import path from "path";
import React from "react";
import { createServerRouter } from "async-react-router/ssr";
import ReactDOMServer from "react-dom/server";
import compress from "compression";
import http from "http";
import express from "express";
import morgan from "morgan";

const port = 3000;

const app = express();
const server = http.createServer(app);

app.use(
  compress({
    filter: function() {
      return true;
    }
  })
);
app.use(morgan("combined"));

let outputFileSystem = null;
let viewFile = "";
if (process.env.NODE_ENV === "production") {
  outputFileSystem = require("fs");
  viewFile = path.join(__dirname, "view/index.html");
} else {
  // Webpack Compiler
  const webpack = require("webpack");
  const webpackConfig = require("../webpack.config.dev");
  const compiler = webpack(webpackConfig);
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const chokidar = require("chokidar");

  // Webpack Dev Middleware
  const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, {
    noInfo: false,
    publicPath: webpackConfig.output.publicPath,
    serverSideRender: true
  });
  app.use(webpackDevMiddlewareInstance);

  // Open browser
  webpackDevMiddlewareInstance.waitUntilValid(function() {
    const openBrowser = require("react-dev-utils/openBrowser");

    const url = "http://localhost:" + port;
    openBrowser(url);
  });

  app.use(
    webpackHotMiddleware(compiler, {
      heartbeat: 10 * 1000
    })
  );

  const watcher = chokidar.watch(path.resolve(__dirname, "./app"));
  watcher.on("all", function() {
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\]src[\/\\]/.test(id)) {
        delete require.cache[id];
      }
    });
  });

  outputFileSystem = compiler.outputFileSystem;
  viewFile = path.join(compiler.outputPath, "view/index.html");

  server.keepAliveTimeout = 0;
}

app.use("/static", express.static(path.join(__dirname, "static")));

app.get("*", function(req, res) {
  const setRoute = require("./app/routes").default;
  const serverRouter = createServerRouter();
  setRoute(serverRouter);

  serverRouter.runUsingPathname(req.url, (Root, data) => {
    outputFileSystem.readFile(viewFile, function(err, result) {
      const compiled = ejs.compile(result.toString("utf8"), "utf8");
      const html = compiled({
        component: ReactDOMServer.renderToString(<Root />),
        data: data
      });

      res.write(html);
      res.end();
    });
  });
});

server.listen(process.env.PORT || port, function() {
  console.log("Listening on");
});
