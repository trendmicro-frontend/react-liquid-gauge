var path = require('path');
var webpack = require('webpack');

module.exports = {
    debug: true,
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'index.jsx'),
    output: {
        path: path.join(__dirname),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    // https://webpack.github.io/docs/webpack-dev-server.html#additional-configuration-options
    devServer: {
        noInfo: false,
        quite: false,
        lazy: false,
        // https://webpack.github.io/docs/node.js-api.html#compiler
        watchOptions: {
            poll: true // use polling instead of native watchers
        }
    }
};
