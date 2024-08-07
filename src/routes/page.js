const express = require('express')
const router = express.Router()
const config = require('config')
const authentication = require('../service/authentication')
const helper = require('../helpers/common')

router.get('/', authentication.isAuthenticated, (req, res, next) => {
  res.render('index', { title: 'Top ' + config.numberOfRecord + ' Websites Report', user: 'Login as ' + req.user })
})
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Sign in' })
})
router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Register an account' })
})

module.exports = router
