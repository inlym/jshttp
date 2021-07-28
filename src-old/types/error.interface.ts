import { AxiosResponse } from 'axios'
import { JshttpRequestConfig } from './config.interface'

export interface ErrorJson {
  message: string
  config: JshttpRequestConfig
  code: string
  request?: any
  response?: AxiosResponse<T>
}

export interface JshttpError<T = any> extends Error {
  config: JshttpRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse<T>
  isAxiosError?: boolean
  toJSON?: () => ErrorJson
}
