'use strict'

const { settle, createError } = require('../axios-modules')
const statuses = require('../static/statuses')

/**
 * 用于客户端 Mock 请求数据，并未发送真实的 HTTP 请求。
 */

/** 文档地址 */
const docUrl = 'https://www.npmjs.com/package/jshttp#使用'

module.exports = function mockAdapter(config) {
  const { mock } = config

  if (typeof mock !== 'object') {
    throw new Error(`配置项 \`mock\` 要求是一个 \`object\` 类型的值，详情请查看文档 ${docUrl}`)
  }

  // 处理参数，所有参数均为选填
  const status = mock.status || 200
  const statusText = mock.statusText || statuses[status] || 'UnKnown'
  const headers = mock.headers || {}
  const data = mock.data
  const delay = (mock.delay && parseInt(mock.delay, 10)) || 1
  const error = mock.error

  /** 各个平台的 `request` 均不同，这个无法模拟，只能模拟一些基础属性 */
  let request = mock.request || {
    method: config.method,
    headers: config.headers,
    data: config.data,
  }

  // 超时时间，用于模拟请求超时
  const timeout = config.timeout || 0

  return new Promise(function dispatchMockRequest(resolve, reject) {
    /** 请求是否完成 */
    let isRequestFinished = false

    // 模拟请求超时的 `ontimeout` 事件
    if (timeout > 0) {
      setTimeout(() => {
        if (!isRequestFinished) {
          const timeoutErrorMessage = config.timeoutErrorMessage || `timeout of ${timeout} ms exceeded`
          reject(createError(timeoutErrorMessage, config, 'ECONNABORTED', request))
          request = null
        }
      }, timeout)
    }

    // 模拟正常请求流程
    setTimeout(() => {
      isRequestFinished = true

      if (error) {
        // 模拟发生错误的 `onerror` 事件
        reject(createError('Network Error', config, null, request))
        request = null
      } else {
        // 请求成功情况
        const response = { data, status, statusText, headers, config, request }
        settle(resolve, reject, response)
      }
    }, delay)
  })
}
