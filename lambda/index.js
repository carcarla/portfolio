const http = require('http')
const host = '[Elastic Beanstalk Host]'
const api = '/api/importcsv/'

exports.handler = async (event) => {
  return new Promise((resolve, reject) => {
    var key = event.Records[0].s3.object.key
    key = key.replace(/\+/g, ' ')
    key = decodeURIComponent(key)
    const options = {
      host: host,
      path: api + encodeURIComponent(key),
      method: 'GET'
    }

    const req = http.request(options, (res) => {
      resolve('Success')
    })

    req.on('error', (e) => {
      reject(e.message)
    })

    // send the request
    req.write('')
    req.end()
  })
}
