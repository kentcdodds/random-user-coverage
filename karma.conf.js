/* eslint-env node */
var path = require('path');

var _ = require('lodash');
var here = require('path-here');

var packageJson = require(here('package.json'));
var kcdCommon = packageJson.kcdCommon || {};

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

var coverage = process.env.COVERAGE === 'true';
var ci = process.env.NODE_ENV === 'test:ci';
if (coverage) {
  console.log('-- recording coverage --');
}

var webpackConfig = getTestWebpackConfig();
var entry = path.join(webpackConfig.context, webpackConfig.entry);

module.exports = function(config) {
  var defaultConfig = {
    basePath: './',
    frameworks: ['chai', 'mocha'],
    files: [
      entry
    ],
    exclude: [],
    preprocessors: {
      './src/**/*.test.js': ['webpack']
    },
    reporters: getReporters(),
    webpack: webpackConfig,
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: !ci,
    browsers: ['Firefox'],
    singleRun: ci,
    browserNoActivityTimeout: 20000,
    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-chai',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ]
  };

  config.set(defaultConfig);
};

function getReporters() {
  var reps = ['progress'];
  if (coverage) {
    reps.push('coverage');
  }
  return reps;
}

function getTestWebpackConfig() {
  var testWebpackConfig = require('kcd-common-tools/shared/webpack.config');

  if (coverage) {
    // TODO modifications to webpack config goes here...
  }

  return testWebpackConfig;

}

