/**
 * 检验 `baseURL` 是否合法
 */
export function validateBaseURL(baseURL: string): never {
  if (!baseURL.startsWith('https://') && !baseURL.startsWith('http://')) {
    throw new Error('`baseURL` 应该以 `https://` 或 `http://` 开头')
  }

  if (baseURL.indexOf('?') !== -1) {
    throw new Error('`baseURL` 中不应该包含查询字符串(即不能包含 `?` 符号)')
  }
}
