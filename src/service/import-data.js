const fs = require('fs')
const csv = require('fast-csv')
const _ = require('lodash')
const moment = require('moment')
const config = require('config')
const mongoose = require('mongoose')
var Websitevisits = mongoose.model('websitevisits')

var insertData = function (data) {
  var item = new Websitevisits({
    date: data['date'],
    website: data['website'],
    visits: data['visits']
  })
  Websitevisits.findOneAndUpdate(
    {
      'date': data['date'],
      'website': data['website']
    },
    {
      date: data['date'],
      website: data['website'],
      visits: data['visits']
    },
    { upsert: true },
    (error) => {
      if (error) {
        console.log('Error item:' + item)
        console.error(error)
        throw error
      }
    }
  )
}

var importcsv = function (csvfile) {
  if (/\.csv$/i.test(csvfile)) {
    var data = []
    var stream
    console.log('Start to import file: ' + csvfile)
    if (config.useS3) {
      try {
        const AWS = require('aws-sdk')
        const S3 = require('aws-sdk/clients/s3')
        AWS.config.update(config.S3.access)
        const s3 = new S3({ apiVersion: '2006-03-01' })
        const params = { Bucket: config.S3.bucket, Key: csvfile }
        stream = s3.getObject(params).createReadStream()
      } catch (err) {
        console.error(err)
      }
    } else {
      stream = fs.createReadStream(csvfile)
    }
    var csvStream = csv
      .fromStream(stream, { headers: true, delimiter: '|' })
      .validate((data) => {
        return moment(data.date, config.dateformat, true).isValid() && !(isNaN(data.visits)) && !(_.isEmpty(data.website))
      })
      .on('data-invalid', (data) => {
        console.log('Error - date: ' + data.date + ' | visits: ' + data.visits + ' | website: ' + data.website)
      })
      .on('data', (data) => {
        insertData(data)
      })
      .on('end', () => {
      })
  }
}

module.exports = {
  importcsv: importcsv
}
