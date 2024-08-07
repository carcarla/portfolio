const request = require('axios')
const cacheHelper = require('./cache')
const https = require('https')

const agent = new https.Agent({
  rejectUnauthorized: false
})

cacheHelper.start((err) => {
  if (err) console.error(err)
})

var requestData = async (responseURL) => {
  try {
    let response = await request.get(responseURL, { httpsAgent: agent })
    if (response.status === 200) {
      return response
    } else {
      console.error(response)
      return null
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

var requestDataWithCache = async (responseURL, cacheKey) => {
  let ttl = cacheHelper.getTtl(cacheKey)
  let value = cacheHelper.getValue(cacheKey)
  if ((ttl <= Date.now() && value !== undefined) || value === undefined) {
    value = await requestData(responseURL)
    if (value !== null && value !== undefined) {
      cacheHelper.setValue(cacheKey, value)
    } else {
      console.error(`Cannot cache key: ${cacheKey}, value: ${value}`)
    }
  }
  return value
}

module.exports = {
  requestData: requestData,
  requestDataWithCache: requestDataWithCache
}
