import { HttpRequest } from './request'

/**
 * HTTP 拦截器
 */
export interface HttpInterceptor {
  (request: HttpRequest): HttpRequest
}
