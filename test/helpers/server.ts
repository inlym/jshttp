import { createServer, Server } from 'http'

/**
 * 启动一个用于测试的服务端
 *
 * @param port 服务器端口号
 */
export function launchServer(port: number): Promise<Server> {
  return new Promise((resolve) => {
    const server: Server = createServer((request, response) => {
      const { method, headers, url } = request

      const bufferList: Buffer[] = []
      request.on('data', (buf) => {
        bufferList.push(buf)
      })

      request.on('end', () => {
        const bufferAll = Buffer.concat(bufferList)
        const data = bufferAll.toString()

        const u = new URL(url!, `http://localhost:${port}`)

        const path = u.pathname
        const query: Record<string, string> = {}

        u.searchParams.forEach((value: string, key: string) => {
          query[key] = value
        })

        /** 原样返回请求内容作为响应数据 */
        const responseData = { method, url, headers, data, path, query }

        response.writeHead(200)
        response.end(JSON.stringify(responseData))
      })
    })

    server.listen(port, () => {
      resolve(server)
    })
  })
}
