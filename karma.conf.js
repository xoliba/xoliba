// Karma configuration
// Generated on Mon May 22 2017 16:10:12 GMT+0300 (EEST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'test/**/*.js'
      //'public/**/*.js',
      //'public/**/*.ejs'
    ],
    plugins: ['karma-babel-preprocessor', 'karma-webpack', 'karma-mocha', 'karma-chrome-launcher'],
    //plugins: ['karma-webpack'],
    preprocessors: {
        'public/scripts/Launcher.js': ['webpack'],
        'test/**/*.js': ['webpack']
        //'public/**/*.js': ['webpack'],
        //'public/**/*.ejs': ['webpack']
    },
    webpack: require("./webpack.config.js"),
    babelPreprocessor: {
        options: {
            presets: ['es2015']
        }
    },
    client: {
        mocha: {
            opts: 'test/mocha.opts'
        }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity
  })
}
