'use strict'

/**
 * 初始化函数，用于放在第一个中间件
 */
module.exports = async function initialize(ctx, next) {
  // 记录本次请求任务开始时间
  ctx.setTime('startTime')

  await next()

  // 记录本次请求任务结束时间
  ctx.setTime('endTime')

  // 打印日志
  if (ctx.config.debug && typeof ctx.config.logging === 'function') {
    const content = ctx.getLoggingContent()
    ctx.config.logging(content)
  }

  return {
    status: ctx.response.status,
    statusText: ctx.response.statusText,
    headers: ctx.response.headers,
    data: ctx.response.data,
    request: ctx.response.request,

    url: ctx.url,
    config: ctx.config,
  }
}
