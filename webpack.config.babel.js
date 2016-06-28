import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const { NODE_ENV } = process.env;

export default {
  entry: [
    'react-hot-loader/patch',
    './src/client',
  ],

  output: {
    path: './build',
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.kraken/, loader: 'dsv?delimiter=\t&rows' },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(NODE_ENV) },
    }),
    new HtmlWebpackPlugin({
      template: 'src/assets/index.html',
      inject: true,
    }),
  ],

  devtool: '#cheap-module-inline-source-map',

  devServer: {
    contentBase: './build',
    port: 3000,
    noInfo: true,
  },
};
