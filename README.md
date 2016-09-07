# limijiaoyin-config-server

厘米脚印配置服务。为一个项目的其他服务提供统一的配置读取接口。

使用 limijiaoyin-config-server 的好处是：

1. 统一管理配置，减少子系统的配置工作量

2. 使用版本管理工具可对配置文件进行跟踪管理

__为了安全起见，请使用 https 。__

### 工作原理

所有的配置文件放在 config 文件夹当中，解析的规则如下：

* ./config/application.json 提供了项目的通用配置
* ./config/{environment}.json 文件提供了针对不同环境的配置
* 服务提供 `GET /config/:environment` 接口：
  * 接受请求是，会根据 `environment` 参数读取 config 当中对应的 json 文件以及 application.json 文件
  * 并对两个 json 文件的内容进行合并，合并方式：`extend({}, application, environment)` ，也就是说参数对应的 json 文件会覆盖 application.json 文件当中项目的配置



举个简单的例子，比如 config 当中有 development.json 和 application.json 两个文件：

./config/application.json 文件：

```json
{
  "name": "application",
  "hello": "world"
}
```

./config/development.json 文件：

```json
{
  "hello": "kitty"
}
```

那么访问接口 `GET /config/development` 时，服务会返回：

```json
{
  "name": "application",
  "hello": "kitty"
}
```

### 接口鉴权

所有 `GET /config/:environment` 接口请求都需要发送一个 `X-CLIENT-TOKEN` ，这个 token 会在启动配置服务的时候创建，并交由调用方保管。上传方式如下所示：

```http
GET /config/product HTTP/1.1
Host: xxxx
X-SERVICE-TOKEN: CLIENT-TOKEN
```

如果 token 无效，则会返回：

```http
GET 401 HTTP/1.1
Host: xxxxx

{
	"errorId": "unauthorized",
	"errorMsg": "invalid client token"
}
```

### 密码等安全信息存储方式

密码等安全信息不应该直接保存在配置文件当中，但是 limijiaoyin-config-server 支持使用环境变量保存安全信息，比如以下的配置文件：

```json
{
  "wechat": {
    "secret": "ENV:WECHAT_SECRET"
  }
}
```

服务在解析到 `ENV:XXXX` 格式的 value 的时候会读取对应的环境变量填充进来。比如环境变量是 `xxx-xxxx-xxx` 那么配置文件解析的结果则变成：

```json
{
  "wechat": {
    "secret": "xxx-xxxx-xxx"
  }
}
```

