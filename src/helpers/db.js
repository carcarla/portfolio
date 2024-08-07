const config = require('config')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useNewUrlParser: true, dbName: config.dbName })
mongoose.Promise = global.Promise

module.exports = {
  websitevisits: require('../models/websitevisits')
}
