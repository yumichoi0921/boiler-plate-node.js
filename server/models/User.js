const mongoose = require('mongoose');
// bcrypt(비밀번호를 암호화) 모듈 가져오기
const bcrypt = require('bcrypt');
// salt의 자릿수 
const saltRounds = 10;
// jsonwebtoken 모듈 가져오기 
const jwt = require('jsonwebtoken');

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


// Register Route에서 user.save(정보를 저장)하기 전에 비밀번호 암호화
// User 모델에 정보를 저장하기 전에 function 실행
// next = user.save
userSchema.pre('save', function( next ) {
    var user = this;

    // 비밀번호를 암호화 시킴    
    if(user.isModified('password')) {
         // salt 생성
         bcrypt.genSalt(saltRounds, function(err, salt){
            if (err) return next(err)

            // plain password -> hash
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }     
})


// Login Route-> 비밀번호가 맞는 비밀번호인지 확인
userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword를 암호화 시켜 암호화된 비밀번호와 비교한다
   bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch)
   })
}


// Login Route-> token 생성 
userSchema.methods.generateToken = function(cb) {
    var user = this;

    // jsonwebtoken을 이용해서 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}


// Auth Route-> 토큰을 복호화한 후 토큰과 일치하는 유저를 찾음 
userSchema.statics.findByToken = function(token, cb){
    var user = this;
    // user._id + '' = token
    // 토큰을 decode한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })
}






const User = mongoose.model('User', userSchema)
module.exports = { User }