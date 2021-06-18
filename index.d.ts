import { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse, AxiosInterceptorManager } from 'axios'

// 相对于 `Axios` 附加的内容
export interface MockOptions {
  status?: number
  statusText?: string
  headers?: any
  data?: any
  delay?: number
  error?: string
}

export interface SignatureOptions {
  key: string
  secret: string
  debug?: boolean
}

export interface JsHttpRequestConfig extends AxiosRequestConfig {
  mock?: MockOptions
  signature?: SignatureOptions
}

// 重写跟 `AxiosRequestConfig` 相关的类型
export interface JsHttpInstance {
  (config: JsHttpRequestConfig): AxiosPromise
  (url: string, config?: JsHttpRequestConfig): AxiosPromise
  defaults: JsHttpRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<JsHttpRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  getUri(config?: JsHttpRequestConfig): string
  request<T = any, R = AxiosResponse<T>>(config: JsHttpRequestConfig): Promise<R>
  get<T = any, R = AxiosResponse<T>>(url: string, config?: JsHttpRequestConfig): Promise<R>
  delete<T = any, R = AxiosResponse<T>>(url: string, config?: JsHttpRequestConfig): Promise<R>
  head<T = any, R = AxiosResponse<T>>(url: string, config?: JsHttpRequestConfig): Promise<R>
  options<T = any, R = AxiosResponse<T>>(url: string, config?: JsHttpRequestConfig): Promise<R>
  post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: JsHttpRequestConfig): Promise<R>
  put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: JsHttpRequestConfig): Promise<R>
  patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: JsHttpRequestConfig): Promise<R>
}

export interface JsHttpStatic extends JsHttpInstance {
  create(config?: JsHttpRequestConfig): JsHttpInstance
}

declare const jshttp: JsHttpStatic

export default jshttp
