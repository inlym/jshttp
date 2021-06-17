'use strict'

const { settle, createError, buildFullPath, buildURL } = require('../axios-modules')
const statuses = require('../static/statuses')

module.exports = function wxMiniprogramAdapter(config) {
  const fullPath = buildFullPath(config.baseURL, config.url)
  const url = buildURL(fullPath, config.params, config.paramsSerializer)

  return new Promise(function dispatchWxMiniprogramRequest(resolve, reject) {
    let request = wx.request({
      url: url,
      data: config.data,
      header: config.headers,
      timeout: typeof config.timeout === 'number' && config.timeout > 0 ? config.timeout : undefined,
      method: config.method.toUpperCase(),
      success(res) {
        const response = {
          data: res.data,
          status: res.statusCode,
          statusText: statuses[res.statusCode] || 'UnKnown',
          headers: res.header,
          config,
          request,
        }
        settle(resolve, reject, response)
      },
      fail() {
        reject(createError('Network Error', config, null, request))
        request = null
      },
    })
  })
}
