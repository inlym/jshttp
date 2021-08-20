/**
 * HTTP 请求头接口
 */
export interface HttpHeadersBase {
  has(name: string): boolean
  set(name: string, value: string): HttpHeadersBase
  get(name: string): string
  remove(name: string): HttpHeadersBase
  forEach(fn: (name: string, value: string) => void)
  toJSON(): Record<string, string>
}

/**
 * 请求头
 *
 * @class
 *
 * ### 概念
 * 以下这个 `headers` 对象，整个对象在一起叫 **`请求头`** ，每一个键值对叫一个 **`请求头字段`** ，键值对的属性叫 **`字段名`** ，键值对的值叫 **`字段值`** 。
 *
 * ```javascript
 * const headers = {
 *   "Connection": "keep-alive",
 *   "Accept-Encoding": "gzip, deflate, br"
 * }
 * ```
 *
 * @description
 * ```markdown
 * 1. 请求头字段名不区分大小写。
 * ```
 */
export class HttpHeaders implements HttpHeadersBase {
  private readonly headers = new Map<string, string>()

  constructor(init?: Record<string, string> | HttpHeaders) {
    if (init) {
      if (init instanceof HttpHeaders) {
        return init
      }

      Object.keys(init).forEach((name: string) => {
        this.set(name, init[name])
      })
    }
  }

  /**
   * 检查是否存在指定请求头字段
   *
   * @param name 请求头字段名
   *
   * @description
   * ```markdown
   * 1. 请求头字段名不区分大小写。
   * ```
   *
   * @example
   * ```javascript
   * // 请求头存在则返回 `true`，否则返回 `false`
   * console.log(myHeaders.has('exist_name'))  // true
   * console.log(myHeaders.has('not_exist_name'))  // false
   * ```
   */
  has(name: string): boolean {
    return this.headers.has(name.toLowerCase())
  }

  /**
   * 设置一个请求头字段
   *
   * @param name 请求头字段名
   * @param value 请求头字段值
   *
   * @description
   * ```markdown
   * 1. 如果设置的值为空，那么将不会存入。
   * 2. 请求头字段名不区分大小写，例如：先设置了 `MyName` 字段，之后设置的 `myname` 将覆盖 `MyName` 字段的值。
   * 3. 该方法直接返回当前实例，可进行链式调用。
   * ```
   *
   * @example
   * ```javascript
   * // 链式调用示例
   * myHeaders
   *   .set('name-one', 'hello inlym')
   *   .set('name-two', 'abcde')
   *   .set('name-three', '1234567')
   * ```
   */
  set(name: string, value: string): HttpHeaders {
    const stringifiedValue = String(value)
    if (stringifiedValue) {
      this.headers.set(name.toLowerCase(), stringifiedValue)
    }

    return this
  }

  /**
   * 获取一个请求头字段的值
   *
   * @param name 请求头字段名
   *
   * @description
   * ```markdown
   * 1. 请求头字段名不区分大小写。
   * 2. 对应字段不存在将返回空字符串。
   * ```
   */
  get(name: string): string {
    return this.headers.get(name.toLowerCase()) || ''
  }

  /**
   * 移除一个请求头字段
   *
   * @param name 请求头字段名
   *
   * @description
   * ```markdown
   * 1. 请求头字段名不区分大小写。
   * 2. 无需手工检查对应字段是否存在，移除一个不存在的字段并不会报错。
   * 3. 该方法直接返回当前实例，可进行链式调用。
   * ```
   *
   * @example
   * ```javascript
   * // 链式调用示例
   * myHeaders
   *   .remove('name-one', 'hello inlym')
   *   .remove('name-two', 'abcde')
   *   .remove('name-three', '1234567')
   *
   * ```
   */
  remove(name: string): HttpHeaders {
    this.headers.delete(name.toLowerCase())

    return this
  }

  /**
   * 生成一个迭代序列
   *
   * @param fn 回调函数
   */
  forEach(fn: (name: string, value: string) => void): void {
    this.headers.forEach((value: string, name: string) => {
      fn(name, value)
    })
  }

  /**
   * 输出一个可以转化为 JSON 的对象
   *
   * @description
   * ```markdown
   * 1. 注意：使用当前方法获取的是一个普通对象，而非 `JSON` 字符串。
   * ```
   */
  toJSON(): Record<string, string> {
    const result: Record<string, string> = {}
    this.headers.forEach((value: string, name: string) => {
      result[name] = value
    })

    return result
  }
}
