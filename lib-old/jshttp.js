'use strict'

const Application = require('./core/applocation.js')
const getDefaults = require('./config/defaults.js')

function createInstance(defaultConfig) {
  const instance = new Application(defaultConfig)

  function request(...args) {
    return instance.request(...args)
  }

  // 挂载常用方法
  const methods = ['get', 'post', 'delete', 'put', 'patch']
  methods.forEach((method) => {
    request[method] = function (...args) {
      return request(method.toUpperCase(), ...args)
    }
  })

  return request
}

module.exports = createInstance(getDefaults())
module.exports.create = createInstance
