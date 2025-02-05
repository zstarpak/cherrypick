CherryPick 设置和安装指南
================================================================

非常感谢您对构建 CherryPick 服务器的关注！
这份指南描述了 CherryPick 的安装与设置流程。

- [日本語版もあります - Japanese version also available](./setup.ja.md)
- [英語版もあります - English version also available](./setup.en.md)
- [韓国語版もあります - Korean version also available](./setup.ko.md)

----------------------------------------------------------------

*1.* 创建 CherryPick 用户
----------------------------------------------------------------
直接使用 root 用户来运行 cherrypick 也许并不是一个好主意，因此我们有必要创建一个专用的用户。
以 Debian 为例：

``` bash
adduser --disabled-password --disabled-login cherrypick
```

*2.* 安装依赖
----------------------------------------------------------------
请安装并设置如下这些软件：

#### Dependencies :package:
* **[Node.js](https://nodejs.org/en/)** (12.x, 14.x, 15.x)
* **[PostgreSQL](https://www.postgresql.org/)** (>= 10)
* **[Redis](https://redis.io/)**

##### Optional
* [Yarn](https://yarnpkg.com/) *可选，但出于安全因素考虑还是推荐安装。如果您没有安装, 您需要使用 `npx yarn` 来代替 `yarn`.*
* [Elasticsearch](https://www.elastic.co/) - 为了启用搜索功能，这个搜索引擎是有必要的。
* [FFmpeg](https://www.ffmpeg.org/)

*3.* 安装 CherryPick
----------------------------------------------------------------
1. 连接至 cherrypick 用户.

	`su - cherrypick`

2. 克隆 CherryPick 项目的 master 分支。

	`git clone -b master git://github.com/kokonect-link/cherrypick.git`

3. 进入 cherrypick 文件夹。

	`cd cherrypick`

4. 检查 [最新发布版](https://github.com/kokonect-link/cherrypick/releases/latest) 标签。

	`git checkout master`

5. 安装 CherryPick 的依赖。

	`yarn`

*4.* 配置 CherryPick
----------------------------------------------------------------
1. 复制 `.config/example.yml` 并重命名为 `default.yml`。

	`cp .config/example.yml .config/default.yml`

2. 编辑 `default.yml`

*5.* 构建 CherryPick
----------------------------------------------------------------

使用如下的指令构建 CherryPick ：

`NODE_ENV=production yarn build`

如果您使用的是 Debian ， 您需要安装 `build-essential`, `python` 环境包。

如果您仍然遇到有关某些模块的错误，您可以使用 node-gyp:

1. `npx node-gyp configure`
2. `npx node-gyp build`
3. `NODE_ENV=production yarn build`

*6.* 初始化数据库
----------------------------------------------------------------
``` bash
yarn run init
```

*7.* 完成了！
----------------------------------------------------------------
干得不错！现在您拥有了一个可以运行CherryPick的环境啦。

### 正常启动
只需要 `NODE_ENV=production npm start` 即可。玩得愉快!

### 使用 systemd 来启动

1. 在此处创建一个 systemd 服务：

	`/etc/systemd/system/cherrypick.service`

2. 编辑它，粘贴如下内容并保存：

	```
	[Unit]
	Description=CherryPick daemon

	[Service]
	Type=simple
	User=cherrypick
	ExecStart=/usr/bin/npm start
	WorkingDirectory=/home/cherrypick/cherrypick
	Environment="NODE_ENV=production"
	TimeoutSec=60
	StandardOutput=syslog
	StandardError=syslog
	SyslogIdentifier=cherrypick
	Restart=always

	[Install]
	WantedBy=multi-user.target
	```

3. 重启 systemd 并设置 cherrypick 服务自动启动：

	`systemctl daemon-reload ; systemctl enable cherrypick`

4. 启动 cherrypick 服务：

	`systemctl start cherrypick`

您可以使用 `systemctl status cherrypick` 来检查服务是否正在运行。

### 如何将您的 CherryPick 服务器升级至最新版本
1. `git checkout master`
2. `git pull`
3. `git submodule update --init`
4. `yarn install`
5. `NODE_ENV=production yarn build`
6. `yarn migrate`
7. 重启您的 CherryPick 进程来应用改变。
8. 尽情享受吧！

如果您在更新时遇到任何问题，请尝试以下操作：
1. `yarn clean` 或是 `yarn cleanall`
2. 重试升级 （请不要忘记 `yarn install` ）

----------------------------------------------------------------

如果您有任何疑问或是困惑，欢迎与我们联系！
