/**
 * 微信小程序请求适配器
 * @see [`API 文档`](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)
 */

import { AxiosRequestConfig } from 'axios'
import { statuses } from '../core/status.constant'
import { settle, createError } from '../core/axios-methods'

export function wxMiniProgramAdapter(config: AxiosRequestConfig) {}
