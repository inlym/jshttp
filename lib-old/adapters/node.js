'use strict'

/**
 * Node.js HTTP
 * @see https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_http_request_options_callback
 */

const http = require('http')
const https = require('https')
const getUrl = require('../core/getUrl.js')
const packageInfo = require('../../package.json')

/**
 * Node.js 发起请求适配器
 * @param {object} config 配置项
 *
 * 说明：
 * 1. 本期版本统一不支持 proxy
 * 2. 后续版本支持自定义 agent
 */
module.exports = function nodeAdapter(config) {
  const url = getUrl(config.baseURL, config.url, config.params)

  // 根据 `http` 或 `https` 协议选用对应的模块
  let httpModule = null
  if (url.startsWith('http://')) {
    httpModule = http
  } else if (url.startsWith('https://')) {
    httpModule = https
  } else {
    throw new Error('请求地址请以 `http://` 或 `https://` 开头！')
  }

  const { headers, method } = config

  // 处理 `data`
  let requestData = null
  let contentType = ''
  if (typeof config.data === 'object') {
    requestData = JSON.stringify(config.data)
    contentType = 'application/json'
  } else if (typeof config.data === 'string') {
    requestData = config.data
    contentType = 'text/plain'
  }

  const options = {
    method: method,
    headers: headers,
  }

  if (config.timeout && config.timeout > 0) {
    options.timeout = config.timeout
  }

  return new Promise((resolve, reject) => {
    const request = httpModule.request(url, options, function handleResponse(response) {
      const responseBufferList = []

      response.on('data', function handleResponseData(buf) {
        responseBufferList.push(buf)
      })

      response.on('end', function handleResponseEnd() {
        let responseData = Buffer.concat(responseBufferList)
        if (config.responseType !== 'arraybuffer') {
          responseData = responseData.toString(config.responseEncoding)
        }
        resolve({
          status: response.statusCode,
          statusText: response.statusMessage,
          headers: response.headers,
          data: responseData,
          config: config,
          request: request,
        })
      })
    })

    // 监听 `error` 事件
    request.on('error', function handleRequestError(err) {
      reject(new Error(`请求时发生错误，触发 \`error\` 事件，以下是错误原因：${err}`))
    })

    request.on('timeout', function handleRequestTimeout() {
      /**
       * 请求超时时，需要手动中止请求
       * @see https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_event_timeout
       *
       * `request.abort()` 方法已启用，改用 `request.destroy()`
       * @see https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_request_abort
       */
      request.destroy()
      reject(new Error(`请求已超时(你设置的超时时间为 \`timeout: ${config.timeout}\`，单位：ms)`))
    })

    // 附加一些请求头
    if (!request.getHeader('User-Agent')) {
      request.setHeader('User-Agent', `JsHttp/${packageInfo.version}`)
    }

    if (!request.getHeader('Content-Type') && contentType) {
      request.setHeader('Content-Type', contentType)
    }

    request.end(requestData)
  })
}
