import { decodeQueryString, encodeQueryObject, standardEncoding } from '../src/core/qs'

describe('core/qs.ts', () => {
  describe('encodeQueryObject', () => {
    test('转化一个普通对象', () => {
      const obj = {
        name: 'inlym',
        age: 19,
      }
      expect(encodeQueryObject(obj)).toBe('age=19&name=inlym')
    })

    test('混乱的对象键名顺序，转化结果按字典排序', () => {
      const obj = {
        name: 'inlym',
        age: 19,
        isGood: true,
        nickname: 'goodboy',
        address: 'YourHeart',
      }
      expect(encodeQueryObject(obj)).toBe('address=YourHeart&age=19&isGood=true&name=inlym&nickname=goodboy')
    })

    test('空对象转化为空字符串', () => {
      const obj = {}
      expect(encodeQueryObject(obj)).toBe('')
    })

    test('数组类型转化为以逗号分隔的字符串', () => {
      const obj = {
        arr: ['one', 'two', 'three'],
      }
      expect(encodeQueryObject(obj)).toBe('arr=one,two,three')
    })

    test('日期类型转化为符合 ISO 8601 扩展格式的字符串', () => {
      const timestamp = 1626748096042
      const obj = {
        date: new Date(timestamp),
      }
      expect(encodeQueryObject(obj)).toBe('date=2021-07-20T02:28:16.042Z')
    })
  })

  describe('decodeQueryString', () => {
    const querystring = 'address=YourHeart&age=19&isGood=true&name=inlym&nickname=goodboy'
    const expected = {
      name: 'inlym',
      age: '19',
      isGood: 'true',
      nickname: 'goodboy',
      address: 'YourHeart',
    }

    test('普通标准格式查询字符串转化', () => {
      expect(decodeQueryString(querystring)).toEqual(expected)
    })

    test('查询字符串前包含带 `?` 符号和 path', () => {
      const url = 'https://www.jshttp.cn/path/to?' + querystring
      expect(decodeQueryString(url)).toEqual(expected)
    })

    test('查询字符串后包含带 `#` 符号和其他内容', () => {
      const url = querystring + '#firststep'
      expect(decodeQueryString(url)).toEqual(expected)
    })
  })

  describe('standardEncoding', () => {
    test('特定字符（@,:,$,,,;,+,=,?,/）未被转码', () => {
      const arr = ['@', ':', '$', ',', ';', '+', '=', '?', '/']
      arr.forEach((c) => {
        expect(standardEncoding(c)).toBe(c)
      })
    })

    test('常见的几种情况的字符转码正确', () => {
      const arr = ['abc', '我', '!', '=', ' ', '%']
      const expectedArr = ['abc', '%E6%88%91', '!', '=', '%20', '%25']
      for (let i = 0; i < arr.length; i++) {
        expect(standardEncoding(arr[i])).toBe(expectedArr[i])
      }
    })
  })
})
