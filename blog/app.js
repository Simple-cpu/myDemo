const express = require('express');
const path = require('path');
const router = require('./router');
const bodyParser = require('body-parser');
const session = require("express-session");

let app = express();

// 开放公共模块
app.use('/public/', express.static(path.join(__dirname, './public')));
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules')));

// 配置 art-template
app.engine('html', require('express-art-template'));
app.set('views', path.join(__dirname, './views')); // 默认就是views目录

// 配置 body-parser 解析表单POST请求数据
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(bodyParser.json())

// 配置 express-session 
app.use(session({
  // 配置加密字符串，他会在原有的基础上和字符串拼接起来去加密
  // 目的是为了增加安全性，防止客户端恶意伪造
  secret: "blog",
  resave: false,
  // 当为 true 时，在初始化的过程中，无论是否使用 session 都会分配一把钥匙(此钥匙没什么用)
  // 当为 false 时，在初始化的过程中，不会分配钥匙，只有在使用时才分配
  saveUninitialized: true,    
  cookie: ('name', 'value', {
    // maxAge: 5 * 60 * 1000,    // 设置过期时间，默认浏览器关闭时失效
    secure: false
  })
}));

// 将路由挂载到 app 中
app.use(router);


// 配置全局错误处理中间件 --> 4个形参
app.use((err, req, res, next) => {
  res.status(500).json({
    err_code: 500,
    message: err.message
  });
});

// 配置错误处理页面
app.use((req, res, next) => {
  res.render('404.html');
});

app.listen(3000, () => {
  console.log('running...');
})