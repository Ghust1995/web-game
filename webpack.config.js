module.exports = {
  entry: "./js/main.js",
  output: {
    path: "./public/build/",
    filename: "bundle.js",
  },
  devtool: "eval-cheap-module-source-map"
};
