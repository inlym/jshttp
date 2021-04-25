'use strict'

function isHttpUrl(url) {
  if (url && typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
    return true
  }
  return false
}

function isBrowserEnv() {
  return typeof XMLHttpRequest === 'function' && typeof location === 'object'
}

/**
 * 合并 `baseURL` 和 `url` 生成基础部分 url
 */
function concatBaseURL(baseURL = '', url = '') {
  if (isHttpUrl(url)) {
    return url.replace(/\/+$/u, '')
  }

  return baseURL.replace(/\/+$/u, '') + '/' + url.replace(/^\/+/u, '').replace(/\/+$/u, '')
}

function decodeQs(str) {
  if (!str) {
    return {}
  }

  // 拆分为 ['name=mark','age=19'] 形式的数组
  const parts = str.split('&')

  const obj = {}
  for (let i = 0; i < parts.length; i++) {
    const [name, value] = parts[i].split('=')
    if (name && value) {
      obj[name] = value
    }
  }

  return obj
}

function encodeQs(obj) {
  const arr = []
  Object.keys(obj)
    .sort()
    .forEach((name) => {
      const value = obj[name].toString()
      if (value && typeof value === 'string' && value !== '[object Object]') {
        // 兼容数组，name=['a','b'] 会转变为 name=a,b
        arr.push(`${name}=${value}`)
      }
    })
  return arr.join('&')
}

module.exports = function getUri(baseURL = '', url = '', params = {}) {
  if (!isHttpUrl(baseURL) && !isHttpUrl(url) && !isBrowserEnv()) {
    throw new Error(`配置项 \`baseURL\` 和 \`url\` 至少需要有一个是以 \`http://\` 或 \`https://\` 开头的绝对路径！`)
  }

  // 连接 `baseURL` 和 `url`
  let baseUrl = concatBaseURL(baseURL, url)

  // 去掉 `#` 后面的部分
  baseUrl = baseUrl.split('#')[0]

  const [beforeQs, quertstring] = baseUrl.split('?')
  const params2 = decodeQs(quertstring || '')
  const query = Object.assign({}, params2, params)
  const wholeQs = encodeQs(query)

  return beforeQs + (wholeQs ? '?' + wholeQs : '')
}
