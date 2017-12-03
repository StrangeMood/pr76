const { resolve } = require('path')
const { HotModuleReplacementPlugin, NamedModulesPlugin, DefinePlugin, ProvidePlugin,
  optimize: { AggressiveMergingPlugin } } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')

require('dotenv').config()

const BASE = {
  entry: {
  },

  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  context: resolve(__dirname, 'src'),

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src'),
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(svg)$/,
        use: ['svg-sprite-loader?symbolId=svg_[name]'],
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin([{ from: resolve(__dirname, 'src', 'public'), to: '' }]),
    new HtmlWebpackPlugin({ template: 'index.ejs' }),
    new DefinePlugin(
      Object.keys(process.env).reduce((obj, key) => {
        obj[`process.env.${key}`] = `"${process.env[key]}"`
        return obj
      }, {})
    ),
    new ProvidePlugin({
      'URLSearchParams': 'url-search-params',
      'window.fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
    }),
  ],
}

if (process.env.NODE_ENV === 'production') {
  module.exports = merge(BASE, {
    entry: {
      bundle: [
        './index.js',
      ],
    },
    output: { filename: '[name]-[chunkhash].js' },
    devtool: false,
    plugins: [
      new AggressiveMergingPlugin(),
    ],
  })
} else {
  module.exports = merge(BASE, {
    entry: {
      bundle: [
        'react-hot-loader/patch',
        './index.js',
      ],
    },
    performance: { hints: false },
    devtool: 'inline-source-map',
    devServer: {
      port: 8090,
      hot: true,
      contentBase: resolve(__dirname, 'dist'),
      publicPath: '/',
      disableHostCheck: true,
      historyApiFallback: true,
    },
    plugins: [
      new HotModuleReplacementPlugin(),
      new NamedModulesPlugin(),
    ],
  })
}
