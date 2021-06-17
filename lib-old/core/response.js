'use strict'

const statuses = require('../static/statuses.js')

const STATUS = Symbol('response#status')
const STATUS_TEXT = Symbol('response#statusText')
const HEADERS = Symbol('response#headers')
const DATA = Symbol('response#data')

module.exports = class Response {
  constructor(adapterRes) {
    this.config = adapterRes.config
    this.status = adapterRes.status
    this.statusText = adapterRes.statusText
    this.headers = adapterRes.headers
    this.data = adapterRes.data
    this.request = adapterRes.request
  }

  get status() {
    return this[STATUS]
  }

  set status(value) {
    const code = parseInt(value, 10)
    if (isNaN(code) || code < 100 || code > 599) {
      throw new Error('响应状态码的有效范围是 100 ~ 599，当前为 ' + value)
    }
    this[STATUS] = code
  }

  get statusText() {
    return this[STATUS_TEXT] || statuses[this.status]
  }

  set statusText(value) {
    if (!value || typeof value !== 'string') {
      return
    }
    this[STATUS_TEXT] = value
  }

  get headers() {
    return this[HEADERS] || {}
  }

  set headers(value) {
    if (typeof value === 'object') {
      this[HEADERS] = value
    }
  }

  get data() {
    return this[DATA] || null
  }

  set data(value) {
    if (typeof value === 'string' && this.config.responseType === 'json') {
      try {
        const json = JSON.parse(value)
        this[DATA] = json
      } catch (e) {
        this[DATA] = value
      }
    } else {
      this[DATA] = value
    }
  }
}
