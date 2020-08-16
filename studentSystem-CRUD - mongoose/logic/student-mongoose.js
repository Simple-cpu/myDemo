
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/stuDB');

let Schema = mongoose.Schema;
 
let studentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: Number,
        enum: [0, 1],   // 枚举，只能是0或者1
        default: 0  // 默认为0
    },
    age: {
        type: Number,
    },
    hobby: {
        type: String,
    }
});

module.exports = mongoose.model('Student', studentSchema);

// 测试
// let stu = {
//     name: 'Mary',
//     gender: 1,
//     age: 24,
//     hobby: '跳舞'
// };
// new Student(stu).save(function (err, ret) {
//     if (err) {
//         console.log('添加失败');
//     } else {
//         console.log('添加成功');
//         console.log(ret);
//     }
// });