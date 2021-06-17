'use strict'

const { settle } = require('../axios-modules')

/**
 * 用于客户端 Mock 请求数据，并未发送真实的 HTTP 请求
 */

module.exports = function mockAdapter(config) {
  const { mock } = config

  if (typeof mock !== 'object') {
    throw new Error(`配置项 \`mock\` 要求是一个 \`object\` 类型的值，但是你设置的 \`mock\` = \`${mock}\` 为 \`${typeof mock}\` 类型`)
  }

  const { status, statusText, headers, data, error } = mock
  const delay = (mock.delay && parseInt(mock.delay, 10)) || 1

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (error) {
        reject(new Error(error))
      } else {
        resolve({
          status: status || 200,
          statusText: statusText || '',
          headers: headers || {},
          data: data,
          config: config,
          request: Object.create(null),
        })
      }
    }, delay)
  })
}
