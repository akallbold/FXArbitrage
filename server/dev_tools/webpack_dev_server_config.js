/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const shellConfig = require('../../webpack.shell.config.js')

const webpackMiddlewareInit = (app) => {
  const shellCompiler = webpack(shellConfig)

  if (process.env.DEV_SERVER_SHELL) {
    app.use(webpackDevMiddleware(shellCompiler, {
      publicPath: shellConfig.output.publicPath,
      stats: { colors: true }
    }))

    app.use(webpackHotMiddleware(shellCompiler, {
      heartbeat: 2000,
      log: console.log
    }))
  }
}

export default webpackMiddlewareInit
