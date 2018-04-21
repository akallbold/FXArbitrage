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
const assetsDir = path.join(__dirname, '/../client/legacy/assets')
const assetsOverwriteDir = path.join(__dirname, '/../client/legacy/assets_overwrite')
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

/* Proxy route for Snapchat Authentication */
const oauthProxyOptions = {
  target: process.env.FB_API_HOST,
  secure: false,
  changeOrigin: true,
  onProxyReq (proxyReq, req) {
    try {
      let parsedToken = req.headers.cookie.match(/auth_token=(.*?);/)

      let token = null
      if (parsedToken !== null && parsedToken.length > 1) {
        token = parsedToken[1]
      } else {
        parsedToken = req.headers.cookie.match(/auth_token=(.*?)$/)
        if (parsedToken !== null && parsedToken.length > 1) {
          token = parsedToken[1]
        }
      }
      proxyReq.setHeader('Authorization', `Bearer token=${token}`)
    } catch (e) {
      console.log('START: error - oauthProxyOptions - onProxyReq')
      console.log(e)
      console.log('END: error - oauthProxyOptions - onProxyReq')
    }
  }
}

// /users/auth/snapchat?social_profile_update=1&origin=
// app.use('/users/auth/snapchat/callback', proxy(oauthProxyOptions))
// app.use('/users/auth/pinterest/callback', proxy(oauthProxyOptions))
// app.use('/users/auth/twitter/callback', proxy(oauthProxyOptions))
app.use('/users/auth', proxy(oauthProxyOptions))

const bridgepointProxyOptions = {
  target: process.env.FB_API_HOST,
  secure: false,
  changeOrigin: true
}
app.use('/api/v3/bridgepoint_data', proxy(bridgepointProxyOptions))

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

// Login
app.get('/login', checkLoggedIn, (req, res) => {
  res.render('login')
})

app.get('/login/unlock', unlock)

app.get('/login/*', checkLoggedIn, (req, res) => {
  res.render('login')
})

app.post('/login', login, (req, res) => {
  res.send(res.locals)
})

app.post('/setServerAuthToken', setServerAuthToken, (req, res) => {
  res.send('Authentication token set')
})

app.get('/sign_up/registration/:registrationToken', checkSignUpComplete, validateRegistrationToken, (req, res) => {
  res.locals.currentUser = getCurrentUser()
  res.render('sign_up')
})

/* Responds with the auth token */
app.get('/usertoken', (req, res) => {
  res.send(req.cookies.auth_token)
})

// New FE Shell App
app.get('/pv/?*', authorize, (req, res) => {
  res.render(path.join(__dirname, '/../client/shell/index.ejs'))
})

/* Log Out Route */
// Todo: This needs to be changed to 'destroy' method
app.get('/users/sign_out', logout, (req, res) => {
  res.redirect('/login')
})

/* Default Route */
app.get('/*', authorize, (req, res) => {
  res.redirect('/pv')
})

const port = process.env.PORT || 3001
const server = app.listen(port, () => {
  console.log('server running on port', server.address().port)
})

module.exports = server
