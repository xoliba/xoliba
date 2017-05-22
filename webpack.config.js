var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: "./server.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
	    options: {
            	presets: ['babel-preset-es2015']
          }
        }  
      }
    ]
  },
  node: {
    fs: 'empty'
  }
}

