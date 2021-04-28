'use strict'

const getAdapter = require('../core/getAdapter.js')
const defaultAdapter = getAdapter()

/**
 * 当前文件放置 [ 默认配置 ]
 *
 * 用途说明：
 * 1. 生成实例时，作为默认配置
 * 2. 开发者可以从当前文件查看支持的参数，以及含义
 * 3. 未避免全局污染，封装为函数
 */
module.exports = function getDefaults() {
  return {
    /*********************************** 基本类型值配置 **********************************/

    /**
     * 请求方法
     *
     * 常用值：
     * 1. `GET`
     * 2. `POST`
     * 3. `PUT`
     * 4. `DELETE`
     * 5. `HEAD`
     */
    method: 'GET',

    /**
     * 请求基础地址
     *
     * 说明：
     * 1. 不为空时要求以 `http://` 或 `https://` 开头
     * 2. 配置项 `url` 以 `http://` 或 `https://` 开头时，配置项 `baseURL` 无效
     * 3. 配置项 `url` 为普通路径时（即以非 `http://` 或 `https://` 开头），将两者连接合成请求地址
     */
    baseURL: undefined,

    /**
     * 请求地址
     *
     * 说明：
     * 1. 可单独存在，或者和 `baseURL` 拼接合成请求地址
     * 2. 和 `baseURL` 不能同时为空
     */
    url: undefined,

    /**
     * 请求的数据类型
     *
     * 合法值：
     * 1. `json`
     * 2. `text`
     * 3. `form`
     * 4. `arraybuffer`
     */
    requestType: 'json',

    /**
     * 响应的数据类型
     *
     * 合法值：
     * 1. `json`  - 全部适用
     * 2. `arraybuffer`  - 全部适用
     * 3. `text`  - 全部适用
     * 4. `blob`  - 仅用于 `XMLHttpRequest`
     * 5. `document`  - 仅用于 `XMLHttpRequest`
     * 6. `stream`  - 仅用于 `Node.js`
     */
    responseType: 'json',

    /**
     * 响应的字符编码
     *
     * 合法值：
     * 'utf8', 'utf-8', 'utf16le', 'latin1', 'base64', 'hex', 'ascii', 'binary', 'ucs2'
     */
    responseEncoding: 'utf8',

    /**
     * 请求超时时间
     *
     * 说明：
     * 1. `0` 表示无超时时间
     * 2. 单位：毫秒（ms）
     */
    timeout: 0,

    /*********************************** 对象类配置 **********************************/

    /**
     * 请求头
     */
    headers: {},

    /**
     * 请求参数，最终以 `name=mark&age=19` 的形式合并到 `url` 中
     */
    params: {},

    /**
     * mock 响应对象
     */
    mock: undefined,

    /*********************************** 函数类配置 **********************************/

    /**
     * 请求适配器，将最终使用该适配器发送请求
     */
    adapter: defaultAdapter,

    /**
     * 是否是正常的响应状态码，函数返回为 `false` 将直接报错
     * @param {number} status 响应状态码
     * @returns {boolean}
     */
    validateStatus: function validateStatus(status) {
      return typeof status === 'number' && status >= 200 && status < 300
    },

    /*********************************** 其他配置 **********************************/

    /**
     * 请求数据
     */
    data: undefined,

    /**
     * 用户自定义中间件列表
     */
    middleware: [],

    /**
     * 响应的返回内容项
     *
     * 合法值：
     * 1. `status`
     * 2. `statusText`
     * 3. `headers`
     * 4. `data`
     * 5. `config`
     * 6. `request`
     *
     * 支持别名，格式：
     * ```js
     * {
     *   item: 'status,
     *   alias: 'statusCode'
     * }
     * ```
     */
    responseItems: ['status', 'statusText', 'headers', 'data'],
  }
}
