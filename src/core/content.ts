/**
 * 自定义变量传递空间
 */
export class HttpContext {
  private readonly context = new Map<string, any>()

  constructor(init?: Record<string, any> | HttpContext) {
    if (init) {
      if (init instanceof HttpContext) {
        return init
      }

      Object.keys(init).forEach((key: string) => {
        this.set(key, init[key])
      })
    }
  }

  set(name: string, value: unknown): HttpContext {
    this.context.set(name, value)

    return this
  }

  get<T>(name: string): T {
    return this.context.get(name)
  }

  remove(name: string): HttpContext {
    this.context.delete(name)

    return this
  }

  forEach<R = any>(fn: (name: string, value: R) => void): void {
    this.context.forEach((value: R, name: string) => {
      fn(name, value)
    })
  }
}
