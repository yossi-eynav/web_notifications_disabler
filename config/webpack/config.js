const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const distPath = path.join(__dirname, '/../', '../', 'dist');
const {isDevEnv} = require('../index');

const configOptions = {
    devtool: isDevEnv() ? 'source-map' : false,
    context: path.join(__dirname, '/../../'),
    entry: {
        content: ['./src/content'],
        background: ['./src/background/']
    },
    output: {
        path: distPath,
        filename: '[name].js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(isDevEnv() ? 'development' : 'production')
        }),
        new CopyWebpackPlugin([
            {from: './static-assets', to: distPath}
        ]),
    ],
    module: {
        loaders: [
            {
                test: /src\/.*\.js$/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, '../','../', 'src'),
                    __dirname
                ]
            },
            {
                test: /\.scss$|.css$/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
};

if (!isDevEnv()) {
    configOptions.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
    configOptions.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            drop_console: true
        }
    }));
}

module.exports = configOptions;