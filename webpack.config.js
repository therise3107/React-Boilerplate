const path = require('path')
const HtmlWebPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const Dotenv = require('dotenv-webpack')

const config = {}

const PATH = (process.env.NODE_ENV === 'production') ? './.env' : './.env.production'

config.common = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  plugins: [
    new HtmlWebPlugin({
      template: './src/template.ejs'
    }),
    new Dotenv({
      path: PATH
    })
  ]
}

config.development = {
 devtool: 'inline-source-map',
 devServer: {
   compress: true,
   host: 'dev.builder.com',
   port: 3000,
   hot: true
 },
 plugins: [
   new webpack.HotModuleReplacementPlugin()
 ]
}

config.production = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}

module.exports = merge(config.common, config[process.env.NODE_ENV])
