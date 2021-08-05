/** 参数值的数据类型 */
export type ParamsValueType = string | number | boolean | Array<string | number | boolean> | Date

/**
 * 以下 `standardEncoding` 方法来源于 `angular` （觉得还不错，就直接复制过来了）
 * @see [代码位置](https://github.com/angular/angular/blob/3b2f607cdad4edd01f08bab502db16849bbd8d95/packages/common/http/src/params.ts#L92)
 *
 */
export function standardEncoding(v: string): string {
  return encodeURIComponent(v)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/gi, '$')
    .replace(/%2C/gi, ',')
    .replace(/%3B/gi, ';')
    .replace(/%2B/gi, '+')
    .replace(/%3D/gi, '=')
    .replace(/%3F/gi, '?')
    .replace(/%2F/gi, '/')
}

/** 请求参数键值对 */
export interface QueryParts {
  key: string
  value: string
}

/**
 * 请求参数
 */
export class Params {
  private readonly params = new Map<string, ParamsValueType>()

  constructor(init?: Record<string, ParamsValueType>) {
    if (init) {
      Object.keys(init).forEach((field: string) => {
        this.set(field, init[field])
      })
    }
  }

  set(field: string, value: ParamsValueType): Params {
    this.params.set(field, value)
    return this
  }

  getValue(field: string): ParamsValueType {
    return this.params.get(field)
  }

  get(field: string): string {
    const result = this.params.get(field)
    return Params.stringify(result)
  }

  remove(field: string): Params {
    this.params.delete(field)
    return this
  }

  toJSON(): Record<string, string> {
    const result: Record<string, string> = {}
    this.params.forEach((value: ParamsValueType, field: string) => {
      result[field] = Params.stringify(value)
    })
    return result
  }

  /**
   * 对不同数据类型的值进行字符串化
   *
   * @param value 原始值
   */
  static stringify(value: ParamsValueType): string {
    if (typeof value === 'number') {
      return String(value)
    } else if (typeof value === 'boolean') {
      return value ? 'true' : 'false'
    } else if (typeof value === 'string') {
      return value
    } else if (value instanceof Date) {
      return value.toISOString()
    } else if (Array.isArray(value)) {
      /**
       * 此处复用 `angular` 对数组参数的处理逻辑
       *
       * [axios]:    { arr: ['one', 'two', 'three']} => arr[]=one&arr[]=two&arr[]=three
       * [angular]:  { arr: ['one', 'two', 'three']} => arr=one,two,three
       */
      return value.map((v: unknown) => String(v)).join(',')
    }

    return ''
  }

  /**
   * 将查询对象转化为查询字符串
   *
   * @static
   *
   * @description
   * 将以下格式的普通对象，
   * ```
   * {
   *    name: 'inlym',
   *    age: 19,
   *    isGood: true,
   *    nickname: 'goodboy',
   *    address: 'YourHeart',
   * }
   * ```
   *
   * 转为为字符串 `address=YourHeart&age=19&isGood=true&name=inlym&nickname=goodboy`
   */
  static encode(query: Record<string, ParamsValueType>): string {
    if (typeof query !== 'object') {
      throw new Error('`params` 参数应该是一个标准对象！')
    }

    return Object.keys(query)
      .map((key: string): QueryParts => {
        const value: string = Params.stringify(query[key])
        return { key, value }
      })
      .filter((obj: QueryParts): boolean => !!obj.value)
      .map((obj: QueryParts): string => `${obj.key}=${obj.value}`)
      .map((str: string): string => standardEncoding(str))
      .sort()
      .join('&')
  }

  /**
   * 将查询字符串解析为对象格式
   *
   * @param str 查询字符串
   */
  static decode(str: string): Record<string, string> {
    if (str.indexOf('?') !== -1 || str.indexOf('#') !== -1 || typeof str !== 'string') {
      throw new Error('内部错误：待解析的查询字符串不是标准格式或者包含 `?` 或 `#` ！')
    }

    return str
      .split('&')
      .map((s: string): string => decodeURIComponent(s))
      .map((s: string): string[] => s.split('='))
      .map((arr: string[]): QueryParts => {
        return { key: arr[0], value: arr[1] || '' }
      })
      .reduce((result: Record<string, string>, o: QueryParts) => {
        result[o.key] = o.value
        return result
      }, {})
  }
}
