import express from 'express'
import request from 'request'

const router = express.Router()

const proxyOauth = (req, res, next) => {
  const url = `${process.env.ACL_HOST}${req.originalUrl}`

  req.pipe(request(url)).pipe(res)
  res.on('error', (error) => {
    console.error(error)
  })
  next()
}

router.get('/snapchat/callback', proxyOauth, (req, res) => {
  res.redirect('/settings/social_profiles')
})

module.exports = router
