const webpack = require('webpack')
const path = require('path');
const distPath = path.join(__dirname, '/../', 'dist' );
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    devtool: 'source-map',
    context: __dirname+ '/..',
    progress: true,
    entry: [
        "./src/index.js"
    ],
    output: {
        path: distPath,
        filename: "bundle.js"
    },
    plugins: [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new HtmlWebpackPlugin({
                title: 'boilerplate',    
            }),
            new CopyWebpackPlugin([{
                from: './assets', to: distPath
            }
        ]),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                include: path.join(__dirname, '../','src')
            },
            {
                test: /\.scss$|.css$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
};