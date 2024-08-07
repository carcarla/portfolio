const _ = require('lodash')
const config = require('config')
const moment = require('moment')
const helper = require('../helpers/common')
const mongoose = require('mongoose')
const websitevisits = mongoose.model('websitevisits')

var generateJson = function (req, res, returnData) {
  if (returnData !== null) {
    res.json({ status: 200, data: returnData })
  } else {
    res.status(500)
    res.json({ status: 500 })
  }
}

var topwebsitesQuery = function (startDate, endDate, exclusionList) {
  if (moment(startDate, config.dateformat, true).isValid() && moment(endDate, config.dateformat, true).isValid()) {
    var filter = []
    var query
    if (!_.isUndefined(exclusionList)) {
      (exclusionList.data).forEach((item) => {
        let dateFilter = {}
        if (_.isUndefined(item.excludedSince) && _.isUndefined(item.excludedTill)) {
          filter.push({ $or: [ { 'website': { $not: new RegExp(item.host.replace('.', '\\.') + '$', 'i') } } ] })
        } else {
          if (!_.isUndefined(item.excludedSince) && moment(item.excludedSince, config.dateformat, true).isValid()) {
            dateFilter.$gt = new Date(item.excludedSince)
          }
          if (!_.isUndefined(item.excludedTill) && moment(item.excludedTill, config.dateformat, true).isValid()) {
            dateFilter.$lt = new Date(item.excludedTill)
          }
          if (!_.isEmpty(dateFilter)) {
            if (!_.isUndefined(item.host)) {
              filter.push({ $or: [ { 'date': { $not: dateFilter } }, { 'website': { $not: new RegExp(item.host.replace('.', '\\.') + '$', 'i') } } ] })
            } else {
              filter.push({ $or: [ { 'date': { $not: dateFilter } } ] })
            }
          }
        }
      })
    }

    if (filter.length > 0) {
      filter.push({ 'date': { $gte: new Date(startDate), $lte: new Date(endDate) } })
      query = [{ $match: { $and: filter } }, { $group: { _id: '$website', visits: { $sum: '$visits' } } }]
    } else {
      query = [{ $match: { 'date': { $gte: new Date(startDate), $lte: new Date(endDate) } } }, { $group: { _id: '$website', visits: { $sum: '$visits' } } }]
    }
    return query
  } else {
    return null
  }
}

var topwebsites = async (req, res, next) => {
  var exclusionList = await helper.requestDataWithCache(config.exclusionList, 'exclusionList')
  var startDate = req.params.startDate !== null ? req.params.startDate : Date.now()
  var endDate = req.params.endDate !== null ? req.params.endDate : Date.now()
  var numberOfRecord = isNaN(req.params.numberOfRecord) ? config.numberOfRecord : req.params.numberOfRecord
  var query = topwebsitesQuery(startDate, endDate, exclusionList)

  if (query !== null) {
    websitevisits.aggregate(query).sort({ visits: -1 }).limit(parseInt(numberOfRecord)).exec((err, docs) => {
      var data
      if (!err) {
        data = docs
      } else {
        console.error(err)
        data = null
      }
      generateJson(req, res, data)
    })
  } else {
    generateJson(req, res, null)
  }
}

var defaultdate = function (req, res, next) {
  websitevisits.find({}).select('date').limit(1).sort({ date: -1 }).exec((err, docs) => {
    var data
    if (!err) {
      data = docs
    } else {
      console.error(err)
      data = null
    }
    generateJson(req, res, data)
  })
}

var availabledates = function (req, res, next) {
  websitevisits.find({}).distinct('date').exec((err, docs) => {
    var data
    if (!err) {
      data = docs
    } else {
      console.error(err)
      data = null
    }
    generateJson(req, res, data)
  })
}

module.exports = {
  topwebsites: topwebsites,
  defaultdate: defaultdate,
  availabledates: availabledates,
  topwebsitesQuery: topwebsitesQuery
}
