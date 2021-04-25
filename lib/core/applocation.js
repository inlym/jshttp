'use strict'

const buildConfig = require('../config/buildConfig.js')
const initialize = require('../lifetime/initialize.js')
const dispatch = require('../lifetime/dispatch.js')
const mergeConfig = require('../config/mergeConfig.js')
const baseConfig = require('../config/defaults.js')
const mockAdapter = require('../adapters/mock.js')
const normalizeConfig = require('../config/normalizeConfig.js')

const MIDDLEWARE = Symbol('application#middleware')

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
   * 添加一个自定义中间件
   * @param {function|object} obj 中间件
   */
  use(obj) {
    this[MIDDLEWARE]['push'](obj)
  }

  createContext(config) {
    return {
      config: config,
      adapter: config.mock && typeof config.mock === 'object' ? mockAdapter : config.adapter,
    }
  }

  composeMiddleware(config) {
    // 合并多个中间件为一个列表
    const middlewareInConfig = config.middleware || []
    const list = middlewareInConfig.concat(this[MIDDLEWARE])

    // 整理格式统一为 `{fn:function;order:number;}`
    const unifiedList = list.map((value) => {
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
   * 发起请求
   * @param {object} config 配置项
   */
  async request(...args) {
    const customConfig = buildConfig(...args)
    const config = mergeConfig(baseConfig, this.defaults, normalizeConfig(customConfig))
    const context = this.createContext(config)
    const fn = this.composeMiddleware(config)
    return await fn(context)
  }
}
