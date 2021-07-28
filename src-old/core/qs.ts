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

export interface QueryParts {
  key: string
  value: string
}

export function encodeQueryObject(query: Record<string, any>): string {
  if (typeof query !== 'object') {
    throw new Error('`params` 参数应该是一个标准对象！')
  }

  return Object.keys(query)
    .map((key: string): QueryParts => {
      const value: any = query[key]
      let result: string = ''

      if (typeof value === 'string') {
        result = value
      } else if (typeof value === 'number') {
        result = value.toString()
      } else if (typeof value === 'boolean') {
        result = value ? 'true' : 'false'
      } else if (value instanceof Date) {
        result = value.toISOString()
      } else if (Array.isArray(value)) {
        /**
         * 此处复用 `angular` 对数组参数的处理逻辑
         *
         * [axios]:    { arr: ['one', 'two', 'three']} => arr[]=one&arr[]=two&arr[]=three
         * [angular]:  { arr: ['one', 'two', 'three']} => arr=one,two,three
         */
        result = value.join(',')
      }

      return { key, value: result }
    })
    .filter((obj: QueryParts): boolean => !!obj.value)
    .map((obj: QueryParts): string => `${obj.key}=${obj.value}`)
    .map((str: string): string => standardEncoding(str))
    .sort()
    .join('&')
}

export function decodeQueryString(str: string): Record<string, string> {
  const firstIndex: number = str.indexOf('?') === -1 ? 0 : str.indexOf('?') + 1
  const lastIndex: number = str.indexOf('#') === -1 ? str.length : str.indexOf('#')
  const querystring: string = str.substring(firstIndex, lastIndex)
  return querystring
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
