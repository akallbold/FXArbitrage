export function redirectToHttps (req, res, next) {
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    // request was via https, so do no special handling
    next()
  } else {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url)
  }
}
