'use strict'

const axios = require('axios')
const defaults = require('./defaults')
const coreInterceptor = require('./interceptors/core-interceptor')
const aliyunApigwSignatureInterceptor = require('./interceptors/aliyun-apigw-signature')
const getUrl = require('./core/get-url')

function create(defaultConfig) {
  const instance = axios.create(defaultConfig)
  instance.interceptors.request.use(aliyunApigwSignatureInterceptor)
  instance.interceptors.request.use(coreInterceptor)
  instance.getUrl = function instanceGetUrl(config) {
    return getUrl(config.baseURL, config.url, config.params)
  }
  return instance
}

const jshttp = create(defaults)
jshttp.create = create

module.exports = jshttp
