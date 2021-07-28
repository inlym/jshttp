/**
 * [模拟请求适配器]
 * 1. 用于客户端 Mock 请求数据，并未发送真实的 HTTP 请求
 */

import { AxiosResponse } from 'axios'
import { createError, settle } from '../core/axios-methods'
import statuses from 'statuses'
import { JshttpRequestConfig } from '../types/config.interface'

/** 文档地址 */
const docUrl = 'https://www.npmjs.com/package/jshttp#使用'

export function mockAdapter(config: JshttpRequestConfig) {
  const { mock } = config

  if (typeof mock !== 'object') {
    throw new Error(`配置项 \`mock\` 要求是一个 \`object\` 类型的值，详情请查看文档 ${docUrl}`)
  }

  const status: number = mock.status || 200
  const statusText: string = mock.statusText || <string>statuses(status) || 'UnKnown'
  const headers: Record<string, string> = mock.headers || {}
  const data: any = mock.data
  const delay: number = mock.delay || 1
  const errorMessage: string = mock.error
  const timeout: number = config.timeout || 0
  const request = null

  return new Promise(function dispatchMockRequest(resolve, reject) {
    /** 请求是否完成 */
    let isRequestFinished: boolean = false

    const response: AxiosResponse = { data, status, statusText, headers, config, request }

    // 模拟请求超时的 `ontimeout` 事件
    if (timeout > 0) {
      setTimeout(() => {
        if (!isRequestFinished) {
          const timeoutErrorMessage: string = config.timeoutErrorMessage || `timeout of ${timeout} ms exceeded`
          reject(createError(timeoutErrorMessage, config, 'ECONNABORTED', request, response))
        }
      }, timeout)
    }

    // 模拟正常请求流程
    setTimeout(() => {
      isRequestFinished = true

      if (errorMessage) {
        // 模拟发生错误的 `onerror` 事件
        reject(createError('Network Error', config, null, request, response))
      } else {
        // 请求成功情况
        settle(resolve, reject, response)
      }
    }, delay)
  })
}
