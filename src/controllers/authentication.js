const config = require('config')
const helper = require('../helpers/common')
const firebase = require('firebase-admin')
const MSG_SUCCESS = 'SUCCESS!'
const MSG_UNAUTHORIZED = 'UNAUTHORIZED REQUEST!'
const SESSION_COOKIE = 'session'

var sessionLogin = function (req, res, next) {
  var idToken = req.body.idToken.toString()
  var csrfToken = req.body.csrfToken.toString()
  if (!req.cookies || csrfToken !== req.cookies.csrfToken) {
    res.status(401).send(MSG_UNAUTHORIZED)
    return
  }
  var expiresIn = config.authentication.cookies * 60 * 1000
  firebase.auth().verifyIdToken(idToken).then((decodedClaims) => {
    if (new Date().getTime() / 1000 - decodedClaims.auth_time < 5 * 60) {
      return firebase.auth().createSessionCookie(idToken, { expiresIn: expiresIn })
    }
    throw new Error(MSG_UNAUTHORIZED)
  }).then((sessionCookie) => {
    var options = { maxAge: expiresIn, httpOnly: true, secure: false }
    res.cookie(SESSION_COOKIE, sessionCookie, options)
    res.end(JSON.stringify({ status: MSG_SUCCESS }))
  }).catch((error) => {
    console.log(error)
    res.status(401).send(MSG_UNAUTHORIZED)
  })
}

var sessionLogout = function (req, res, next) {
  const sessionCookie = req.cookies.session || ''
  res.clearCookie(SESSION_COOKIE)
  firebase.auth().verifySessionCookie(sessionCookie).then((decodedClaims) => {
    return firebase.auth().revokeRefreshTokens(decodedClaims.sub)
  }).then(() => {
    res.end(JSON.stringify({ status: MSG_SUCCESS }))
  }).catch((error) => {
    res.end(JSON.stringify({ status: error }))
  })
}

module.exports = {
  sessionLogin: sessionLogin,
  sessionLogout: sessionLogout
}
