'use strict'

/**
 * 生成一个小程序适配器
 * @param {object} options 构造适配器的配置项
 *
 * 说明：
 * 1. 由于平台的小程序的 `request` 方法大同小异，因此没必要各个单独写，只需要兼容一下参数就可以了
 * 2. 适配参数，然后输出一个函数
 *
 * 小程序平台：
 * 1. 微信小程序
 * @see https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
 *
 * 2. QQ 小程序
 * @see https://q.qq.com/wiki/develop/miniprogram/API/network/network_request.html
 *
 * 3. 支付宝小程序
 * @see https://opendocs.alipay.com/mini/api/owycmh
 *
 * 4. 字节跳动小程序
 * @see https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/api/network/http/tt-request
 */

const getUrl = require('../core/getUrl.js')

/**
 * 将配置项中的 `responseType` 参数转换为小程序请求所需的 `dataType` 和 `dataType` 参数
 * @param {string} responseType 响应数据类型
 */
function convertResponseType(responseType) {
  if (typeof my === 'object') {
    if (responseType === undefined || responseType === 'json') {
      return { dataType: 'JSON' }
    } else {
      return { dataType: responseType }
    }
  } else {
    if (responseType === undefined || responseType === 'json') {
      return {
        dataType: 'json',
        responseType: 'text',
      }
    } else if (['arraybuffer', 'blob', 'stream'].includes(responseType)) {
      return {
        dataType: 'arraybuffer',
        responseType: 'arraybuffer',
      }
    } else {
      return {
        dataType: 'string',
        responseType: 'text',
      }
    }
  }
}

module.exports = function createMiniAdapter(options) {
  /** 请求头字段名称，默认 `headers` */
  const requestHeaders = (options.alias && options.alias.requestHeaders) || 'headers'

  /** 响应头字段名称，默认 `headers` */
  const responseHeaders = (options.alias && options.alias.responseHeaders) || 'headers'

  /** 响应码字段名称，默认 `statusCode` */
  const statusCode = (options.alias && options.alias.statusCode) || 'statusCode'

  return function miniAdapter(config) {
    const requestOptions = {
      method: config.method,
      url: getUrl(config.baseURL, config.url, config.params),
      timeout: config.timeout,
      [requestHeaders]: config.headers,
    }

    /** 不应该有请求体的请求方法 */
    const NO_BODY_METHODS = ['GET', 'HEAD', 'OPTIONS']
    if (!NO_BODY_METHODS.includes(config.method) && config !== undefined) {
      requestOptions.data = config.data
    }

    /**
     * 备注：
     * 笔者认为，当请求方法为 `GET` 时，将 `data` 插入到 `quertstirng` 中，这种做法很怪异！非常容易造成难以预料的问题！
     * 因此在 `jshttp` 中，直接屏蔽了这种做法。
     */

    /** 附加的参数 */
    const extraConfigKeys = ['enableHttp2', 'enableQuic', 'enableCache']
    extraConfigKeys.forEach((key) => {
      if (config[key]) {
        requestOptions[key] = config[key]
      }
    })

    return new Promise((resolve, reject) => {
      const request = options.platform.request(
        Object.assign({}, convertResponseType(config.responseType), requestOptions, {
          success(res) {
            resolve({
              status: res[statusCode],
              headers: res[responseHeaders],
              data: res.data,
              config: config,
              request: request,
            })
          },
          fail(res) {
            if (!res) {
              reject(new Error('请求错误，发起请求失败！'))
            } else {
              if (typeof res === 'object' && typeof res.errMsg === 'string') {
                reject(new Error('请求失败，错误原因：' + res.errMsg))
              }
            }
          },
        })
      )
    })
  }
}
