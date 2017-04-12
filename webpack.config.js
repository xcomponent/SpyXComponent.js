var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, "dist");
var APP_DIR = path.resolve(__dirname, "src");

var config = {
    entry: ["es6-shim", APP_DIR + "/index.tsx"],
    devtool: "cheap-module-source-map",
    output: {
        path: BUILD_DIR,
        filename: "bundle.js",
        publicPath: "/"
    },
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
        modulesDirectories: [
            "node_modules",
            "src"]
    },
    plugins: process.env.NODE_ENV === "production" ? [
        new HtmlWebpackPlugin(
            {
                hash: true,
                template: "src/index.template.ejs",
                filename: "index.html",
                inject: "body"
            }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ] : [
            new HtmlWebpackPlugin(
                {
                    hash: true,
                    template: "src/index.template.ejs",
                    filename: "index.html",
                    inject: "body"
                })
        ],
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass?outputStyle=expanded&" +
                "includePaths[]=" +
                (encodeURIComponent(path.resolve("./node_modules")))
            }
        ],
        preLoaders: [
            {
                test: /\.tsx?$/,
                loader: "tslint-loader"
            }
        ]
    },
    tslint: {
        typeCheck: false,
        configFile: false,
        failOnHint: true
    }
};

module.exports = config;