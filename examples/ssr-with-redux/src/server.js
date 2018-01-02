import ejs from "ejs";
import path from "path";
import React from "react";
import { RouteResolver } from "async-react-router/ssr";
import ReactDOMServer from "react-dom/server";
import compress from "compression";
import http from "http";
import express from "express";
import morgan from "morgan";

const port = 3000;

const app = express();
const server = http.createServer(app);

app.use(compress());

let outputFileSystem = null;
let viewFile = '';
if (process.env.NODE_ENV === 'production') {
    // Settings Production

    // Log
    app.use(morgan());

    outputFileSystem = require("fs");
    viewFile = path.join(__dirname, 'view/index.html');
} else {
    // Settings Development

    // Log
    app.use(morgan({ format: 'dev', immediate: true }));

    // Webpack Compiler
    const webpack = require('webpack');
    const webpackConfig = require('../webpack.config.dev');
    const compiler      = webpack(webpackConfig);
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");
    const chokidar             = require("chokidar");

    // Webpack Dev Middleware
    const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, {
        noInfo: false,
        publicPath: webpackConfig.output.publicPath,
        serverSideRender: true,
    });
    app.use(webpackDevMiddlewareInstance);

    webpackDevMiddlewareInstance.waitUntilValid(function(){
        console.log('Development Server is in a valid state');

        // opens the url in the default browser
        const opn = require("opn");
        opn('http://localhost:' + port);
    });

    // Step 3: Attach the hot middleware to the compiler & the server
    app.use(webpackHotMiddleware(compiler, {
        heartbeat: 10 * 1000,
    }));

    const watcher = chokidar.watch('./app', {ignored: `/node_modules/`});
    watcher.on('all', function () {
        Object.keys(require.cache).forEach(function (id) {
            if (/[\/\\]src[\/\\]/.test(id)) {
                delete require.cache[id];
            }
        });
    });

    outputFileSystem = compiler.outputFileSystem;
    viewFile = path.join(compiler.outputPath, 'view/index.html');

    server.keepAliveTimeout = 0;
}

app.use("/static", express.static(path.join(__dirname, 'static')));

app.get("/favicon.ico", function (req, res) {
    // favicon
});

app.get("*", function (req, res) {
    const routes = require("./app/routes").default;
    RouteResolver
        .make(routes)
        .resolve(req.url, (component, data) => {
                outputFileSystem.readFile(viewFile, function (err, result) {
                    const compiled = ejs.compile(result.toString('utf8'), 'utf8');
                    const html     = compiled({
                        component: ReactDOMServer.renderToString(component),
                        data: data
                    });

                    res.write(html);
                    res.end();
                });
            }
        );
});

server.listen(process.env.PORT || port, function () {
    console.log("Listening on");
});
