## 安装包依赖

- `npm install`



## 开启服务器

- 在`app.js`目录下执行命令：`node app.js`
- 端口为`3000`



## 目录结构

```
app.js	项目的入口文件
controllers
models	存储使用mongoose设计的数据模型
node_modules	第三方包
package.json	包描述文件
package-lock.json	第三方包版本锁定文件（npm5之后才有）
public	公共静态资源
routes  路由文件
views	存储视图目录
```



## 路由设计

| 路由      | 方法 | get参数 | post参数                | 是否需要登录 | 备注         |
| --------- | ---- | ------- | ----------------------- | ------------ | ------------ |
| /         | get  |         |                         |              | 渲染首页     |
| /register | get  |         |                         |              | 渲染注册页面 |
| /register | post |         | email,nickname,password |              | 处理注册请求 |
| /login    | get  |         |                         |              | 渲染登陆界面 |
| /login    | post |         | email,password          |              | 处理登录请求 |
| /loginout | get  |         |                         |              | 处理退出请求 |
|           |      |         |                         |              |              |