'use strict'

const FIELDS = Symbol('headers#fields')

module.exports = {
  get [FIELDS]() {
    return Object.keys(this)
  },

  checkValue(value) {
    const validType = ['number', 'string', 'boolean']
    if (validType.includes(typeof value) || (typeof value === 'object' && typeof value.length === 'number')) {
      return true
    }
    throw new Error('配置项 `headers` 的属性值的数据类型应为：数字、字符串、布尔值或数组！')
  },

  get(field) {
    for (const key of this[FIELDS]) {
      if (field.toLowerCase() === key.toLowerCase()) {
        return this[key]
      }
    }
    return ''
  },

  set(field, value) {
    this.checkValue(value)
    this.remove(field)
    this[field] = value
  },

  remove(field) {
    for (const key of this[FIELDS]) {
      if (field.toLowerCase() === key.toLowerCase()) {
        delete this[key]
      }
    }
  },

  import(obj) {
    if (typeof obj !== 'object') {
      throw new Error('使用 `import` 方法的值应该是一个对象！')
    }

    for (const key of Object.keys(obj)) {
      this.set(key, obj[key])
    }
  },

  /**
   * 清空
   */
  flush() {
    for (const key of this[FIELDS]) {
      delete this[key]
    }
  },
}
