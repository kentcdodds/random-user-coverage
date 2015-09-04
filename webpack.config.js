var here = require('path-here');

module.exports = {
  context: here('src'),
  entry: './index',
  output: {
    filename: 'bundle.js',
    path: here('dist')
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=/res/[name].[ext]?[hash]'
      }
    ]
  }
};
