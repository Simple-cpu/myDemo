var express = require('express');
var bodyParser = require('body-parser');
var router = require('./logic/router.js');

var app = express();

// 开放公众模块 public
app.use('/public/', express.static('./public/'));

// 配置 art-template
// 会自动去 views 文件夹下查找 文件
app.engine('html', require('express-art-template'));

// 配置 body-parser 来获取post请求体参数
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 将路由容器挂载到服务器
app.use(router);

app.listen(3000, function () {
    console.log('running...');
});