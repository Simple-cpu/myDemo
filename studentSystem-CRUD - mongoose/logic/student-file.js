/**
 * student.js 
 * 数据操作文件模块
 * 职责：操作文件的数据，不关心业务，只关心数据
 */

var fs = require('fs');
var Student = require('./student-mongoose');

// 这里的方法是在 router.js 调用的
// 但是 router,js 的方法是在 app.js 中调用的
// 所以这里的方法 是在 app.js 中调用的
var dbPath = './logic/stuDB.json';


/**
 * 获取所有的学生列表
 * callback中的参数
 *    err  成功是 null  错误是 错误对象
 *    data 成功是数组    错误是  undefined
 */
exports.findAll = function (callback) {
    fs.readFile(dbPath, function (err, data) {
        if (err) {
            return callback(err);
        };
        console.log(JSON.parse(data.toString()));
        callback(null, JSON.parse(data.toString()));
    });
}


/**
 * 添加保存学生
 */
exports.save = function (student, callback) {
    fs.readFile(dbPath, function (err, data) {
        if (err) {
            return callback(err);
        };
        var students = JSON.parse(data.toString());
         //  处理男女 0和1
        if (student.gender == 0) {
            student.gender = '男';
        } else {
            student.gender = '女';
        }
        // 处理 id
        if (students.length == 0) {
            student.id = 1;
        } else {
            student.id = parseInt(students[students.length - 1].id) + 1;
        }
        
        students.push(student);
        let fileDate = JSON.stringify(students);
        fs.writeFile(dbPath, fileDate, function (err) {
            if (err) {
                return callback(err);
            }
            // 成功就没有错，所以 err 为 null
            callback(null);
        });

    });
}

/**
 * 编辑学生,根据 id 渲染编辑学生页面
 */
exports.findId = function (id, callback) {
    fs.readFile(dbPath, function (err, data) {
        if (err) {
            return callback(err);
        }
        var students = JSON.parse(data.toString());
        
        callback(null, students[id - 1]);
    });
}

/**
 * 处理学生编辑提交的数据
 */
exports.updateById = function (param, callback) {
    fs.readFile(dbPath, function (err, data) {
        if (err) {
            return callback(err);
        }
        var students = JSON.parse(data.toString());
        // 根据 id 找到学生
        let id = parseInt(param.id);
        let student = students[id - 1];
        console.log(student.gender);
        if (param.gender == 0) {
            param.gender = '男';
        } else {
            param.gender = '女';
        }
        // 修改数据
        for(var key in param){
            student[key] = param[key];
        }

        // 把对象转换为字符串
        let fileDate = JSON.stringify(students);

        // 把字符串保存到文件
        fs.writeFile(dbPath, fileDate, function (err) {
            if (err) {
                return callback(err); 
            }
            callback(null);

        });
    });
}


/**
 * 删除学生
 */
exports.delete = function (id, callback) {
    fs.readFile(dbPath, function (err, data) {
        if (err) {
            return callback(err);
        }
        console.log(id);
        var students = JSON.parse(data.toString());
        // 删除学生
        students.splice(id - 1, 1);
        // 删除一项时 更新 id
        students.forEach((item) => {
            if (item.id > id - 1) {
                item.id -= 1;
            }
        });
        let fileDate = JSON.stringify(students);
        fs.writeFile(dbPath, fileDate, function (err) {
            if (err) {
                return callback(err); 
            }
            callback(null);

        });
    });
}