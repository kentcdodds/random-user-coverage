/* eslint-env node */
var here = require('kcd-common-tools/utils/here');
var _ = require('lodash');

module.exports = function(config) {
  var path, devtool;
  if (process.env.NODE_ENV === 'development') {
    path = here('src');
    devtool = 'eval';
  } else if (process.env.NODE_ENV === 'production') {
    path = here('dist');
    devtool = 'source-map';
  }
  delete config.output.libraryTarget;

  config.module.loaders.push({test: /\.css$/, loaders: ['style', 'css']});
  config.module.loaders.push({
    test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader?name=/res/[name].[ext]?[hash]'
  });

  config = _.merge(config, {
    output: {
      path: path,
      filename: 'bundle.js'
    },
    devtool: devtool
  });
  return config;
};
