import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface MockOptions extends AxiosResponse {
  delay: number
  error: string
}

export interface JshttpRequestConfig extends AxiosRequestConfig {
  mock?: MockOptions
}
