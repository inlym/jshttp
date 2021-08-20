import { HttpHeaders } from './headers'
import { HttpRequest } from './request'
import { HttpStatusCode } from './status'

export interface HttpResponseBase {
  /** 状态码 */
  status: number

  /** 状态消息 */
  statusText: string

  /** 响应头 */
  headers: Record<string, string> | HttpHeaders

  /** 响应数据 */
  data: any

  /** 请求内容 */
  request: HttpRequest
}

/**
 * 创建 HTTP 响应时的初始化配置项
 */
export type HttpResponseInitOptions = Partial<HttpResponseBase>

export class HttpResponse implements HttpResponseBase {
  /** 状态码 */
  status: number

  /** 状态消息 */
  statusText: string

  /** 响应头 */
  headers: HttpHeaders

  /** 响应数据 */
  data: any

  /** 请求内容 */
  request: HttpRequest

  constructor(init?: HttpResponseInitOptions) {
    init = init || {}

    this.status = init.status || 200
    this.statusText = init.statusText || HttpStatusCode[this.status]
    this.headers = new HttpHeaders(init.headers)
    this.data = init.data || null
    this.request = init.request || new HttpRequest()

    this.parseBody()
  }

  /**
   * 解析响应数据
   */
  parseBody(): void {
    if (this.request.responseType === 'json' && typeof this.data === 'string') {
      try {
        this.data = JSON.parse(this.data)
      } catch (e) {
        // 空
      }
    }
  }
}
