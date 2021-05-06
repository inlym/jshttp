'use strict'

/**
 * 初始化函数，用于放在第一个中间件
 */
module.exports = async function initialize(ctx, next) {
  /** 请求开始时间 */
  const startTime = Date.now()

  await next()

  /** 请求结束时间 */
  const endTime = Date.now()
  const cost = endTime - startTime
  if (ctx.config.debug && typeof ctx.config.logging === 'function') {
    const message = `[${ctx.response.status}] ${ctx.config.method} ${ctx.url} ${cost}ms `
    ctx.config.logging(message)
  }

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
