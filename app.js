const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')

// database connection
const db = require('./src/helpers/db')

// watch folder for import CSV
const watcher = require('./src/service/watcher')

// login feature
const authentication = require('./src/service/authentication')
authentication.init()

var index = require('./src/routes/index')

var app = express()

app.use(session({ cookie: { maxAge: 60000 },
  secret: 'secret',
  resave: false,
  saveUninitialized: false }))

// view engine setup
app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, './public')))
app.use(authentication.attachCsrfToken('/login', 'csrfToken', (Math.random() * 100000000000000000).toString()))
app.use(flash())

app.use('/', index)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
