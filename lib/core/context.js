'use strict'

const getUrl = require('./getUrl.js')
const mockAdapter = require('../adapters/mock.js')

module.exports = class Context {
  constructor(config) {
    // 检查请求头
    this.checkHeadersUnique(config.headers)

    this.config = config
    this.adapter = config.mock && typeof config.mock === 'object' ? mockAdapter : config.adapter
  }

  /**
   * 用于在中间件中快速获取 `url`
   */
  get url() {
    return getUrl(this.config.baseURL, this.config.url, this.config.params)
  }

  /**
   * 检查请求头是否存在同名字段
   * @param {object} headers 请求头
   *
   * 例如：`content-type` 和 `Content-Type` 为同名字段
   */
  checkHeadersUnique(headers) {
    const keys = Object.keys(headers)
    for (let i = 0; i < keys.length - 1; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        if (keys[i].toUpperCase() === keys[j].toUpperCase()) {
          throw new Error(`请求头中的 \`${keys[i]}\` 和 \`${keys[j]}\` 同名冲突，请检查对应的请求头来源，最多只保留一个！`)
        }
      }
    }
  }

  getHeader(field) {
    if (typeof field !== 'string') {
      return ''
    }
    Object.keys(this.config.headers).forEach((key) => {
      if (key.toUpperCase() === field.toUpperCase()) {
        return this.config.headers[key]
      }
    })
  }

  removeHeader(field) {
    if (typeof field !== 'string') {
      return ''
    }
    Object.keys(this.config.headers).forEach((key) => {
      if (key.toUpperCase() === field.toUpperCase()) {
        delete this.config.headers[key]
      }
    })
  }

  setHeader(field, value) {
    this.removeHeader(field)
    this.config.headers[field] = value
  }

  getParam(field) {
    return this.config.params[field]
  }

  setParam(field, value) {
    this.config.params[field] = value
  }
}