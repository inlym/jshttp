import { Headers } from '../../src/core/headers'

describe('src/core/headers', () => {
  describe('带初始值创建实例', () => {
    const initHeaders = {
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'X-My-Header': 'hello',
    }

    const myHeaders = new Headers(initHeaders)

    test('实例创建成功', () => {
      expect(myHeaders).toBeDefined()
    })

    test('使用 `toJSON` 方法输出，结果与预期值一致', () => {
      const expected = {
        'connection': 'keep-alive',
        'content-type': 'application/json',
        'x-my-header': 'hello',
      }

      expect(myHeaders.toJSON()).toEqual(expected)
    })

    test('使用 `has` 方法查询已存在的键名（包含大小写各种组合），返回 `true`', () => {
      expect(myHeaders.has('Connection')).toBe(true)
      expect(myHeaders.has('connection')).toBe(true)
      expect(myHeaders.has('CONNECTION')).toBe(true)

      expect(myHeaders.has('X-My-Header')).toBe(true)
      expect(myHeaders.has('x-my-header')).toBe(true)
    })

    test('使用 `has` 方法查询不存在的键名，返回 `false`', () => {
      expect(myHeaders.has('inlym')).toBe(false)
      expect(myHeaders.has('jshttp')).toBe(false)
    })

    test('使用 `get` 方法获取字段值正确', () => {
      expect(myHeaders.get('Connection')).toBe('keep-alive')
      expect(myHeaders.get('connection')).toBe('keep-alive')
    })

    test('使用 `get` 方法获取不存在的字段名的值，返回空字符串', () => {
      expect(myHeaders.get('jshttp')).toBe('')
    })

    test('使用 `remove` 方法移除字段正确', () => {
      expect(myHeaders.remove('connection').has('connection')).toBe(false)
    })

    test('使用 `remove` 方法移除不存在的字段，没有报错', () => {
      expect(myHeaders.remove('sadfghjkj')).toBeDefined()
    })

    test('使用 `set` 方法设置一个不存在的字段，设置成功', () => {
      const field = 'myName2'
      const value = 'hello'
      expect(myHeaders.set(field, value).get(field)).toBe(value)
    })

    test('使用 `set` 方法设置一个已存在的字段，设置成功', () => {
      const field = 'myName2'
      const value = 'hello2'
      expect(myHeaders.set(field, value).get(field)).toBe(value)
    })
  })

  describe('不带初始值创建实例', () => {
    const myHeaders = new Headers()

    test('实例创建成功', () => {
      expect(myHeaders).toBeDefined()
    })

    test('使用 `toJSON` 方法输出，输出空对象', () => {
      const expected = {}
      expect(myHeaders.toJSON()).toEqual(expected)
    })
  })
})
