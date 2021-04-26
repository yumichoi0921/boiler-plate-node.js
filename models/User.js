const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        // 문자열의 space를 없애줌
        trim: true,         
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    // 유효성 관리
    token: {    
        type: String
    },
    // token의 유효기간
    tokenExp: {
        type: Number
    }


})

const User = mongoose.model('User', userSchema)
module.exports = { User }