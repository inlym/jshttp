'use strict'

const CryptoJS = require('../min/crypto-js.min.js')

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
module.exports = function getAliyunApigwSignatureMiddleware(options) {
  const { key, secret, debug } = options

  const appKey = key
  const appSecret = secret

  return async function aliyunApigwSignature(ctx, next) {
    const originHeaders = ctx.config.headers
    const url = ctx.url

    // 处理请求头
    const headers = {}

    // 将请求头字段全部处理成 `小写`
    Object.keys(originHeaders).forEach((field) => {
      if (originHeaders[field]) {
        headers[field.toLowerCase()] = originHeaders[field]
      }
    })

    // 给请求头添加一些要求添加的字段
    headers['x-ca-key'] = appKey
    headers['x-ca-timestamp'] = Date.now()
    headers['accept'] = headers['accept'] || '*/*'
    headers['content-type'] = headers['content-type'] || 'application/json'

    // 该请求头要求为一个随机字符串，理论上使用 `UUID` 更好，为了少引入依赖，使用这种方法
    headers['x-ca-nonce'] = CryptoJS.MD5(Date.now().toString() + Math.random() * 10000).toString(CryptoJS.enc.Hex)

    if (ctx.config.method !== 'GET' && ctx.config.data) {
      headers['content-md5'] = md5(JSON.stringify(ctx.config.data))
    }

    const signHeaderKeys = getSignHeaderKeys(headers)
    headers['x-ca-signature-headers'] = signHeaderKeys.join(',')

    const pathAndParams = getPathAndParams(url)
    const signedHeadersString = getSignedHeadersString(signHeaderKeys, headers)
    const stringToSign = buildStringToSign(ctx.config.method, headers, signedHeadersString, pathAndParams)
    headers['x-ca-signature'] = CryptoJS.HmacSHA256(stringToSign, appSecret).toString(CryptoJS.enc.Base64)

    if (debug) {
      console.log(`当前签名字符串：\`${stringToSign.replace(/\n/g, '#')}\``)
    }

    ctx.config.headers = headers
    await next()
  }
}
