/*
using the webpack-merge utility to merge our common configuration with development-specific settings. 
We've set the mode to development, added source maps, and configured the webpack-dev-server.
*/
const path = require('path');
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',   // source map is a tool that assists with debuggin
    devServer: {
    static: path.join(__dirname, 'dist'),
    //historyApiFallback: true,
    },
});
