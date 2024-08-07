$(() => {
  var config = {
    apiKey: 'AIzaSyAvCNUwHoT-pyw61I4dkiz7ZAvtaqWc2NU',
    authDomain: 'top5websites-d9279.firebaseapp.com',
    projectId: 'top5websites-d9279'
  }
  firebase.initializeApp(config)
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
})
