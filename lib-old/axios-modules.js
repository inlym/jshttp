'use strict'

/**
 * 当前文件用于引入原生 `axios` 的方法，所有需要使用 `axios` 源代码的方法均从此文件引入
 *
 * 说明：
 * 1. 为保持代码简略，部分方法略有修改，但未改变原意。
 */

function createError(message, config, code, request, response) {
  const error = new Error(message)

  error.config = config
  error.request = request
  error.response = response
  error.isAxiosError = true

  if (code) {
    error.code = code
  }

  error.toJSON = function toJSON() {
    return {
      message: this.message,
      config: this.config,
      code: this.code,
    }
  }
}

function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response)
  } else {
    reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response))
  }
}

module.exports = { createError, settle }
