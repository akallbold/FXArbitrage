import express from 'express'
import proxy from 'http-proxy-middleware'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import path from 'path'
import {
  login,
  checkLoggedIn,
  validateRegistrationToken,
  getCurrentUser,
  checkSignUpComplete,
  setServerAuthToken,
  unlock,
  authorize,
  logout
} from './services/authentication'
import {
  redirectToHttps
} from './services/security.js'

const publicRoot = path.join(__dirname, '/../public/')
const buildDir = path.join(__dirname, '/../build/')
const manifestDir = path.join(__dirname, '/../dll/')
const app = express()

if (process.env.NODE_ENV === 'development') {  // eslint-disable-line
  var webpackMiddlewareInit = require('./dev_tools/webpack_dev_server_config').default;  // eslint-disable-line
  webpackMiddlewareInit(app)  // eslint-disable-line
}  // eslint-disable-line

// Set up http -> https redirect
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  app.use(redirectToHttps)
}

app.use(helmet())
app.use(express.static(manifestDir))
app.use(express.static(publicRoot))
app.use(express.static(buildDir))
app.use('/assets', express.static(assetsDir))
app.use('/assets_overwrite', express.static(assetsOverwriteDir))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// handles 404 for missing assets.
app.use((req, res, next) => {
  const pattern = /\.(ico|jpe?g|gif|png|js|css|woff)$/
  if (req.path.match(pattern)) return res.sendStatus(404)
  return next()
})

// Sets up templating.
app.set('views', path.join(__dirname, '/../public/'))
app.set('view engine', 'ejs')

/* Default Route */
app.get('/*', authorize, (req, res) => {
  res.redirect('/pv')
})

const port = process.env.PORT || 3001
const server = app.listen(port, () => {
  console.log('server running on port', server.address().port)
})

module.exports = server
