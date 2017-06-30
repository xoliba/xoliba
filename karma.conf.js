// Karma configuration
// Generated on Mon May 22 2017 16:10:12 GMT+0300 (EEST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'testdouble'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'test/**/*.js'
    ],
    plugins: [
        'karma-babel-preprocessor',
        'karma-webpack',
        'karma-mocha',
        'karma-testdouble',
        'karma-coverage',
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
    reporters: ['progress', 'coverage'],
    coverageReporter: {
        type: 'lcov',
        dir: 'coverage/'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Firefox'],
    singleRun: true,
    concurrency: Infinity
  })
}
