const importData = require('../service/import-data.js')

var importcsv = function (req, res, next) {
  if (req.params.filepath !== null) {
    importData.importcsv(req.params.filepath)
    res.json({ status: 200, data: 'Importing... please check log.' })
  }
}

module.exports = {
  importcsv: importcsv
}
