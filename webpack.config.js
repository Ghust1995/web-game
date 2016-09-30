var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public', 'build');
var MAIN_DIR = path.resolve(__dirname, 'js', 'main.js');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    MAIN_DIR],
  output: {
    path: BUILD_DIR,
    publicPath:  '/build/',
    filename: 'bundle.js',
  },
  devtool: 'cheap-source-map',
};
