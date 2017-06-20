var webpack = require('webpack');
var path = require('path');

module.exports = {
  //entry: "./public/scripts/Launcher.js",
  entry: "./public/scripts/index.js",
  output: {
    path: __dirname,
    filename: "./public/scripts/bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
            path.resolve(__dirname, "public/scripts")
        ],
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
	        options: {
            	presets: ['babel-preset-es2015'],
                plugins: ['istanbul']
          }
        }  
      },
      {
        test: /\.html$/,
        use: {
            loader: 'html-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "public/menu"),
        use: {
            loader: 'script-loader'
        }
      }
    ]
  },
  node: {
    fs: 'empty'
  }
}

