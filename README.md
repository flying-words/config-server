# limijiaoyin-config-server

厘米脚印基于 yaml 文件格式的配置服务。为一个项目的其他服务提供统一的配置读取接口。

使用 limijiaoyin-config-server 的好处是：

1. 统一管理配置，减少子系统的配置工作量

2. 使用版本管理工具可对配置文件进行跟踪管理

__为了安全起见，请使用 https 。__

### 本项目使用方式

本项目只用来提供模板，如果需要使用的话，请 clone 代码，然后将代码推送到新的代码库当中。

### 工作原理

所有的配置文件放在 config 文件夹当中，解析的规则如下：

* ./config/application.yml 提供了项目的通用配置
* ./config/{environment}.yml 文件提供了针对不同环境的配置
* 服务提供 `GET /config/:environment` 接口：
  * 接受请求是，会根据 `environment` 参数读取 config 当中对应的 yaml 文件以及 application.yml 文件
  * 并对两个配置 文件的内容进行合并（`merge(application, environment)`），[merge 的规则](https://github.com/KyleAMathews/deepmerge#mergex-y)。，也就是说参数对应的 yaml 文件会覆盖 application.yaml 文件当中相应的配置。



举个简单的例子，比如 config 当中有 development.yml 和 application.yml 两个文件：

./config/application.yml 文件：

```yaml
name: application
hello: world
```

./config/development.yml 文件：

```yaml
hello: kitty
```

那么访问接口 `GET /config/development` 时，服务会返回：

```yaml
name: application
hello: kitty
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

### 安全信息存储

密码等安全信息不应该直接保存在配置文件当中，但是 limijiaoyin-config-server 支持使用环境变量保存安全信息，比如以下的配置文件：

```yaml
wechat:
 secret: ${WECHAT_SECRET}
```

服务在解析到 `${VARIABLE}` 格式的 value 时，会读取对应的环境变量填充进来。比如环境变量是 `xxx-xxxx-xxx` ，那么接口返回的结果就会变成：

```json
{
  "wechat": {
    "secret": "xxx-xxxx-xxx"
  }
}
```

### FAQ

为什么不用 consul、etcd 这样的配置服务？

> 很多项目的规模并不大，使用 consul、etcd 之类的服务会使得项目的复杂程度升高。为了折中，我们选择了 limijiaoyin-config-server 方案。

为什么不用 JSON 而用 YAML？

> 关于应该用哪种格式写配置文件的争论实在太多太多，这里不做过多讨论。从实战经验来看，之所以选择 yaml 主要是因为 yaml 天生支持注释。


