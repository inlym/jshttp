import { Observable, Observer } from 'rxjs'
import { HttpHeaders } from '../core/headers'
import { HttpRequest } from '../core/request'
import { HttpResponse } from '../core/response'

/** 正常请求微信接口返回数据 */
export interface WxRequestSuccessCallbackResult<T> {
  /** 开发者服务器返回的数据 */
  data: T

  /** 开发者服务器返回的 HTTP 状态码 */
  statusCode: number

  /** 开发者服务器返回的 HTTP Response Header */
  header: Record<string, string>

  /** 开发者服务器返回的 cookies，格式为字符串数组 */
  cookies: string[]

  errMsg: string
}

/** 微信请求参数 */
export interface WxRequestOptions {
  /** HTTP 请求方法
   *
   * 可选值：
   * - 'OPTIONS': HTTP 请求 OPTIONS;
   * - 'GET': HTTP 请求 GET;
   * - 'HEAD': HTTP 请求 HEAD;
   * - 'POST': HTTP 请求 POST;
   * - 'PUT': HTTP 请求 PUT;
   * - 'DELETE': HTTP 请求 DELETE;
   * - 'TRACE': HTTP 请求 TRACE;
   * - 'CONNECT': HTTP 请求 CONNECT;
   */
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'

  /** 开发者服务器接口地址 */
  url: string

  /**
   * 设置请求的 header，header 中不能设置 Referer。
   *
   * `content-type` 默认为 `application/json`
   */
  header?: Record<string, string>

  /** 请求的参数 */
  data?: string | Record<string, unknown> | ArrayBuffer

  /** 返回的数据格式
   *
   * 可选值：
   * - 'json': 返回的数据为 JSON，返回后会对返回的数据进行一次 JSON.parse;
   * - '其他': 不对返回的内容进行 JSON.parse;
   */
  dataType?: 'json' | '其他'

  /** 响应的数据类型
   *
   * 可选值：
   * - 'text': 响应的数据为文本;
   * - 'arraybuffer': 响应的数据为 ArrayBuffer;
   *
   */
  responseType?: 'text' | 'arraybuffer'

  /** 开启 cache，最低基础库： `2.10.4` */
  enableCache?: boolean

  /** 开启 http2，最低基础库： `2.10.4` */
  enableHttp2?: boolean

  /** 开启 quic，最低基础库： `2.10.4` */
  enableQuic?: boolean

  /** 超时时间，单位为毫秒 */
  timeout?: number

  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: { errMsg: string }) => void
}

export interface wx {
  request: (options: WxRequestOptions) => void
}

export function wxMiniprogramAdatper<T>(request: HttpRequest): Observable<HttpResponse> {
  const url = request.wholeUrl
  const options: WxRequestOptions<T> = { url }

  options.method = request.method
  options.header = request.headers.toJSON()

  if (request.data) {
    options.data = request.data
  }

  if (request.timeout) {
    options.timeout = request.timeout
  }

  return new Observable((observer: Observer<HttpResponse>) => {
    wx.request({
      ...options,

      /** 接口调用成功的回调函数 */
      success(res: WxRequestSuccessCallbackResult<T>): void {
        observer.next(
          new HttpResponse<T>({
            status: res.statusCode,
            headers: new HttpHeaders(res.header),
            data: res.data,
          })
        )
        observer.complete()
      },

      /** 接口调用失败的回调函数 */
      fail(res: { errMsg: string }): void {
        observer.error(res.errMsg)
      },
    })
  })
}
