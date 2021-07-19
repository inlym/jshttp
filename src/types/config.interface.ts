/**
 * 请求方法
 */
export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'delete'
  | 'DELETE'
  | 'options'
  | 'OPTIONS'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

export type ResponseType = 'json' | 'text' | 'arraybuffer' | 'blob' | 'document' | 'stream'

/**
 * 传给 [请求适配器] 的参数，与用户手动输入的参数不同
 */
export interface RequestConfig {
  method: Method
  baseURL: string
}
