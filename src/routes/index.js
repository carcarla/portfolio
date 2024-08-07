const router = require('express').Router()
const apiRouter = require('./api')
const pageRouter = require('./page')

const config = require('config')
const API_PREFIX = config.get('routers.api')

router.use('/' + config.routers.api, apiRouter, (req, res, next) => {
  if (res.JSONString) {
    res.send(res.JSONString)
  } else {
    next()
  }
})

router.use(['/', '/([a-z]{2,3}_[a-z,A-Z]{2,4})'], pageRouter, (req, res, next) => {
  if (res.viewHtmlString) {
    res.send(res.viewHtmlString)
  } else {
    next()
  }
})

module.exports = router
