import Axios from 'axios'

const authCookieOptions = { httpOnly: true }
let currentUser = {}

const userParams = (req) => {
  if (!req.body.login || !req.body.password) return false

  return ({
    user_keys: {
      login: req.body.login,
      password: req.body.password
    }
  })
}

const getAuthCookieOptions = () => {
  // Use SSL/ https in production
  if (process.env.NODE_ENV === 'production') {
    authCookieOptions.secure = true
  }
  return authCookieOptions
}

export function getCurrentUser () {
  return currentUser
}

export function checkSignUpComplete (req, res, next) {
  const authToken = req.cookies.auth_token
  if (authToken) {
    return res.redirect('/login')
  }
  return next()
}

export function checkLoggedIn (req, res, next) {
  const authToken = req.cookies.auth_token
  if (authToken) return res.redirect('/')
  return next()
}

// Use SSL/ https in production
if (process.env.NODE_ENV === 'production') {
  authCookieOptions.secure = true
}

export function login (req, res, next) {
  Axios.post(`${process.env.ACL_HOST}/api/v3/users/sessions`, userParams(req))
    .then((response) => {
      if (response.data.response.access_token !== undefined) {
        res.cookie('auth_token', `${response.data.response.access_token}`, getAuthCookieOptions())
        res.locals.authenticated = !!response.data.response.access_token
        res.locals.redirect_path = req.cookies.redirect_path || '/'
      }
      next()
    })
    .catch((error) => {
      console.error(error.response.status, error.response.data.error_description)
      res.status(error.response.status).send({ error: error.response.data.error_description })
    })
}

export function logout (req, res, next) {
  res.cookie('auth_token', '')
  req.session = null
  next()
}

export function unlock (req, res) {
  const unlockParams = {
    unlock_token: req.query.unlock_token
  }
  Axios.post(`${process.env.ACL_HOST}/api/v3/users/unlocks`,
    unlockParams
  ).then(() => {
    res.redirect('/login')
  }).catch((error) => {
    console.log(error)
  })
}

export function setServerAuthToken (req, res, next) {
  if (req.body.token !== req.cookies.auth_token) {
    res.cookie('auth_token', req.body.token, getAuthCookieOptions())
  }
  next()
}

export function validateRegistrationToken (req, res, next) {
  const url = `${process.env.ACL_HOST}/api/v3/users/registrations/`
  Axios.get(url, { params: { invitation_code: req.params.registrationToken } })
    .then((response) => {
      if (response.data.response.id) {
        res.cookie('registrationToken', req.params.registrationToken, { expires: new Date((Date.now() + 24) * 60 * 60 * 1000) })
        currentUser = response.data.response
        next()
      } else {
        res.redirect('/login')
      }
    })
    .catch((error) => {
      console.error(error)
      res.redirect('/login')
    })
}

/**
 * Saves the referer path in a cooke for redirecting after login.
 */
function handleReferer (req, res) {
  const referer = req.path
  const pattern = /\.(ico|js|css)$/
  if (referer !== '/login' && !referer.match(pattern)) {
    res.cookie('redirect_path', `${referer}`)
  }
}

export function authorize (req, res, next) {
  const authToken = req.cookies.auth_token
  if (!authToken) {
    handleReferer(req, res)
    return res.redirect('/login')
  }
  return next()
}
