## 安装包依赖

- `npm install`



## 开启服务器

- 在 `app.js`文件目录下执行命令： `node app.js`
- 端口号为 `3000`



## 路由设计

| 请求方法 | 请求路径         | get参数 | post参数                   | 备注             |
| -------- | ---------------- | ------- | -------------------------- | ---------------- |
| GET      | /students        |         |                            | 渲染首页         |
| GET      | /students/new    |         |                            | 渲染添加学生页面 |
| POST     | /students/new    |         | name,age,gender,hobbies    | 处理添加学生请求 |
| GET      | /students/edit   | id      |                            | 渲染编辑页面     |
| POST     | /students/edit   |         | id,name,age,gender,hobbies | 处理编辑请求     |
| GET      | /students/delete | id      |                            | 处理删除请求     |