const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');

// we are merging the webpack.common.js into the webpack.prod.js for the production environment
// this upholds separation of concerns
module.exports = merge(common, {
    mode: 'production'
});
