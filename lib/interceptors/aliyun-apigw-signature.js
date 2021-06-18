'use strict'

const CryptoJS = require('crypto-js')
const getUrl = require('../core/getUrl')

/** 放在 `config.headers` 中但是非正常请求头字段的字段 */
const axiosExtHeader = ['common', 'delete', 'get', 'head', 'patch', 'post', 'put']

/**
 * 规格化请求头
 * 1. 将字段名变为小写
 * 2. 去除重复的字段
 */
function normalizeHeaders(headers) {
  if (typeof headers !== 'object') {
    return {}
  } else {
    return Object.keys(headers).reduce((result, field) => {
      console.log('field: ', field)
      const lowerField = field.toLowerCase()
      if (!result[lowerField] && headers[field] && !axiosExtHeader.includes(field)) {
        result[lowerField] = headers[field]
      }
      return result
    }, {})
  }
}

/**
 * 获取参与签名的请求头字段
 * @param {object} headers 请求头
 * @returns {string[]}
 */
function getSignHeaderKeys(headers) {
  /** 不参与 Header 签名的请求头 */
  const EXCLUDE_SIGN_HEADERS = ['x-ca-signature', 'x-xa-signature-headers', 'accept', 'content-md5', 'content-type', 'date']

  const signHeaderKeys = []
  Object.keys(headers).forEach((field) => {
    if (!EXCLUDE_SIGN_HEADERS.includes(field)) {
      signHeaderKeys.push(field)
    }
  })

  return signHeaderKeys.sort()
}

function getSignedHeadersString(signHeaderKeys, headers) {
  const list = []
  for (let i = 0; i < signHeaderKeys.length; i++) {
    const key = signHeaderKeys[i]
    const value = headers[key]
    list.push(key + ':' + (value ? value : ''))
  }
  return list.join('\n')
}

function getPathAndParams(url) {
  const urlRaw = url.replace('https://', '').replace('http://', '')
  return urlRaw.substr(urlRaw.indexOf('/'))
}

function md5(content) {
  return CryptoJS.MD5(content).toString(CryptoJS.enc.Base64)
}

function buildStringToSign(method, headers, signedHeadersString, pathAndParams) {
  const lf = '\n'
  const list = [method.toUpperCase(), lf]

  const arr = ['accept', 'content-md5', 'content-type', 'date']
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i]
    if (headers[key]) {
      list.push(headers[key])
    }
    list.push(lf)
  }

  if (signedHeadersString) {
    list.push(signedHeadersString)
    list.push(lf)
  }

  if (pathAndParams) {
    list.push(pathAndParams)
  }

  return list.join('')
}

/**
 * 阿里云 API 网关签名加密
 * @see https://help.aliyun.com/document_detail/29475.html
 */
module.exports = function aliyunApigwSignatureInterceptor(config) {
  // 未配置签名参数，则直接跳过
  if (typeof config.signature !== 'object') {
    return config
  }

  const { key, secret, debug } = config.signature

  if (!(key && secret)) {
    throw new Error('配置了 `signature` 参数但是未配置 `key` 或 `secret`')
  }

  const headers = normalizeHeaders(config.headers)

  // 给请求头添加一些要求添加的字段
  headers['x-ca-key'] = key
  headers['x-ca-timestamp'] = Date.now()
  headers['accept'] = headers['accept'] || '*/*'
  headers['content-type'] = headers['content-type'] || 'application/json'

  // 该请求头要求为一个随机字符串，理论上使用 `UUID` 更好，为了少引入依赖，使用这种方法
  headers['x-ca-nonce'] = CryptoJS.MD5(Date.now().toString() + Math.random() * 10000).toString(CryptoJS.enc.Hex)

  /** 允许包含 `body` 的请求方法 */
  const bodyValidMethod = ['post', 'put', 'patch']
  if (bodyValidMethod.includes(config.method.toLowerCase())) {
    if (config.data) {
      headers['content-md5'] = md5(JSON.stringify(config.data))
    } else {
      console.warn(`当前请求方法为 \`${config.method}\` 但是未配置请求数据（\`data\`）`)
    }
  } else {
    if (config.data) {
      console.warn('如果要提交请求数据 `data`，请使用以下请求方法：`post`, `put`, `patch` ')
    }
  }

  const signHeaderKeys = getSignHeaderKeys(headers)
  headers['x-ca-signature-headers'] = signHeaderKeys.join(',')

  const url = getUrl(config.baseURL, config.url, config.params)
  const pathAndParams = getPathAndParams(url)
  const signedHeadersString = getSignedHeadersString(signHeaderKeys, headers)
  const stringToSign = buildStringToSign(config.method, headers, signedHeadersString, pathAndParams)
  headers['x-ca-signature'] = CryptoJS.HmacSHA256(stringToSign, secret).toString(CryptoJS.enc.Base64)

  if (debug) {
    console.info(`当前签名字符串：\`${stringToSign.replace(/\n/g, '#')}\``)
  }

  config.headers = headers
  return config
}
