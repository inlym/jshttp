'use strict'

/**
 * 支付宝小程序
 * @see https://opendocs.alipay.com/mini/api/owycmh
 */

const createMiniAdapter = require('./mini-base.js')

const options = {
  /** 所在平台简称 */
  name: 'my',

  /** 对应的全局变量 */
  platform: my,

  /** 支持的请求方法 */
  methods: ['GET', 'POST', 'PUT', 'DELETE'],

  /** 参数别名 */
  alias: {
    requestHeaders: 'headers',
    responseHeaders: 'headers',
    statusCode: 'status',
  },
}

module.exports = createMiniAdapter(options)
