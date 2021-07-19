import { RequestConfig } from './config.interface'

export interface Response<T = any> {
  status: number
  ststusText: string
  headers?: Record<string, string>
  data: T
  config: RequestConfig
  request?: any
}
