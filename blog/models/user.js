 const mongoose = require('mongoose')

 // 连接数据库
 mongoose.connect('mongodb://localhost/blog', { useMongoClient: true })

 let Schema = mongoose.Schema;

 let userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        // 注意：这里的 Date.now 不能写成 Date.now()
        // Date.now() 表示在创建 Schema 时就调用该方法 相当于 数据写死了
        default: Date.now 
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    avatar: {     // 头像
        type: String,
        default: '/public/img/avatar-default.png'
    },
    bio: {      // 个人介绍，简历
        type: String,
        default: ''
    },
    gender: {
        type: Number, 
        // -1保密 0男 1女
        enum: [-1, 0, 1],
        default: -1
    },
    birthday: {
        type: String
    },
    status: {
        type: Number,
        // 0 没有权限限制   1 不可以评论    2 不可以登录
        enum: [0, 1, 2],
        default: 0
    }
 })

 module.exports = mongoose.model('User', userSchema)