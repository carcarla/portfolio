const chokidar = require('chokidar')
const config = require('config')
const path = require('path')
const importData = require('./import-data')

if (!config.useS3) {
  const watchfolder = path.join(__dirname, config.csvfolder)
  var watcher = chokidar.watch(watchfolder, {
    ignoreInitial: true,
    persistent: true
  })

  watcher.on('add', path => {
    if (/\.csv$/i.test(path)) {
      importData.importcsv(path)
    }
  })
  console.log('Start watcher on ' + watchfolder)
}
