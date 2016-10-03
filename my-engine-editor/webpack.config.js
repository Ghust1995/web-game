var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'frontend', 'build');
var APP_DIR = path.resolve(__dirname, 'frontend', '');

var config = {
  entry: path.resolve(APP_DIR, 'index.jsx'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel'
      }
    ]
  },
  devtool: 'cheap-source-map',
};

module.exports = config;
