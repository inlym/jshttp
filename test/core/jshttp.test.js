'use strict'

const assert = require('assert')
const jshttp = require('../../index.js')

describe('测试导出库 `jshttp` 的各属性和方法', function () {
  it('`jshttp` 本身是一个函数', function () {
    assert(typeof jshttp === 'function')
  })

  it('`jshttp` 挂载 `create` 方法', function () {
    assert(jshttp.create && typeof jshttp.create === 'function')
  })

  it('`jshttp` 挂载常用请求方法', function () {
    const methods = ['get', 'post', 'delete', 'put', 'patch']
    methods.forEach((method) => {
      assert(jshttp[method] && typeof jshttp[method] === 'function')
    })
  })
})
