'use strict'

const getUrl = require('./getUrl.js')
const mockAdapter = require('../adapters/mock.js')
const STATE = Symbol('context#state')

module.exports = class Context {
  constructor(config) {
    // 检查请求头
    this.checkHeadersUnique(config.headers)

    this.config = config
    this.adapter = config.mock && typeof config.mock === 'object' ? mockAdapter : config.adapter

    /** 公共存储空间 */
    this[STATE] = {}
  }

  /**
   * 以指定名称存储当前时间
   * @param {string} name 名称
   */
  setTime(name) {
    /**
     * 辅助函数：对数字补零到指定位数
     * @param {number} number 被格式化的数字
     * @param {number} digit 格式化的位数
     * @returns {string}
     */
    function zerofill(number, digit = 2) {
      const zero = '0'
      for (let i = 0; i < digit; i++) {
        if (number < Math.pow(10, i + 1)) {
          const str = zero.repeat(digit - i - 1) + number.toString()
          return str
        }
      }
      return number
    }

    const time = new Date()
    const year = time.getFullYear()
    const month = zerofill(time.getMonth())
    const day = zerofill(time.getDate())
    const hour = zerofill(time.getHours())
    const minute = zerofill(time.getMinutes())
    const second = zerofill(time.getSeconds())
    const millisecond = zerofill(time.getMilliseconds(), 3)

    const str = `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`

    this[STATE][name] = time.getTime()
    this[STATE][name + 'Text'] = str
  }

  get state() {
    return this[STATE]
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

  /**
   * 合成打印日志所需的内容
   * @returns {object} content 日志内容对象
   * @returns {number} content.status 响应状态码
   * @returns {string} content.url 请求地址
   * @returns {object} content.config 配置项
   * @returns {number} content.startTime 发起请求任务时间（时间戳）
   * @returns {number} content.endTime 结束请求任务时间（时间戳）
   * @returns {number} content.requestTime 本次发起请求时间（时间戳）
   * @returns {number} content.responseTime 本次结束响应时间（时间戳）
   * @returns {string} content.startTimeText 发起请求任务时间（文本格式）
   * @returns {string} content.endTimeText 结束请求任务时间（文本格式）
   * @returns {string} content.requestTimeText 本次发起请求时间（文本格式）
   * @returns {string} content.responseTimeText 本次结束响应时间（文本格式）
   */
  getLoggingContent() {
    const ctx = this
    return {
      status: ctx.response.status,
      url: ctx.url,
      config: ctx.config,
      startTime: ctx.state.startTime,
      endTime: ctx.state.endTime,
      requestTime: ctx.state.requestTime,
      responseTime: ctx.state.responseTime,
      startTimeText: ctx.state.startTimeText,
      endTimeText: ctx.state.endTimeText,
      requestTimeText: ctx.state.requestTimeText,
      responseTimeText: ctx.state.responseTimeText,
    }
  }
}
