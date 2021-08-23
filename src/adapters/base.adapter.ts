import { Observable } from 'rxjs'
import { HttpRequest } from '../core/request'
import { HttpResponse } from '../core/response'

/**
 * 适配器基类
 */
export abstract class AdapterBase {
  /**
   * 承接请求发送
   *
   * @param request 请求参数
   */
  abstract dispatch(request: HttpRequest): Observable<HttpResponse>
}
