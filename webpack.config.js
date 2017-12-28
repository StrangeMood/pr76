const { resolve } = require('path')
const {
  HotModuleReplacementPlugin, NamedModulesPlugin, DefinePlugin, ProvidePlugin,
  optimize: { AggressiveMergingPlugin, CommonsChunkPlugin },
} = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')

require('dotenv').config()

const STYLE_OPTIONS = [
  {
    loader: 'css-loader',
    options: { importLoaders: 1 },
  },
  'postcss-loader',
  'sass-loader',
]

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
        use: process.env.NODE_ENV === 'production' ?
          ExtractTextPlugin.extract({ fallback: 'style-loader', use: STYLE_OPTIONS }) :
          ['style-loader', ...STYLE_OPTIONS],
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(svg)$/,
        loader: 'svg-react-loader',
        query: {
          props: { className: 'icon' },
        },
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin([{ from: resolve(__dirname, 'src', 'public'), to: '' }]),
    new HtmlWebpackPlugin({ template: 'index.ejs' }),
    new DefinePlugin(Object.keys(process.env).reduce((obj, key) => {
      obj[`process.env.${key}`] = `"${process.env[key]}"`
      return obj
    }, {})),
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
      new CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor-[chunkhash].js',
        minChunks(module) {
          const context = module.context
          return context && context.indexOf('node_modules') >= 0
        },
      }),
      new ExtractTextPlugin('styles-[contenthash].css'),
      new AggressiveMergingPlugin(),
      new MinifyPlugin(),
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
      new CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.js',
        minChunks(module) {
          const context = module.context
          return context && context.indexOf('node_modules') >= 0
        },
      }),
      new ExtractTextPlugin('styles.css'),
      new HotModuleReplacementPlugin(),
      new NamedModulesPlugin(),
    ],
  })
}
