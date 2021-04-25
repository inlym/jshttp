'use strict'

/**
 * 初始化函数，用于放在第一个中间件
 */
module.exports = async function initialize(ctx, next) {
  await next()

  // 返回响应结果
  const { responseItems } = ctx.config
  const output = {}
  responseItems.forEach((key) => {
    if (typeof key === 'string') {
      output[key] = ctx.response[key]
    } else if (typeof key === 'object') {
      const { item, alias } = key
      output[alias] = ctx.response[item]
    } else {
      throw new Error('配置项 `responseItems` 格式错误')
    }
  })
  return output
}
