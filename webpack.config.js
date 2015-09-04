/* eslint-env node */
var webpack = require('webpack');
var WebpackNotifierPlugin = require('webpack-notifier');
var here = require('path-here');
var _ = require('lodash');

var path = require('path');

var packageJson = require(here('package.json'));

var context = process.env.NODE_ENV || 'development';
var exclude = /node_modules/;

var configFns = {
  development: getDevConfig,
  production: getProdConfig,
  test: getTestConfig,
  'test:ci': getTestCIConfig
};

var config = configFns[context]();
addCommonPlugins();

console.log('building version %s in %s mode', packageJson.version, context);

module.exports = config;


function getDevConfig() {
  var devConfig = {
    context: here('src'),
    entry: './index.js',

    stats: {
      colors: true,
      reasons: true
    },

    devtool: 'eval',

    plugins: [],

    resolve: {
      extensions: ['', '.js']
    },

    module: {
      loaders: _.union(
        getJavaScriptLoaders(),
        [
          {
            test: /\.css$/,
            loaders: ['style', 'css']
          },
          {
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader?name=/res/[name].[ext]?[hash]'
          }
        ]
      )
    },
    eslint: {
      emitError: false,
      failOnError: false,
      failOnWarning: false,
      quiet: true
    }
  };

  if (process.env.CI !== 'true') {
    devConfig.plugins = [
      new WebpackNotifierPlugin()
    ];
  }
  return devConfig;
}

function getJavaScriptLoaders() {
  if (context.indexOf('test') === -1 && process.env.COVERAGE !== 'true') {
    return [
      {
        test: /\.js$/,
        loaders: ['babel', 'eslint'],
        exclude: exclude
      }
    ];
  } else {
    return [
      {
        test: /\.test\.js$|\.mock\.js$/, // include only mock and test files
        loaders: ['babel', 'eslint?configFile=other/test.eslintrc'],
        exclude: exclude
      },
      {
        test: /\.js$/,
        loaders: ['isparta'],
        exclude: /node_modules|\.test.js$|\.mock\.js$/ // exclude node_modules and test files
      }
    ];
  }
}

function getProdConfig(noUglify) {
  var prodConfig = _.merge({}, getDevConfig(), {
    output: {
      path: here('dist'),
      filename: 'bundle.js'
    },
    devtool: 'source-map',
    eslint: {
      emitError: true,
      failOnError: true
    }
  });

  prodConfig.plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ];


  // allow getting rid of the UglifyJsPlugin
  // https://github.com/webpack/webpack/issues/1079
  if (!noUglify) {
    prodConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false}
    }));
  }
  return prodConfig;
}

function getTestConfig() {
  return _.merge({}, getDevConfig(), {
    entry: './index.test.js',
    plugins: []
  });
}

function getTestCIConfig() {
  var noUglify = true;
  return _.merge({}, getProdConfig(noUglify), {
    entry: './index.test.js',
    module: {
      postLoaders: [
        // we do this because we don't want the tests uglified
        {test: /\.js$/, loader: 'uglify', exclude: /\.test\.js$|\.mock\.js$/}
      ]
    },
    'uglify-loader': {
      compress: {warnings: false}
    }
  });
}


function addCommonPlugins() {
  config.plugins = config.plugins || [];

  config.plugins.unshift(new webpack.BannerPlugin(getBanner(), {raw: true}));
  // put the global variables before everything else
  config.plugins.unshift(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    VERSION: JSON.stringify(packageJson.version)
  }));
}

function getBanner() {
  return '//! ' + packageJson.name + ' version ' +
    packageJson.version +
    ' built with ♥ by ' +
    (packageJson.contributors || [packageJson.author]).join(', ') +
    ' (ó ì_í)=óò=(ì_í ò)\n';
}
