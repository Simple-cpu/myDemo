var express = require('express');
var Students = require('./student-mongoose');

// 1. 创建路由容器
var router = express.Router();

// 2. 将页面的路由挂载到容器中
// 渲染首页
router.get('/student', function (req, res) {
    Students.find(function (err, students) {
        if (err) {
            return res.status(500).send('Server is Error');
        }
        // console.log(students);
        res.render('index.html', {
            students: students
        });
    });
});

// 渲染添加学生信息页面
router.get('/student/new', function (req, res) {
    res.render('new.html');
});

// 处理添加学生信息页面
router.post('/student/new', function (req, res) {
    new Students(req.body).save(function (err) {
        if (err) {
            return res.status(500).send('Server is Error');
        }
        res.redirect('/student');
    });
});

// 渲染学生编辑页面
router.get ('/student/edit', function (req, res) {
    var id = req.query.id;
    Students.findOne({_id: id}, function (err, student) {
        if (err) {
            return res.status(500).send('Server is error...');
        }

        res.render('edit.html', {
            student: student
        });
    });
});

// 处理学生编辑数据
router.post('/student/edit', function (req, res) {
    console.log(req.body);
Students.updateOne({id: req.query.id}, req.body, function (err, ret) {

        if (err) {
            console.log(err);
            return res.status(500).send('Server is error');
        }
        console.log(ret);
        res.redirect('/student');

    });
});


// 处理删除学生页面
router.get('/student/delete', function (req, res) {
    Students.deleteOne({_id: req.query.id}, function (err) {
        res.redirect('/student');
    });
});


// 3. 导出路由容器
module.exports = router;