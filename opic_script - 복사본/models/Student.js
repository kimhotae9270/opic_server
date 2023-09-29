const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : {
        type: String
    },
    docsLink : {
        type: String
    },
    quizletCount :{
        type : Number
    },
    email : {
        type : String
    },
    phoneNum : {
        type : String
    }
}) 



const Student = mongoose.model('Student',userSchema)//모델로 스키마를 감쌈

module.exports={Student}//다른 곳에서도 쓸수있게 함