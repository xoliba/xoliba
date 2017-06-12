var webpack = require('webpack');
var path = require('path');
new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
});

module.exports = {
  entry: "./public/scripts/Launcher.js",
  output: {
    path: __dirname,
    filename: "./public/scripts/bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
	        options: {
            	presets: ['babel-preset-es2015'],
                plugins: ['istanbul']
          }
        }  
      }
    ]
  },
  node: {
    fs: 'empty'
  }
}

