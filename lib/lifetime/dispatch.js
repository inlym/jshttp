'use strict'

const Response = require('../core/response.js')

/**
 * 将请求适配器封装为中间件格式
 */
module.exports = async function dispatch(ctx) {
  // 记录发起请求时间
  ctx.setTime('requestTime')

  const result = await ctx.adapter(ctx.config)

  // 记录完成请求时间
  ctx.setTime('responseTime')

  ctx.response = new Response(result)
  ctx.request = result.request

  // 冻结配置项对象，不允许再被修改
  Object.freeze(ctx.config)
  const list = ['headers', 'params', 'mock', 'data']
  list.forEach((key) => {
    if (ctx.config[key] && typeof ctx.config[key] === 'object') {
      Object.freeze(ctx.config[key])
    }
  })
}
