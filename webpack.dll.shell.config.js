var path = require("path")
var webpack = require("webpack")

module.exports = {
  context: path.join(__dirname, "client/shell"),
  entry: {
    lib: ["./dll_manifest"]
  },
  output: {
    path: path.join(__dirname, "/dll"),
    filename: "[name].js",
    library: "[name]_[hash]",
    pathinfo: true
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "/dll/[name]-manifest.json"),
      name: "[name]_[hash]",
      context: __dirname
    }),
  ]
};
