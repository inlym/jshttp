import { HttpRequest } from '../core/request'
import { AdapterBase } from './base.adapter'

/**
 * XMLHttpRequest（XHR） 适配器
 *
 * @see [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
 */
export class XhrAdapter extends AdapterBase {
  /**
   * 发送请求
   *
   * @param request 请求参数
   */
  dispatch(request: HttpRequest): Observable<HttpResponse> {
    const url = request.wholeUrl

    return new Observable((observer: Observer<HttpResponse>) => {
      const xhr = new XMLHttpRequest()

      xhr.open(request.method, url, true)

      // 设置超时时间
      if (request.timeout > 0) {
        xhr.timeout = request.timeout
      }

      // 设置响应数据类型
      xhr.responseType = request.responseType

      if (request.withCredentials) {
        xhr.withCredentials = true
      }

      // 设置请求头
      request.headers.forEach((name: string, value: string) => {
        XhrAdapter.warnIfHeaderNameForbidden(name)
        xhr.setRequestHeader(name, value)
      })

      /**
       * 如果请求方法是 `GET` 或者 `HEAD`，则应将请求主体设置为 null
       * @see https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/send
       */
      if ((['GET', 'HEAD'] as Method[]).includes(request.method)) {
        request.data = null
      }

      // 监听错误事件
      // todo
      xhr.onerror = function handleRequestError(ev: ProgressEvent<EventTarget>) {
        const response = {
          error: ev,
        }

        observer.error(response)
      }

      /**
       * 监听请求完成
       *
       * @description
       * 绑定 `onload` 比 `onreadystatechange` 事件更智能一些，无需去判断 `readyState` 的值
       */
      xhr.onload = function handleRequestLoad(ev: ProgressEvent<EventTarget>) {
        const responseHeaders = XhrAdapter.parseHeaders(xhr)

        observer.next(
          new HttpResponse({
            status: xhr.status,
            statusText: xhr.statusText,
            headers: responseHeaders,
            data: xhr.response,
          })
        )

        observer.complete()
      }

      // 发送 HTTP 请求
      xhr.send(request.data)
    })
  }

  /**
   * 解析响应头
   *
   * @param {XMLHttpRequest} xhr
   * @return {HttpHeaders} 解析后的响应头
   *
   * @description
   *
   * 调用 `XMLHttpRequest.getAllResponseHeaders()` 获取的响应头，是以 `CRLF` 分割的字符串，需要手工解析
   * @see [getAllResponseHeaders](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/getAllResponseHeaders)
   */
  static parseHeaders(xhr: XMLHttpRequest): HttpHeaders {
    /**
     * 关于 `CRLF`
     *
     * @see [CRLF](https://developer.mozilla.org/zh-CN/docs/Glossary/CRLF)
     */
    const CRLF = '\r\n'

    /** 裸响应头，以 `CRLF` 分割的字符串 */
    const rawHeaders: string = xhr.getAllResponseHeaders()

    /** 以分隔符拆分响应头字符串列表 */
    const headerList: string[] = rawHeaders.split(CRLF)

    /** 响应头字段名列表 */
    const nameList = headerList.map((v) => {
      return v.split(':')[0]
    })

    const headers = new HttpHeaders()

    nameList.forEach((name: string) => {
      if (name) {
        const value = xhr.getResponseHeader(name)
        if (value) {
          headers.set(name, value!)
        }
      }
    })
    return headers
  }

  /**
   * 检查指定请求头是否被禁用修改，若是，则使用 `console.error` 进行提醒（不报错）
   *
   * @param {string} name 请求头字段（请求首部）
   *
   * 部分请求头不能在代码中通过编程的方式进行修改，应该由由浏览器控制
   *
   * @see [禁止修改的消息首部](https://developer.mozilla.org/zh-CN/docs/Glossary/Forbidden_header_name)
   */
  static warnIfHeaderNameForbidden(name: string): void {
    /** 禁止修改的消息首部 */
    const forbiddenHeaderNames = [
      'Accept-Charset',
      'Accept-Encoding',
      'Access-Control-Request-Headers',
      'Access-Control-Request-Method',
      'Connection',
      'Content-Length',
      'Cookie',
      'Cookie2',
      'Date',
      'DNT',
      'Expect',
      'Host',
      'Keep-Alive',
      'Origin',
      'Referer',
      'TE',
      'Trailer',
      'Transfer-Encoding',
      'Upgrade',
      'Via',
    ]

    /** 禁止修改的消息首部前缀 */
    const forbiddenHeaderNamePrefix = ['Proxy-', 'Sec-']

    forbiddenHeaderNames.forEach((key: string) => {
      if (key.toUpperCase() === name.toUpperCase()) {
        const message = `请求头 \`${name}\` 不允许自主设置，应当由浏览器自动设置，建议删除该请求头！详见文档 https://developer.mozilla.org/zh-CN/docs/Glossary/Forbidden_header_name`
        console.error(message)
      }
    })

    forbiddenHeaderNamePrefix.forEach((pre: string) => {
      if (name.toUpperCase().startsWith(pre.toUpperCase())) {
        const message = `以 \`${pre}\` 开头的请求头不允许自主设置，应当由浏览器自动设置，建议删除 \`${name}\` 请求头！详见文档 https://developer.mozilla.org/zh-CN/docs/Glossary/Forbidden_header_name`
        console.error(message)
      }
    })
  }
}
