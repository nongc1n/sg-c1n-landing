const path = require("path");

module.exports = {
  mode: process.env.ENVIRONMENT,
  entry: "./src/demo/index.js",
  output: {
    path: path.resolve(__dirname, "dist/demo"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, "src/demo"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src/demo"),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        include: path.resolve(__dirname, "src/demo"),
      },
    ],
  },
  devServer: {
    static: "dist/demo",
  },
};
