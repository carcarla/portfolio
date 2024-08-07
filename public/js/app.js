var LOGINPAGE_URL = '/login'
var HOMEPAGE_URL = '/'
var API_LOGIN = '/api/sessionLogin'
var API_LOGOUT = '/api/sessionLogout'
var API_DEFAULTDATE = '/api/defaultdate'
var API_TOPWEBSITES = '/api/topwebsites/%start-date%/%end-date%'
var SESSION_COOKIE = 'session'
var CSRF_TOKEN = 'csrfToken'

var isLoginPage = $('.login-form').length > 0 || $('.register-form').length > 0

var checklogin = function () {
  firebase.auth().onAuthStateChanged((user) => {
    var sessionCookie = getCookie(SESSION_COOKIE) || ''
    if (user && sessionCookie !== '') {
      if (isLoginPage) {
        window.location.replace(HOMEPAGE_URL)
      }
    } else {
      if (!isLoginPage) {
        toggleSignOut()
      }
    }
  })
}

var getCookie = function (cname) {
  var name = cname + '='
  var decodedCookie = decodeURIComponent(document.cookie)
  var ca = decodedCookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

var postIdTokenToSessionLogin = function (url, idToken, csrfToken) {
  return $.ajax({
    type: 'POST',
    url: url,
    data: {
      idToken: idToken,
      csrfToken: csrfToken
    },
    contentType: 'application/x-www-form-urlencoded'
  }).done(() => {
    window.location.replace(HOMEPAGE_URL)
  })
}

var loginFormValidation = function () {
  var email = $('input[name=email]').val()
  var password = $('input[name=password]').val()
  if (email.length < 4) {
    $('#message').show().html('Please enter an email address.')
    return false
  }
  if (password.length < 4) {
    $('#message').show().html('Please enter a password.')
    return false
  }
  return true
}

var toggleSignIn = function () {
  if (firebase.auth().currentUser) {
    $.ajax({
      type: 'POST',
      url: API_LOGOUT
    })
  } else {
    if (loginFormValidation()) {
      var email = $('input[name=email]').val()
      var password = $('input[name=password]').val()
      firebase.auth().signInWithEmailAndPassword(email, password).then((data) => {
        return data.user.getIdToken().then(idToken => {
          const csrfToken = getCookie(CSRF_TOKEN)
          return postIdTokenToSessionLogin(API_LOGIN, idToken, csrfToken)
        })
      }).catch((error) => {
        var errorCode = error.code
        var errorMessage = error.message
        if (errorCode === 'auth/wrong-password') {
          $('#message').show().html('Wrong password.')
        } else {
          $('#message').show().html(errorMessage)
        }
        $('.login').attr('disabled', false)
      })
    }
  }
  $('.login').attr('disabled', true)
}

var toggleSignOut = function () {
  $.ajax({
    type: 'POST',
    url: API_LOGOUT
  }).done(() => {
    window.location.replace(LOGINPAGE_URL)
  })
}

var toggleSignUp = function () {
  if (loginFormValidation()) {
    var email = $('input[name=email]').val()
    var password = $('input[name=password]').val()
    firebase.auth().createUserWithEmailAndPassword(email, password).then((data) => {
      $('h1').html('Wellcome')
      $('#message-success').show().html(`Your account already created. <br>
        Please go to <a href="'+LOGINPAGE_URL+'">Login</a> page. You will be redirected in 5 seconds`)
      $('.register-form').hide()
      window.setTimeout(() => {
        window.location.replace(LOGINPAGE_URL)
      }, 5000)
    }).catch((error) => {
      var errorCode = error.code
      var errorMessage = error.message
      if (errorCode === 'auth/weak-password') {
        $('#message').show().html('The password is too weak.')
      } else {
        $('#message').show().html(errorMessage)
      }
      console.log(error)
    })
  }
}

var getDate = function (element) {
  var date
  try {
    date = $.datepicker.parseDate(dateFormat, element.value)
  } catch (error) {
    date = null
  }
}

var getReport = function () {
  $.get(API_TOPWEBSITES.replace(/%start-date%/g, $('#start-date').val()).replace(/%end-date%/g, $('#end-date').val()), (data) => {
    var results = data['data']
    $('#trdata').html('')
    $('#message').hide()
    var string = ''
    if (results.length > 0) {
      $.each(results, (index, result) => {
        string += '<tr><td>' + (index + 1) + '</td><td>' + result['_id'] + '</td><td>' + result['visits'] + '</td></tr>'
      })

      $('#trdata').html(string)
    } else {
      $('#message').show().html('No record. Please select other dates.')
    }
  })
}

$(() => {
  if (!isLoginPage) {
    if ($('#datepicker').length > 0) {
      $.get(API_DEFAULTDATE, (data) => {
        results = data['data']
        var defaultdate
        $.each(results, (index, result) => {
          defaultdate = result['date']
        })
        if (defaultdate !== null) {
          $('#start-date').datepicker('setDate', new Date(defaultdate))
        }
      })
    }

    $('#datepicker').datepicker({ format: 'yyyy-mm-dd', autoclose: true })

    $('#start-date').datepicker()
      .on('changeDate', (e) => {
        getReport()
      })

    $('#end-date').datepicker()
      .on('changeDate', (e) => {
        if (!($('#start-date').val() === $('#end-date').val())) {
          getReport()
        }
      })

    $('#signout').on('click', (e) => {
      e.preventDefault()
      toggleSignOut()
    })
  }

  if (isLoginPage) {
    checklogin()

    $('.login-form').submit((e) => {
      e.preventDefault()
      e.stopPropagation()
      $('#message').hide().html('')
      toggleSignIn()
    })
    $('.register-form').submit((e) => {
      e.preventDefault()
      e.stopPropagation()
      $('#message').hide().html('')
      toggleSignUp()
    })
  }
})
