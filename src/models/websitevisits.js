var mongoose = require('mongoose')
var Schema = mongoose.Schema

var dataSchema = new Schema({
  date: { type: Date, required: 'Date cannot be left blank.' },
  website: { type: String, required: 'Website cannot be left blank.' },
  visits: { type: Number, min: 0 }
})

module.exports = mongoose.model('websitevisits', dataSchema)
