'use strict'

const getDefaultAdapter = require('./core/default-adapter')
const paramsSerializer = require('./core/params-serializer')

const defaults = {
  adapter: getDefaultAdapter(),
  paramsSerializer,
}

module.exports = defaults
