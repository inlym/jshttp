import { Method, RequestOptions } from './request'
import { HttpHeaders } from './headers'
import { HttpParams } from './params'

/** 默认配置项 */
export interface DefaultConfig {
  /** 请求方法 */
  method?: Method

  /** URL 地址前缀 */
  baseURL?: string

  /** 请求头 */
  headers?: Record<string, string> | HttpHeaders

  /** 请求参数 */
  params?: HttpParams

  /** 响应数据类型 */
  responseType?: 'json' | 'text' | 'arraybuffer' | 'blob'

  /** 请求超时时间（单位：毫秒） */
  timeout?: number

  /** 重试次数，默认 0 次 */
  retries?: number

  /** 跨域请求时是否需要携带凭证 */
  withCredentials?: boolean

  /** 附加选项 */
  extra?: Record<string, any>
}

/**
 * HTTP 客户端
 */
export class HttpClient {
  private readonly defaults = new Map<string, any>()

  constructor(defaults?: DefaultConfig) {
    // 配置默认参数
    if (defaults) {
      if (defaults.method) {
        this.defaults.set('method', defaults.method.toUpperCase())
      }

      if (defaults.baseURL) {
        this.defaults.set('baseURL', defaults.baseURL)
      }

      if (defaults.headers) {
        this.defaults.set('headers', new HttpHeaders(defaults.headers))
      }

      if (defaults.params) {
        this.defaults.set('params', new HttpParams(defaults.params))
      }

      if (defaults.responseType) {
        this.defaults.set('responseType', defaults.responseType)
      }

      if (defaults.timeout) {
        this.defaults.set('timeout', defaults.timeout)
      }

      if (defaults.retries) {
        this.defaults.set('retries', defaults.retries)
      }

      if (defaults.withCredentials) {
        this.defaults.set('withCredentials', defaults.withCredentials)
      }

      if (defaults.retries) {
        this.defaults.set('extra', defaults.extra)
      }
    }
  }

  /**
   * 将请求参数和默认参数合并，生成最终的请求参数
   */
  mergeConfigs(options: Partial<RequestOptions>): RequestOptions {
    const output: Partial<RequestOptions> = {}
    output.method = options.method || this.defaults.get('method') || 'GET'
    output.baseURL = options.baseURL || this.defaults.get('baseURL') || ''
    output.url = options.url || ''
    output.timeout = options.timeout || this.defaults.get('timeout') || 0
    output.retries = options.retries || this.defaults.get('retries') || 0
    output.withCredentials = options.withCredentials || this.defaults.get('withCredentials') || false
    output.mock = options.mock
  }

  /**
   * 发起请求
   */
  request(options: Partial<RequestOptions>) {}
}
