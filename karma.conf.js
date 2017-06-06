// Karma configuration
// Generated on Mon May 22 2017 16:10:12 GMT+0300 (EEST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'test/**/*.js',
      'public/**/*.js',
      'public/**/*.ejs'
    ],
    //plugins: ['karma-babel-preprocessor'],
    //plugins: ['karma-webpack'],
    preprocessors: {
        'test/**/*.js': ['webpack'],
        'public/**/*.js': ['webpack'],
        //'public/**/*.ejs': ['webpack']
    },
    webpack: require("./webpack.config.js"),
    /*babelPreprocessor: {
        options: {
            modules: "es2015"
        }
    },*/
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
