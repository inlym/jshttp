'use strict'

const buildConfig = require('../config/buildConfig.js')
const initialize = require('../lifetime/initialize.js')
const dispatch = require('../lifetime/dispatch.js')
const mergeConfig = require('../config/mergeConfig.js')
const getDefaults = require('../config/defaults.js')
const normalizeConfig = require('../config/normalizeConfig.js')
const Context = require('./context.js')

const getAliyunApigwSignatureMiddleware = require('../middleware/aliyunApigwSignature.js')

const MIDDLEWARE = Symbol('application#middleware')
const baseConfig = getDefaults()

module.exports = class Application {
  constructor(defaultConfig) {
    this.defaults = normalizeConfig(defaultConfig)

    /**
     * 用户自定义中间件列表
     *
     * @param {function} [].fn 函数
     * @param {number} [].order 函数排序，用于在生成最终函数时，将列表重排（按数字升序排列）
     */
    this[MIDDLEWARE] = this.defaults.middleware || []
  }

  /**
   * 添加一个默认自定义中间件
   * @param {function|object} obj 中间件
   */
  use(obj) {
    this[MIDDLEWARE]['push'](obj)
  }

  /**
   * 根据配置，计算需要加入的签名中间件
   */
  getSignMiddleware(config) {
    if (config.sign && typeof config.sign === 'object' && !config.sign.disable) {
      if (!(config.sign.key && config.sign.secret)) {
        throw new Error('签名中间件开启时，需要同时配置 `sign.key` 和 `sign.secret` 参数！')
      }
      if (!config.sign.type || config.sign.type === 'aliyun') {
        return getAliyunApigwSignatureMiddleware(config.sign)
      }
    }
  }

  createPipeline(configMiddleware) {
    // 整理格式统一为 `{fn:function;order:number;}`
    const unifiedList = configMiddleware.map((value) => {
      if (typeof value === 'object') {
        const { fn, order } = value
        if (typeof fn === 'function' && typeof order === 'number') {
          return { fn, order }
        }
      } else if (typeof value === 'function') {
        return { fn: value, order: 100 }
      }
      throw new Error('中间件格式错误')
    })

    // 对中间件重新排序（按照 `order` 升序排列）
    unifiedList.sort((a, b) => {
      return a.order - b.order
    })

    // 获取中间件函数列表
    const middleware = unifiedList.map((value) => {
      return value.fn
    })

    middleware.push(dispatch)
    middleware.unshift(initialize)

    return function (context, next) {
      let index = -1
      function dispatch(i) {
        if (i <= index) return Promise.reject(new Error('next() 被执行了多次！'))
        index = i
        let fn = middleware[i]
        if (i === middleware.length) {
          fn = next
        }
        if (!fn) {
          return Promise.resolve()
        }
        try {
          return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
        } catch (err) {
          return Promise.reject(err)
        }
      }
      return dispatch(0)
    }
  }

  /**
   * 发起请求（包含重试逻辑）
   */
  async request(...args) {
    // 整理参数，生成标准格式的 `config`
    const customConfig = buildConfig(...args)
    const config = mergeConfig(baseConfig, this.defaults, normalizeConfig(customConfig))

    // 加入 `签名中间件`
    const signFn = this.getSignMiddleware(config)
    if (signFn) {
      config.middleware.push({ fn: signFn, order: 9999 })
    }

    /** 最大重试次数 */
    let retry = config.retry

    /** 已重试次数 */
    let retries = -1

    /** 检验成功请求函数 */
    const validateStatus = config.validateStatus

    /** 响应结果列表 */
    const responses = []

    while (retry >= 0) {
      retry--
      retries++

      const result = await this.execSingleRequest(config, retries)
      responses.push(result)
      if (validateStatus(result.status)) {
        // 返回响应结果
        const { responseItems } = config
        const output = {}
        responseItems.forEach((key) => {
          if (typeof key === 'string') {
            output[key] = result[key]
          } else if (typeof key === 'object') {
            const { item, alias } = key
            output[alias] = result[item]
          } else {
            throw new Error('配置项 `responseItems` 格式错误')
          }
        })
        if (responseItems.includes('responses')) {
          output.responses = responses
        }
        return output
      }
    }
    throw new Error(responses[responses.length - 1])
  }

  /**
   * 执行单次请求
   */
  async execSingleRequest(config, retries) {
    const context = new Context(config)
    context.retries = retries
    const fn = this.createPipeline(config.middleware)
    return await fn(context)
  }
}
