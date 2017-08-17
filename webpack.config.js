const path = require('path')
const HtmlWebPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const Dotenv = require('webpack-dotenv-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const config = {}

const PATH = (process.env.NODE_ENV === 'production') ? './.env.production' : './.env'

config.common = {
  entry: {
    app: ['./src/app.js', './src/assets/stylesheets/main.scss']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.(png|svg|jpg|gif)$/,
         use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebPlugin({
      template: './src/template.ejs'
    }),
    new Dotenv({
      sample: './.env.example',
      path: PATH
    })
  ]
}

config.development = {
 devtool: 'inline-source-map',
 devServer: {
   compress: true,
   host: process.env.HOST,
   port: process.env.PORT,
   hot: true
 },
 module: {
   rules: [
     {
       test: /\.scss$/,
       use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
     }
   ]
 },
 plugins: [
   new webpack.HotModuleReplacementPlugin()
 ]
}

config.production = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader', 'postcss-loader'],
          fallback: 'style-loader'
        })
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('style.css')
  ]
}

module.exports = merge(config.common, config[process.env.NODE_ENV])
