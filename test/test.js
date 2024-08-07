const path = require('path')
const config = require('config')
const expect = require('chai').expect
const should = require('chai').should()
const assert = require('chai').assert
const db = require('../src/helpers/db')
const importData = require('../src/service/import-data')
const reportControllers = require('../src/controllers/report')

const mongoose = require('mongoose')
const websitevisits = mongoose.model('websitevisits')

describe('hooks', () => {
  before(async () => {
    await websitevisits.deleteMany()
    const watchfolder = path.join(__dirname, config.csvfolder)
    await importData.importcsv(watchfolder + 'data.csv')
  })

  describe('number of import CSV records', () => {
    it('should return 40 records', async () => {
      const records = await websitevisits.countDocuments()
      records.should.equal(40)
    })
  })

  describe('top website result', () => {
    it('should return 11 records', async () => {
      var query = reportControllers.topwebsitesQuery('2016-01-06', '2016-01-13')
      const records = await websitevisits.aggregate(query).sort({ visits: -1 })
      records.should.have.lengthOf(11)
      assert.typeOf(records, 'array')
    })
  })

  describe('top website result missing param', () => {
    it('should return null', () => {
      var query = reportControllers.topwebsitesQuery('2016-03-27')
      assert.equal(query, null)
    })
  })

  describe('top website result invalid date format', () => {
    it('should return null', () => {
      var query = reportControllers.topwebsitesQuery('2016-27-03', '2016-01-27')
      assert.equal(query, null)
    })
  })

  describe('top website result with exclusions list', () => {
    it('should return 11 records', async () => {
      var exclusionsList = { data:
        [{ 'host': 'facebook.com', 'excludedSince': '2016-01-12' },
          { 'host': 'google.com', 'excludedSince': '2016-03-12', 'excludedTill': '2016-03-14' }] }
      var query = reportControllers.topwebsitesQuery('2016-01-06', '2016-01-13', exclusionsList)
      const records = await websitevisits.aggregate(query).sort({ visits: -1 })
      records.should.have.lengthOf(11)
      assert.typeOf(records, 'array')
    })
  })

  describe('top website result with exclusions list 2', () => {
    it('should return 12 records', async () => {
      var exclusionsList = { data:
        [{ 'host': 'facebook.com', 'excludedSince': '2016-01-06' },
          { 'host': 'google.com', 'excludedTill': '2016-01-27' }] }
      var query = reportControllers.topwebsitesQuery('2016-01-06', '2016-01-27', exclusionsList)
      const records = await websitevisits.aggregate(query).sort({ visits: -1 })
      records.should.have.lengthOf(12)
      assert.typeOf(records, 'array')
    })
  })

  describe('top website result with exclusions list invalid date format', () => {
    it('will igrone invalid date format record and should return 12 records', async () => {
      var exclusionsList = { data:
        [{ 'host': 'facebook.com', 'excludedSince': '216-01-06' },
          { 'host': 'google.com', 'excludedTill': '2016-01-27' }] }
      var query = reportControllers.topwebsitesQuery('2016-01-06', '2016-01-27', exclusionsList)
      const records = await websitevisits.aggregate(query).sort({ visits: -1 })
      records.should.have.lengthOf(12)
      assert.typeOf(records, 'array')
    })
  })

  after(() => {
    websitevisits.deleteMany()
  })
})

describe('hooks 2', () => {
  before(async () => {
    await websitevisits.deleteMany()
    const watchfolder = path.join(__dirname, config.csvfolder)
    await importData.importcsv(watchfolder + 'data_error.csv')
  })
  describe('import error CSV records', () => {
    it('should return 37 records', async () => {
      const records = await websitevisits.countDocuments()
      records.should.equal(37)
    })
  })
  after(() => {
    websitevisits.deleteMany()
  })
})
