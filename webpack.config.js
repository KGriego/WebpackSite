const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  entry: ["babel-polyfill", "./src/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: "/"
  },
  module: {
    rules: [
      // { test: /\.(png|svg|jpg|gif)$/, use: ["file-loader"] },
      { test: /\.svg$/, loader: "svg-inline-loader" },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" }
      },
      { test: /\.html$/, use: [{ loader: "html-loader" }] },
      {
        test: /\.module\.s(a|c)ss$/,
        loader: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[name]__[local]___[hash:base64:5]",
              camelCase: true,
              sourceMap: isDevelopment
            }
          },
          { loader: "sass-loader", options: { sourceMap: isDevelopment } }
        ]
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        loader: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          { loader: "sass-loader", options: { sourceMap: isDevelopment } }
        ]
      },
      {
        test: /(\.css$)/,
        include: /node_modules/,
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000"
      },
      {
        test: /\.(jpe?g|png)$/i,
        loader: "responsive-loader",
        options: { adapter: require("responsive-loader/sharp") }
      }
    ]
  },
  resolve: {
    extensions: [".jsx", ".js", ".scss", ".css"]
  },
  devServer: { historyApiFallback: true },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? "[name].css" : "[name].[hash].css",
      chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css"
    })
  ]
};
