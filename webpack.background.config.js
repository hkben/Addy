var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';
const isDevelopment = process.env.NODE_ENV !== 'production';

var alias = {
  '@': path.resolve(__dirname, 'src'),
  '@Background': path.resolve(__dirname, 'src/pages/Background'),
};

var options = {
  mode: process.env.NODE_ENV || 'development',
  // Build background script as a web worker
  target: 'webworker',
  entry: {
    background: path.join(__dirname, 'src', 'pages', 'Background', 'index.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    publicPath: ASSET_PATH,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'source-map-loader',
          },
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    // Replace the browser-specific XML parser with the DOM-free version for AWS SDK.
    new webpack.NormalModuleReplacementPlugin(
      /xml-parser\.browser\.js$/,
      path.resolve(
        __dirname,
        'node_modules/@aws-sdk/xml-builder/dist-es/xml-parser.js'
      )
    ),
    new HtmlWebpackPlugin({
      template: path.join(
        __dirname,
        'src',
        'pages',
        'background',
        'index.html'
      ),
      filename: 'background.html',
      chunks: ['background'],
      cache: false,
    }),
  ],
  infrastructureLogging: {
    level: 'info',
  },
};

if (isDevelopment) {
  options.devtool = 'cheap-module-source-map';
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  };
}

module.exports = options;
