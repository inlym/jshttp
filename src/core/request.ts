import { HttpHeaders } from './headers'
import { HttpParams, ParamsValueType } from './params'
import { BasicResponse } from './response'

/** 请求方法 */
export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

/** Mock 请求数据配置项 */
export interface MockOptions extends BasicResponse {
  /** 请求时长，即从发起请求至返回响应的时间差（单位：毫秒） */
  time?: number
}

/** 附加选项 */
export interface ExtraOptions {
  /** 是否开启 http2，仅在微信小程序中可用 */
  enableHttp2: boolean

  /** 是否开启 quic，仅在微信小程序中可用 */
  enableQuic: boolean
}

/**
 * 发起请求时可以配置的参数选项
 */
export interface RequestOptions {
  /** 请求方法 */
  method: Method

  /** URL 地址前缀 */
  baseURL: string

  /** URL 地址 */
  url: string

  /** 请求头 */
  headers: Record<string, string> | HttpHeaders

  /** 请求参数 */
  params: Record<string, ParamsValueType> | HttpParams

  /** 请求数据 */
  data: any

  /** 响应数据类型 */
  responseType: 'json' | 'text' | 'arraybuffer' | 'blob'

  /** 请求超时时间（单位：毫秒） */
  timeout: number

  /** 重试次数，默认 0 次 */
  retries: number

  /** 跨域请求时是否需要携带凭证 */
  withCredentials: boolean

  /** 模拟请求参数，不会发送真实请求，按设定的响应返回结果 */
  mock?: MockOptions

  /** 附加选项 */
  extra?: Record<string, unknown>

  validate?: (status: number, headers: HttpHeaders, data: any) => boolean
}

export class HttpRequest {
  /** 请求方法 */
  method: Method = 'GET'

  /** URL 地址前缀 */
  baseURL = ''

  /** URL 地址 */
  url = ''

  /** 请求参数 */
  params: HttpParams = new HttpParams()

  /** 请求头 */
  headers: HttpHeaders = new HttpHeaders()

  /** 请求数据 */
  data: unknown

  /** 响应数据类型 */
  responseType = 'json'

  /** 请求超时时间（单位：毫秒） */
  timeout = 0

  /** 重试次数 */
  retries = 0

  /** 跨域请求时是否需要携带凭证 */
  withCredentials = false

  /** 附加选项 */
  extra: Record<string, unknown> = {}

  /** 实际发起请求的执行器 */
  executor?: unknown

  validate: (status: number, headers: HttpHeaders, data: any) => boolean = function validate(status: number) {
    if (status >= 200 && status < 300) {
      return true
    }

    return false
  }

  constructor(options?: Partial<RequestOptions>) {
    // 参数初始化处理
    if (options) {
      if (options.method) {
        this.method = options.method.toUpperCase()
      }

      if (options.baseURL) {
        this.baseURL = options.baseURL.toLowerCase()
      }

      if (options.url) {
        this.url = options.url
      }

      if (options.params) {
        this.params = new HttpParams(options.params)
      }

      if (options.headers) {
        this.headers = new HttpHeaders(options.headers)
      }

      if (options.data !== undefined) {
        this.data = options.data
      }

      if (options.responseType) {
        this.responseType = options.responseType
      }

      if (options.timeout && options.timeout > 0) {
        this.timeout = options.timeout
      }

      if (options.retries && options.retries > 0) {
        this.retries = options.retries
      }

      if (options.withCredentials) {
        this.withCredentials = true
      }

      if (options.extra) {
        this.extra = options.extra
      }
    }
  }

  /** 完整的 URL 地址 */
  get wholeUrl(): string {
    return this.baseURL + this.url + this.params.toString()
  }
}
