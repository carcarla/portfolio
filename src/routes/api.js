const express = require('express')
const router = express.Router()
const config = require('config')
const authentication = require('../service/authentication')
const helper = require('../helpers/common')
const reportController = require('../controllers/report')
const authController = require('../controllers/authentication')
const importDataController = require('../controllers/import-data')

router.get(['/topwebsites/:startDate/:endDate', '/topwebsites/:startDate/:endDate/:numberOfRecord'], authentication.isAuthenticatedJSON, reportController.topwebsites)
router.get('/defaultdate', authentication.isAuthenticatedJSON, reportController.defaultdate)
router.get('/availabldates', authentication.isAuthenticatedJSON, reportController.availabledates)
router.post('/sessionLogin', authController.sessionLogin)
router.post('/sessionLogout', authController.sessionLogout)

if (config.useS3) {
  router.get('/importcsv/:filepath', importDataController.importcsv)
} else {
  router.get('/importcsv/:filepath', authentication.isAuthenticatedJSON, importDataController.importcsv)
}

module.exports = router
