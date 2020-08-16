/**
 * 处理路由
 */

const express = require('express');
const md5 = require('MD5');
const User = require('./models/user');

let router = express.Router();

/**
 * 渲染首页
 */
router.get('/', (req, res) => {
    console.log(req.session.user)

    res.render('index.html', {
        user: req.session.user
    });
});

/**
 * 登录部分
 */
router.get('/login', (req, res) => {
    res.render('login.html');
});

router.post('/login', (req, res) => {
    // 1. 获取表单数据
    // 2. 操作数据库
    // 3. 响应数据
    
    let body = req.body;

    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, (err, user) => {
        if (err) {
            // 当调用 next传递了参数的时候，会往后找带有 四个参数的应用程序级别的中间件
            // 然后会在全局错误中间件中处理
            return next(err);
        }

        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            });
        }

        req.session.user = user;
        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        });
    });
});



/**
 * 注册部分
 */
router.get('/register', (req, res) => {
    res.render('register.html');
});

router.post('/register', (req, res) => {
    // 1.获取表单提交数据
    // 2.操作数据库 
    //      查询数据库，如果邮箱或昵称存在，则注册失败；否则注册成功，新建用户
    // 3.发送响应
    //      响应为json数据，res.json() 传一个对象，将该对象转换为json字符串

    let body = req.body;
    body.password = md5(md5(body.password)); // 对密码进行加密

    User.findOne({
        $or: [ // 查询 或 操作
            {
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, (err, data) => {
        if (err) {
            return next(err);
        }

        if (data) { // 用户存在
            return res.status(200).json({
                err_code: 1, // 创建账户失败，用户存在
                message: 'Email or nickname already exit'
            });
        }

        // 用户不存在，创建新用户
        new User(body).save(function (err, user) {
            if (err) {
                return next(err);
            }

            // 注册成功，使用 Session 记录用户的登陆状态
            req.session.user = user;

            // Express 提供了一个响应方法：json
            // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })

            // 服务端重定向只针对同步请求才有效，异步请求无效
            // res.redirect('/')
        })

    });
});


/**
 * 退出功能
 */
router.get('/logout', (req, res) => {
    req.session.user == null;
    delete req.session.user;

    // 重定向
    res.redirect('/login');
});



/**
 * 发起话题
 */
router.get('/topics/new', (req, res) => {
    res.render('./topic/new.html', {
        user: req.session.user
    });
});


/**
 * 个人信息设置
 */
router.get('/settings/profile', (req, res) => {
    res.render('./settings/profile.html', {
        user: req.session.user
    });
});

router.get('/settings/admin', (req, res) => {
    res.render('./settings/admin.html', {
        user: req.session.user
    });
});



module.exports = router;