// Karma configuration
// Generated on Mon May 22 2017 16:10:12 GMT+0300 (EEST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'test/**/*.js'
    ],
    plugins: [
        'karma-babel-preprocessor',
        'karma-webpack',
        'karma-mocha',
        'karma-chrome-launcher',
        'karma-firefox-launcher'
    ],
    preprocessors: {
        'test/**/*.js': ['webpack']
    },
    webpack: require("./webpack.config.js"),
    babelPreprocessor: {
        options: {
            presets: ['es2015']
        }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'Firefox'],
    singleRun: true,
    concurrency: Infinity
  })
}
