const firebase = require('firebase-admin')
const serviceAccount = require('../../config/firebase.json')

var isAuthenticated = function (req, res, next) {
  var sessionCookie = req.cookies.session || ''
  firebase.auth().verifySessionCookie(sessionCookie).then((decodedClaims) => {
    req.user = decodedClaims.email
    next()
  }).catch((error) => {
    console.log(error)
    res.redirect('/login')
  })
}

var isAuthenticatedJSON = function (req, res, next) {
  var sessionCookie = req.cookies.session || ''
  firebase.auth().verifySessionCookie(sessionCookie).then((decodedClaims) => {
    next()
  }).catch((error) => {
    console.log(error)
    res.status(401).json({ status: 401, error: 'UNAUTHORIZED REQUEST!' })
  })
}

var attachCsrfToken = function (url, cookie, value) {
  return function (req, res, next) {
    if (req.url === url) {
      res.cookie(cookie, value)
    }
    next()
  }
}

var init = function () {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
  })
}

module.exports = {
  init: init,
  attachCsrfToken: attachCsrfToken,
  isAuthenticated: isAuthenticated,
  isAuthenticatedJSON: isAuthenticatedJSON
}
