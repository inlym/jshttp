'use strict'

/**
 * 当前文件用于引入原生 `axios` 的方法，所有需要使用 `axios` 源代码的方法均从此文件引入
 */

const path = require('path')

/** `axios` 库的入口文件路径（绝对路径） */
let entry = ''

try {
  entry = require.resolve('axios')
} catch (error) {
  throw new Error('未找到 `axios` 模块，请确保已安装 `axios` ！')
}

/** `axios` 库的根目录 */
const axiosDir = path.resolve(entry, '..')

exports.settle = require(path.resolve(axiosDir, 'lib/core/settle.js'))
