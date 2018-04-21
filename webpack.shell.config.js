require('dotenv').config() // pulls in env vars
const DotenvWP = require('dotenv-webpack') // does a text replace in the react app for

const webpack = require('webpack')
const path = require('path')

const PostCSSImport = require('postcss-import')
const PostCSSNext = require('postcss-cssnext')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const entryArray = ['babel-polyfill', 'index.js']
const jsLoaders = ['babel-loader']
const manifest = require('./dll/lib-manifest.json')


const pluginsArray = [
  new ExtractTextPlugin({
    filename: 'css/[name].css',
    disable: process.env.NODE_ENV !== 'production'
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new DotenvWP(),
  new webpack.DllReferencePlugin({
    manifest,
    context: __dirname
  })
]

if (process.env.NODE_ENV !== 'production') {
  entryArray.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true')
  pluginsArray.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = {
  context: path.resolve(__dirname, 'client/shell'),
  devtool: 'source-map',
  entry: {
    index: entryArray
  },

  output: {
    path: path.resolve(__dirname, 'build/shell'),
    filename: '[name].bundle.js',
    publicPath: '/shell/'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: loader => [
                  PostCSSImport({ root: loader.resourcePath }),
                  PostCSSNext()
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.(js|jsx)$/,
        use: jsLoaders,
        include: [
          path.resolve(__dirname, 'client/shell')
        ].concat(SubAppPathsForDevelopment)
      },
      {
        test: /\.svg$/,
        include: /img/,
        use: 'svg-react-loader'
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?{pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)\w*/,
        use: 'file-loader',
        include: /fonts/
      }
    ]
  },

  resolve: {
    modules: [
      path.resolve(__dirname),
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'client/shell')

      // path.resolve(__dirname, 'client/shell/assets'),
      // path.resolve(__dirname, 'client/shell/components'),
      // path.resolve(__dirname, 'client/shell/pusher_service'),
      // path.resolve(__dirname, 'client/shell/selectors'),
      // path.resolve(__dirname, 'client/shell/sagas'),
      // path.resolve(__dirname, 'client/shell/reducers'),
      // path.resolve(__dirname, 'client/shell/api'),
      // path.resolve(__dirname, 'client/shell/actions'),
      // path.resolve(__dirname, 'client/shell/fetch-routine')
    ]
  },

  plugins: pluginsArray
}
