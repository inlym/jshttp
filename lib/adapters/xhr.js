'use strict'

const getUrl = require('../core/getUrl.js')

/**
 * XMLHttpRequest
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
 */

/**
 * 获取并解析响应头
 * @param {XMLHttpRequest} xhr
 * @returns {object} 解析成对象的响应头
 *
 * 调用 `XMLHttpRequest.getAllResponseHeaders()` 获取的响应头，是以 `CRLF` 分割的字符串，需要手工解析
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
 */
function getHeaders(xhr) {
  /**
   * 关于 `CRLF`
   * @see https://developer.mozilla.org/zh-CN/docs/Glossary/CRLF
   */
  const CRLF = '\r\n'

  // 裸响应头，以 `CRLF` 分割的字符串
  const rawHeaders = xhr.getAllResponseHeaders()

  // 以分隔符拆分响应头字符串
  const headerList = rawHeaders.split(CRLF)

  // 获取响应头字段名列表
  const fieldList = headerList.map((v) => {
    return v.split(':')[0]
  })

  const headers = {}
  fieldList.forEach((field) => {
    if (field) {
      headers[field] = xhr.getResponseHeader(field)
    }
  })
  return headers
}

/**
 * 检查指定请求头是否被禁用修改（仅提示）
 * @param {string} field 请求头字段（请求首部）
 *
 * 部分请求头不能在代码中通过编程的方式进行修改，应该由由浏览器控制
 * @see https://developer.mozilla.org/zh-CN/docs/Glossary/Forbidden_header_name
 */
function warnIfHeaderNameForbidden(field) {
  const forbiddenHeaderNames = [
    'Accept-Charset',
    'Accept-Encoding',
    'Access-Control-Request-Headers',
    'Access-Control-Request-Method',
    'Connection',
    'Content-Length',
    'Cookie',
    'Cookie2',
    'Date',
    'DNT',
    'Expect',
    'Host',
    'Keep-Alive',
    'Origin',
    'Referer',
    'TE',
    'Trailer',
    'Transfer-Encoding',
    'Upgrade',
    'Via',
  ]

  const forbiddenHeaderNamePrefix = ['Proxy-', 'Sec-']

  forbiddenHeaderNames.forEach((key) => {
    if (key.toUpperCase() === field.toUpperCase()) {
      const message = `请求头 \`${field}\` 不允许自主设置，应当由浏览器自动设置，建议删除该请求头！详见文档 https://developer.mozilla.org/zh-CN/docs/Glossary/Forbidden_header_name`
      console.error(message)
    }
  })

  forbiddenHeaderNamePrefix.forEach((pre) => {
    if (field.toUpperCase().startsWith(pre.toUpperCase())) {
      const message = `以 \`${pre}\` 开头的请求头不允许自主设置，应当由浏览器自动设置，建议删除 \`${field}\` 请求头！详见文档 https://developer.mozilla.org/zh-CN/docs/Glossary/Forbidden_header_name`
      console.error(message)
    }
  })
}

/**
 * 检查响应数据类型（即 `responseType` 值）是否合规
 * @param {string} responseType 响应数据的类型
 *
 * @see https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseType
 */
function throwErrorIfInvalidResponseType(responseType) {
  const valid = ['', 'arraybuffer', 'blob', 'document', 'json', 'text']
  if (!valid.includes(responseType)) {
    throw new Error(`你设置的 \`responseType\` 为 \`${responseType}\` 不是一个有效的值！`)
  }
}

module.exports = function xhrAdapter(config) {
  const url = getUrl(config.baseURL, config.url, config.params)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(config.method, url, true)

    // 设置超时时间
    if (config.timeout > 0) {
      xhr.timeout = config.timeout
    }

    // 设置响应值类型
    throwErrorIfInvalidResponseType(config.responseType)
    xhr.responseType = config.responseType

    // 设置 `withCredentials`
    if (config.withCredentials) {
      xhr.withCredentials = true
    }

    // 监听发生请求错误
    xhr.onerror = function handleRequestError() {
      reject(new Error('请求时发生错误，触发 `error` 事件'))
    }

    /**
     * 监听请求完成，`onload` 相比 `onreadystatechange` 更智能一些
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget/onload
     */
    xhr.onload = function handleRequestLoad() {
      const responseHeaders = getHeaders(xhr)

      resolve({
        status: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeaders,
        data: xhr.response,
        config: config,
        request: xhr,
      })
    }

    // 监听请求超时
    xhr.ontimeout = function handleRequestTimeout() {
      reject(new Error(`请求已超时(你设置的超时时间为 \`timeout: ${config.timeout}\`，单位：ms)`))
    }

    // 处理请求数据
    let requestData = config.data || null

    /**
     * 如果请求方法是 GET 或者 HEAD，则应将请求主体设置为 null
     * @see https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send
     */
    if (['GET', 'HEAD'].includes(config.method)) {
      requestData = null
    }

    if (requestData && typeof requestData === 'object') {
      requestData = JSON.stringify(requestData)
    }

    // 最终处理请求头，逐个设置
    Object.keys(config.headers).forEach((field) => {
      warnIfHeaderNameForbidden(field)
      xhr.setRequestHeader(field, config.headers[field])
    })

    xhr.send(requestData)
  })
}
