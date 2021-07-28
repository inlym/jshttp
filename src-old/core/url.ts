/**
 * 分割原始 url，将 path 和 querystring 进行切割，并移除 hash 部分
 */
export function splitUrl(url: string): [string, string] {
  const [url2] = url.split('#')
  const list = url2.split('?')
  if (list.length > 2) {
    throw new Error('url 包含了多个 `?` 符号！')
  } else if (list.length === 2) {
    return list
  } else if (list.length === 1) {
    return [list[0], '']
  } else {
    throw new Error('未找到有效的 url！')
  }
}

export function makeUrl() {}
