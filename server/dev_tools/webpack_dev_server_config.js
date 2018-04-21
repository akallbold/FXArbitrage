/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const portalConfig = require('../../webpack.portal.dev.config.js')
const legacyConfig = require('../../webpack.legacy.dev.config.js')
const shellConfig = require('../../webpack.shell.config.js')

const webpackMiddlewareInit = (app) => {
  const portalCompiler = webpack(portalConfig)
  const legacyCompiler = webpack(legacyConfig)
  const shellCompiler = webpack(shellConfig)

  if (process.env.DEV_SERVER_PORTAL) {
    app.use(webpackDevMiddleware(portalCompiler, {
      publicPath: portalConfig.output.publicPath,
      stats: { colors: true }
    }))

    app.use(webpackHotMiddleware(portalCompiler, {
      heartbeat: 2000,
      log: console.log
    }))
  }

  if (process.env.DEV_SERVER_LEGACY) {
    app.use(webpackDevMiddleware(legacyCompiler, {
      publicPath: legacyConfig.output.publicPath,
      stats: { colors: true }
    }))

    app.use(webpackHotMiddleware(legacyCompiler, {
      heartbeat: 2000,
      log: console.log
    }))
  }

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
