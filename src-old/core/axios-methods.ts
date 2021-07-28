/**
 * 当前文件用于引入原生 `axios` 的方法，所有需要使用 `axios` 源代码的方法均从此文件引入
 *
 * 说明：
 * 1. 以下函数无法从 `axios` 库引入，只能在当前文件重建一份。
 * 2. 为保持代码简略，部分方法略有修改，但未改变原意。
 * 3. 当前文件的函数，测试用例使用 `axios` 库原有的。
 */

import { AxiosResponse } from 'axios'
import { JshttpRequestConfig } from '../types/config.interface'
import { ErrorJson, JshttpError } from '../types/error.interface'

export function createError(message: string, config: JshttpRequestConfig, code?: string, request?: any, response?: AxiosResponse): JshttpError {
  const error: JshttpError = new Error(message)

  error.config = config
  error.request = request
  error.response = response
  error.isAxiosError = true

  if (code) {
    error.code = code
  }

  error.toJSON = function toJSON(): ErrorJson {
    return {
      message: this.message,
      config: this.config,
      code: this.code,
    }
  }

  return error
}

export function settle(resolve, reject, response: AxiosResponse) {
  const validateStatus = response.config.validateStatus
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response)
  } else {
    reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response))
  }
}
