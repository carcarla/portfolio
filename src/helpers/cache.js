const NodeCache = require('node-cache')
const config = require('config')

const cacheTTL = config.get('cache.TTL')
var cache = null

module.exports = {
  start: function (done) {
    if (cache) {
      return done()
    }
    cache = new NodeCache({ stdTTL: cacheTTL, checkperiod: 0, deleteOnExpire: false, useClones: false })
  },

  instance: function () {
    return cache
  },

  getValue: function (key) {
    return cache.get(key)
  },

  setValue: function (key, value) {
    cache.set(key, value)
  },

  getTtl: function (key) {
    return cache.getTtl(key)
  },

  flushAll: function () {
    cache.flushAll()
  },

  delete: function (key) {
    cache.del(key)
  }
}
