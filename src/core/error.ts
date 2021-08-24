import { HttpRequest } from './request'
import { HttpResponse } from './response'

/** 参数错误型报错配置项 */
export interface ParameterErrorOptions {
  /** 错误消息 */
  message: string

  /** 发生错误的字段名称 */
  field: string

  /** 当前值 */
  value: any

  request?: HttpRequest
}

/** 参数错误型报错 */
export class ParameterError extends Error {
  /** 错误消息 */
  message: string

  /** 发生错误的字段名称 */
  field: string

  /** 当前值 */
  value: any

  /** 请求参数 */
  request?: HttpRequest

  constructor(options: ParameterErrorOptions) {
    super(options.message)

    this.field = options.field
    this.value = options.value
    this.request = options.request
  }
}

export interface HttpResponseErrorOptions {
  /** 错误消息 */
  message: string

  /** 原始错误 */
  error?: Error | string

  /** 请求参数 */
  request: HttpRequest

  /** 响应内容 */
  response: HttpResponse
}

/**
 * 在发送请求和接收响应、以及处理响应数据过程中发生的错误
 */
export class HttpResponseError extends Error {
  /** 错误消息 */
  message: string

  /** 原始错误消息 */
  originalMessage?: string

  /** 请求参数 */
  request: HttpRequest

  /** 响应内容 */
  response: HttpResponse

  constructor(options: HttpResponseErrorOptions) {
    super(options.message)

    this.request = options.request
    this.response = options.response

    if (typeof options.error === 'string') {
      this.originalMessage = options.error
    } else if (options.error instanceof Error) {
      this.originalMessage = options.error.message
    }
  }
}
