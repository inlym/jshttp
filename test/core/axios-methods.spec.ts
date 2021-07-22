import { createError } from '../../src/core/axios-methods'
import { JshttpRequestConfig } from '../../src/types/config.interface'
import { ErrorJson, JshttpError } from '../../src/types/error.interface'

/**
 * 当前文件的方位为 `axios` 库的原生方法，使用原生测试用例（略有改动）
 */

describe('core/axios-methods', () => {
  describe('createError', () => {
    const config: JshttpRequestConfig = { url: '/foo' }
    const request = { path: '/foo' }
    const response = { status: 200, statusText: 'OK', headers: {}, config, data: { foo: 'bar' } }
    const error: JshttpError = createError('Boom!', config, 'ESOMETHING', request, response)

    test('创建 `AxiosError` 并包含各指定属性', () => {
      expect(error instanceof Error).toBeTruthy()
      expect(error.message).toBe('Boom!')
      expect(error.config).toEqual(config)
      expect(error.code).toBe('ESOMETHING')
      expect(error.request).toBe(request)
      expect(error.response).toBe(response)
      expect(error.isAxiosError).toBeTruthy()
    })
  })
})
