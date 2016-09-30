var path = require('path');

var buildPath = path.resolve(__dirname, 'public', 'build');
var mainPath = path.resolve(__dirname, 'js', 'main.js');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    mainPath],
  output: {
    path: buildPath,
    publicPath:  '/build/',
    filename: 'bundle.js',
  },
  devtool: 'source-map',
};
