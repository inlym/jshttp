'use strict'

const methods = require('../static/methods.js')

/**
 * 检验一个值是否是指定的类型，如果不是则报错
 * @param {*} value 要检验的数据
 * @param {*} type 类型
 * @param {*} name 名称
 */
function throwErrorIfWrongType(name, value, type) {
  if (typeof value !== type) {
    const message = `配置项 \`${name}\` 要求是一个 \`${type}\` 类型的值，但是你设置的 \`${name}\` = \`${value}\` 为 \`${typeof value}\` 类型`
    throw new Error(message)
  }
}

/**
 * 指定的值如果没有在列表中，则报错
 * @param {*} value 要检验的数据
 * @param {*} list 列表
 * @param {*} name 名称
 */
function throwErrorIfNotInclude(name, value, list) {
  if (!list.includes(value)) {
    const message =
      `配置项 \`${name}\` 仅支持以下值，你设置的 \`${name}\` = \`${value}\` 不在此范围内：\n` +
      list
        .map((value, index) => {
          return `${index + 1}. \`${value}\`\n`
        })
        .join('')
    throw new Error(message)
  }
}

/**
 * 整理参数（对原对象对校验和调整）
 * @param {object} config 配置项
 *
 * 说明：
 * 1. 将已知的参数做一个 `数据校验` 和规范化，未知数据原封不动保留
 */
module.exports = function normalizeConfig(config) {
  throwErrorIfWrongType('config', config, 'object')

  /**
   * 配置项 `method`
   *
   * 规则：
   * 1. 大写字符串
   * 2. 在指定范围内
   */
  if (config.method !== undefined) {
    throwErrorIfWrongType('method', config.method, 'string')
    config.method = config.method.toUpperCase()
    throwErrorIfNotInclude('method', config.method, methods)
  }

  /**
   * 配置项 `baseURL`
   *
   * 规则：
   * 1. 字符串
   * 2. 以 `http://` 或 `https://` 开头
   */
  if (config.baseURL !== undefined) {
    throwErrorIfWrongType('baseURL', config.baseURL, 'string')
    if (!config.baseURL.startsWith('http://') && !config.baseURL.startsWith('https://')) {
      throw new Error('配置项 `baseURL` 应该以 `http://` 或 `https://` 开头，例如 `https://www.jshttp.cn/`')
    }
  }

  /**
   * 配置项 `url`
   *
   * 规则：
   * 1. 字符串
   */
  if (config.url !== undefined) {
    if (typeof config.url !== 'string') {
      throw new Error('配置项 `url` 应该是一个字符串类型，可以是绝对路径或相对路径，例如 `https://www.jshttp.cn/` 或 `/api`')
    }
  }

  /**
   * 配置项 `requestType`
   *
   * 规则：
   * 1. 字符串
   *
   * 合法值：
   * 1. `json`  - 默认
   * 2. `text`
   * 3. `form`
   * 4. `arraybuffer`
   */
  if (config.requestType !== undefined) {
    throwErrorIfWrongType('requestType', config.requestType, 'string')
    const validList = ['json', 'text', 'form', 'arraybuffer']
    throwErrorIfNotInclude('requestType', config.requestType, validList)
  }

  /**
   * 配置项 `responseType`
   *
   * 规则：
   * 1. 字符串
   *
   * 合法值：
   * 1. `json`  - 全部适用
   * 2. `arraybuffer`  - 全部适用
   * 3. `text`  - 全部适用
   * 4. `blob`  - 仅用于 `XMLHttpRequest`
   * 5. `document`  - 仅用于 `XMLHttpRequest`
   * 6. `stream`  - 仅用于 `Node.js`
   */
  if (config.responseType !== undefined) {
    throwErrorIfWrongType('responseType', config.responseType, 'string')
    const validList = ['arraybuffer', 'blob', 'document', 'json', 'text', 'stream']
    throwErrorIfNotInclude('responseType', config.responseType, validList)
  }

  /**
   * 配置项 `responseEncoding`
   *
   * 规则：
   * 1. 字符串
   *
   * 合法值：
   * 1. `utf8` (或 `utf-8`)
   * 2. `base64`
   * 3. `hex`
   * 4. `ascii`
   * 5. `binary`
   * 6. `ucs2`
   * 7. `latin1`
   * 8. `utf16le`
   */
  if (config.responseEncoding !== undefined) {
    throwErrorIfWrongType('responseEncoding', config.responseEncoding, 'string')
    const validList = ['utf8', 'utf-8', 'utf16le', 'latin1', 'base64', 'hex', 'ascii', 'binary', 'ucs2']
    throwErrorIfNotInclude('responseEncoding', config.responseEncoding, validList)
  }

  /**
   * 配置项 `timeout`
   *
   * 规则：
   * 1. 数字
   */
  if (config.timeout !== undefined) {
    throwErrorIfWrongType('timeout', config.timeout, 'number')
    const timeout = parseInt(config.timeout, 10)
    config.timeout = timeout > 0 ? timeout : 0
  }

  /**
   * 配置项 `retry`
   *
   * 规则：
   * 1. 非负整数
   */
  if (config.retry !== undefined) {
    if (!(Number.isInteger(config.retry) && config.retry >= 0)) {
      throw new Error('配置项 `retry` 要求是一个非负整数（0,1,2,...）')
    }
  }

  /**
   * 配置项 `headers`
   *
   * 规则：
   * 1. 对象
   */
  if (config.headers !== undefined) {
    throwErrorIfWrongType('headers', config.headers, 'object')
  }

  /**
   * 配置项 `params`
   *
   * 规则：
   * 1. 对象
   */
  if (config.params !== undefined) {
    throwErrorIfWrongType('params', config.params, 'object')
  }

  /**
   * 配置项 `mock`
   *
   * 规则：
   * 1. 对象
   */
  if (config.mock !== undefined) {
    throwErrorIfWrongType('mock', config.mock, 'object')
  }

  /**
   * 配置项 `adapter`
   *
   * 规则：
   * 1. 函数
   */
  if (config.adapter !== undefined) {
    throwErrorIfWrongType('adapter', config.adapter, 'function')
  }

  /**
   * 配置项 `validateStatus`
   *
   * 规则：
   * 1. 函数
   */
  if (config.validateStatus !== undefined) {
    throwErrorIfWrongType('validateStatus', config.validateStatus, 'function')
  }

  /**
   * 配置项 `middleware`
   *
   * 规则：
   * 1. 数组
   * 2. 子项为函数或对象
   */
  if (config.middleware !== undefined) {
    if (typeof config.middleware !== 'object' || typeof config.middleware.length !== 'number') {
      throw new Error('配置项 `middleware` 要求是一个数组！')
    }

    config.middleware.forEach(function checkMiddlewareItemType(item) {
      if (typeof item !== 'function' && typeof item !== 'object') {
        throw new Error('配置项 `middleware` 的列表元素要求是一个函数或对象，请检查你的设置！')
      }
    })
  }

  /**
   * 配置项 `responseItems`
   *
   * 规则：
   * 1. 数组
   */
  if (config.responseItems !== undefined) {
    if (typeof config.responseItems !== 'object' || typeof config.responseItems.length !== 'number') {
      throw new Error('配置项 `responseItems` 要求是一个数组！')
    }

    if (config.responseItems.length === 0) {
      throw new Error('配置项 `responseItems` 应至少包含一个元素，可选值：`status`, `statusText`, `headers`, `data`, `config`, `request`')
    }

    const valid = ['status', 'statusText', 'headers', 'data', 'config', 'request']

    config.responseItems.forEach(function checkResponseItemInclude(item) {
      if (!valid.includes(item)) {
        throw new Error(
          '配置项 `responseItems` 的可选值：`status`, `statusText`, `headers`, `data`, `config`, `request`，你可以选择一项或多项，你选择的以下值不在可选值内：' +
            ` \`${item}\`  `
        )
      }
    })
  }

  /**
   * 配置项 `debug`
   *
   * 合法值：
   * 1. `true`
   * 2. `false`
   */
  if (config.debug !== undefined) {
    if (config.debug !== true && config.debug !== false) {
      throw new Error('配置项 `debug` 的可选值：`true` 或 `false`')
    }
  }

  /**
   * 配置项 `logging`
   *
   * 规则：
   * 1. 是一个函数
   */
  if (config.logging !== undefined) {
    throwErrorIfWrongType('logging', config.logging, 'function')
  }

  /**
   * 配置项 `data`
   *
   * 规则：
   * 1. 对 `data` 无校验
   */
  if (config.data !== undefined) {
    // 空
  }

  return config
}
