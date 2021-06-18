'use strict'

const getDefaultAdapter = require('./core/default-adapter')

const defaults = {
  adapter: getDefaultAdapter(),
}

module.exports = defaults
