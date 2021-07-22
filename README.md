# jshttp

![JsHttp Banner](https://img.inlym.com/4a8c7a777c9b40aeba08de4c10aaa1b4.png)

![GitHub](https://img.shields.io/github/license/inlym/jshttp)
![npm](https://img.shields.io/npm/v/jshttp)
![npm bundle size](https://img.shields.io/bundlephobia/min/jshttp)
![npm](https://img.shields.io/npm/dw/jshttp)
![GitHub language count](https://img.shields.io/github/languages/count/inlym/jshttp)
![GitHub top language](https://img.shields.io/github/languages/top/inlym/jshttp)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/inlym/jshttp)
![Lines of code](https://img.shields.io/tokei/lines/github/inlym/jshttp)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/inlym/jshttp)
![GitHub Repo stars](https://img.shields.io/github/stars/inlym/jshttp?style=social)

`JsHttp` 是一个基于 `Axios` 的 `Javascript` HTTP 请求库，支持在任何 `Javascript` 环境中发起 HTTP 请求（目前已支持 `Node.js`，`浏览器`，各大平台小程序，包含`微信`、`QQ`、`支付宝`、`字节跳动`等平台），在各个环境提供完全一致 `API`。

## 目录

- [jshttp](#jshttp)
  - [目录](#目录)
  - [介绍](#介绍)
    - [背景](#背景)
    - [特点](#特点)
  - [安装](#安装)
  - [使用](#使用)
    - [发起一个请求](#发起一个请求)
    - [更方便的调用方式](#更方便的调用方式)
  - [配置项](#配置项)
  - [作者](#作者)
  - [参与](#参与)
  - [许可证](#许可证)

## 介绍

### 背景

在日常的开发中，发起一个 HTTP 请求是非常常见的需求，作为一个全栈开发者，笔者需要同时开发 `Node.js`，`Web`，`小程序` 等端，在各端上都有各自推荐使用的 HTTP 请求库或者官方请求方法，笔者在使用过程中的一个痛点是需要去记住各自的参数，每次使用还需要查文档，十分不方便。同时各个 HTTP 请求库都有一定的局限性，并不是完全符合笔者的需求，于是笔者就打算自己写一个可以横跨所有 `Javascript` 平台的 HTTP 请求库。

另外，常用的 HTTP 请求库 `Axios` 本身已经非常成熟了，因此笔者基于 `Axios` 进行开发，拓展了 `Axios` 原生的 `adapter` 和 `interceptor` 来完成对应功能。

### 特点

`JsHttp` 具有以下特点：

1. 支持所有的 `Javascript` 环境（也就是说，只要你在用 `Javascript` 写代码，你可以可以使用 `JsHttp` 来发起请求）。
2. 完全兼容 `Axios` 参数，可以从 `Axios` 无缝迁移到 `JsHttp`。
3. 内置了一些中间件，例如请求内容签名、格式转换等，进行简单配置后就可以直接使用。
4. 全中文错误提示，更利于开发和调试。

## 安装

你可以使用 `npm` 来安装 `JsHttp` ，当然也可以使用其他工具（`yarn`, `cnpm` 等）安装，在你的项目目录安装即可，无需全局安装。

安装命令：

```sh
$ npm install jshttp
```

## 使用

如果你使用过 `Axios`，那么你几乎可以无缝迁移到 `JsHttp`，因为 `JsHttp` 提供了和 `Axios` 几乎完全一致的 `API` 和 `配置参数` 。在本节中，将告知你一些基本的使用方式。

### 发起一个请求

```javascript
// 引入 `jshttp` 库
const jshttp = require('jshttp')

// 发起一个请求
jshttp({
  method: 'POST',
  baseURL: 'https://debub.inlym.com',
  url: '/request/abc/def',
  params: {
    id: 1,
  },
  data: {
    name: 'inlym',
    age: 29,
  },
}).then((res) => {
  console.log(res.status)
  console.log(res.headers)
  console.log(res.data)
})
```

### 更方便的调用方式

对应一些常用的 `请求方法`，可以直接以 `jshttp[mehtod]` 的方式发起请求，例如：

```javascript
jshttp
  .get({
    baseURL: 'https://debub.inlym.com',
    url: '/request/abc/def',
    // ...
  })
  .then((res) => {
    // ...
  })
```

当然对于更简单的请求，例如只有一个 `url` 地址的，可以直接使用下面这种方式：

```javascript
jshttp.get('https://debub.inlym.com/request?id=1').then((res) => {
  // ...
})
```

## 配置项

上面的使用示例列举了一些请求参数，下面例举所有的可用请求参数（同时提供了参数示例）：

````javascript
{
  /**
   * 请求方法
   *
   * 1. 默认值：`GET`
   * 2. `jshttp` 库本身不对请求方法做出限制，部分第三方平台会对请求方法做限制，例如微信在微信小程序中只支持以下方法：
   * OPTIONS,GET,HEAD,POST,PUT,DELETE,TRACE,CONNECT。
   * 3. `jshttp` 库会对请求方法名称自动做大写处理，因此你可以填写 `get` 表示 `GET`。
   */
  method: 'GET',

  /**
   * 请求基础地址
   *
   * 1. 用于和 `url` 拼接成完整的地址
   * 2. 可为空，不为空时要求以 `http://` 或 `https://` 开头
   * 3. 配置项 `url` 以 `http://` 或 `https://` 开头时，配置项 `baseURL` 无效
   */
  baseURL: 'https://debug.inlym.com',

  /**
   * 请求地址
   *
   * 1. 可单独存在，或者和 `baseURL` 拼接合成完整请求地址
   * 2. 和 `baseURL` 不能同时为空
   * 3. 可以以 `http://` 或 `https://` 开头，此时配置项 `baseURL` 无效
   * 3. 可包含查询字符串并同时使用 `params` 参数（最终处理时会自动将两者合并）
   */
  url: '/path/to',

  /**
   * 请求头
   *
   * 1. 有部分请求头被所在平台禁用，请关注各自平台禁用的请求头
   * 2. 请求头不区分大小写，即 `'Content-Type` 和 `content-type` 不能同时存在
   */
  headers: {
    'Content-Type': 'application/json',
  },

  /**
   * 请求参数，最终以 `name=mark&age=19` 的形式合并到 `url` 中
   */
  params: {
    name: 'inlym',
  },

  /**
   * 请求数据
   *
   * 1. 对象形式的请求数据会自动调用 `JSON.stringify` 生成字符串
   */
  data: {
    nickname: 'good boy',
    sex: 'male',
  },

  /**
   * Mock 响应数据
   *
   * 不会发送真实请求，而是直接返回在 `mock` 中配置的响应数据，一般用于前端调试场景
   */
  mock: {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
    data: {
      nickname: 'good body',
      age: 19,
    },

    /**
     * 延迟返回时间，模拟响应返回时间，单位：毫秒（ms），可为空
     */
    delay: 2000,
  },

  /**
   * 重试次数
   *
   * 使用 `validateStatus` 方法对响应结果进行校验，校验不通过则重试。建议配合中间件的 `ctx.retries` （当前重试次数）属性操作，当其大于 0 时，进行若干操作。
   */
  retry: 0,

  /****************** 以下配置项一般情况下不需要额外设置，使用默认值即可 *********************/

  /**
   * 响应的数据类型
   *
   * 合法值：
   * 1. `json` - 默认值
   * 2. `arraybuffer`
   * 3. `text`
   * 4. `blob`
   * 5. `document`
   * 6. `stream`
   */
  responseType: 'json',

  /**
   * 响应的字符编码
   *
   * 仅用于 `Node.js`，一般情况下无需设置
   *
   * 合法值：
   * 1. `utf8` - 默认值
   * 2. `utf-8` - 等同于 `utf8`
   * 3. `utf16le`
   * 4. `latin1`
   * 5. `base64`
   * 6. `hex`
   * 7. `ascii`
   * 8. `binary`
   * 9. `ucs2`
   */
  responseEncoding: 'utf8',

  /**
   * 请求超时时间
   *
   * 说明：
   * 1. `0` （默认值）表示无超时时间
   * 2. 单位：毫秒（ms）
   */
  timeout: 0,

  /**
   * 用户自定义中间件列表
   *
   * 1. 关于 `中间件` 请查看中间件章节
   * 2. 这里配置的中间件列表仅用于本次请求
   */
  middleware: [],

  /**
   * 是否是正常的响应状态码，函数返回为 `false` 将直接报错
   * @param {number} status 响应状态码
   *
   * 以下是默认值，正常响应状态码 200 ~ 299
   */
  validateStatus: function (status) {
    return typeof status === 'number' && status >= 200 && status < 300
  },

  /**
   * 请求适配器
   *
   * 这是 `jshttp` 能够兼容多平台的核心，判断所在平台，使用对应的适配器去承接请求，统一封装后返回。
   *
   * 你一般无需自定义适配器，可能用到需要自定义适配器的场景：
   * 1. `jshttp` 暂未支持的平台
   * 2. 更个性化的 `mock` 方案
   */
  adapter: function (config) {
    // ...
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      data: {},
    }
  },

  /**
   * 响应的返回内容项
   *
   * 合法值：
   * 1. `status`
   * 2. `statusText`
   * 3. `headers`
   * 4. `data`
   * 5. `config`
   * 6. `request`
   *
   * 支持别名，格式：
   * ```js
   * {
   *   item: 'status,
   *   alias: 'statusCode'
   * }
   * ```
   */
  responseItems: ['status', 'statusText', 'headers', 'data'],
}
````

## 作者

我是 [inlym](https://www.inlym.com) ，一个 `Javascript` 开发者。

如果你有任何问题或者建议，欢迎联系我，以下是我的联系方式：

- 邮箱：inlym@qq.com
- 主页：[www.inlym.com](https://www.inlym.com)

## 参与

非常欢迎你能够参与这个项目的开发和维护，你可以通过以下几种方式参与到项目中：

1. 提建议和需求。对于几句话就能说清楚的建议和需求，你可以直接 提一个 [New Issue](https://github.com/inlym/jshttp/issues/new) 。
2. Fork 项目，修改代码，然后提交 Pull requests 。（提交前请检查务必通过 ESLint 检查）

## 许可证

本项目使用 [MIT](LICENSE) 许可证。
