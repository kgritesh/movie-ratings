const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const pjson = require('./package.json');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ArchivePlugin = require('webpack-archive-plugin');

const node_dir = path.join(__dirname, 'node_modules');

const env = process.env.NODE_ENV || 'development';

const plugins = [
  new CleanWebpackPlugin(["dist"]),
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(env)
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  }),
  new CopyWebpackPlugin([{
    from: "src/manifest.json",
    transform: function (content, path) {
      const newContent = JSON.stringify({
        description: process.env.npm_package_description,
        version: process.env.npm_package_version,
        name: process.env.npm_package_name,

        ...JSON.parse(content.toString())
      });
      return newContent;
    }
  }, {
    from: "src/img",
    to: "img"
  }])
];

if (env === 'production') {
  plugins.push(
    new UglifyJsPlugin({
      sourceMap: false
    }),
    new ArchivePlugin({
      output: path.join(__dirname, 'pkg', `omdb-ratings-${pjson.version}`),
      format: ['zip']
    })
  );
}

module.exports = {
  entry: {
    background: [path.join(__dirname, "src", "background", "background.js")],
    content: [path.join(__dirname, "src", "content", "content.js")],
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js"
  },
  resolve: {
    alias: {
      'jquery': node_dir + '/jquery/src/jquery.js',
    }
  },

  plugins: plugins
}