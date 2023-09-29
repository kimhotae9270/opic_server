const mongoose = require('mongoose')
require("dotenv").config();
const bcrypt = require('bcrypt')
const saltRounds = Number(process.env.SALR_ROUNDS) //솔트가 몇자리인지
const jwt = require('jsonwebtoken')
require("dotenv").config();
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,//공백문자를 없애줌
        unique: 1 //중복을 없에주는 옵션
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {// 역할
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {//토큰 유효기간
        type: Number
    }
}) 

//유저 정보를 저장하기전에 실행
userSchema.pre('save', function(next){

    var user = this;
    if(user.isModified('password')){//비밀번호가 바뀔때만 암호화 해준다
    
    //비밀번호 암호화
    bcrypt.genSalt(saltRounds, function(err, salt) {
        
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) {
                console.log(hash)
                return next(err)}
            // Store hash in your password DB.
            user.password = hash
            next()//함수를 끝내고 보내버림
        });
    });
}else {
    next()
}
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword (입력한 비밀번호)
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
            cb(null, isMatch)
    })
}
userSchema.methods.generateToken = async function(cb)  {
    var user = this
    //웹토큰을 이용해서 토큰 생성하기
    var token = jwt.sign(user._id.toHexString(), process.env.OPIC_TOKEN)//두개를 합쳐 토큰을 생성
    user.token = token
    await user.save().then((err, user)=>{
        if(err) return cb(err)
        cb(null,user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this
    //토큰 디코드
    jwt.verify(token, process.env.OPIC_TOKEN, async function(err,decoded){
        //유저 아이디를 이용하서 유저를 찾은 다음에
        //클라이언트에서 가져온 토큰과 디비에 보관된 토큰이 일치하는지 확인
        await user.findOne({"_id": decoded, "token": token}).then( function(user){
            if(!user){console.log("찾기 실패")}
            cb(null,user)
        })
    } )
}

const User = mongoose.model('User',userSchema)//모델로 스키마를 감쌈

module.exports={User}//다른 곳에서도 쓸수있게 함