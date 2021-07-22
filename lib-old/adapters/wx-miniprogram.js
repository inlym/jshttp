'use strict'

const { settle, createError } = require('../axios-modules')
const statuses = require('../static/statuses')
const getUrl = require('../core/get-url')

module.exports = function wxMiniprogramAdapter(config) {
  const url = getUrl(config.baseURL, config.url, config.params)

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
