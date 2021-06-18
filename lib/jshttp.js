'use strict'

const axios = require('axios')
const defaults = require('./defaults')
const coreInterceptor = require('./interceptors/core-interceptor')
const aliyunApigwSignatureInterceptor = require('./interceptors/aliyun-apigw-signature')

function create(defaultConfig) {
  const instance = axios.create(defaultConfig)
  instance.interceptors.request.use(aliyunApigwSignatureInterceptor)
  instance.interceptors.request.use(coreInterceptor)
  return instance
}

const jshttp = create(defaults)
jshttp.create = create

module.exports = jshttp
