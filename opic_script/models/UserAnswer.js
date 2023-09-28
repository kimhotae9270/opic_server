const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    title : {
        type: String
    },
    id : {
        type: String
    },
    mainQuestion :{
        type : String
    },
    interviewKor : {
        type : String
    },
    interviewEng : {
        type : String
    },
    optionList :{
        type : [String]
    },
    additionalOption : {
        type : String
    },
    tryNum : {
        type : Number
    },
    errNum : {
        type : Number
    },
    errLog :{
        type: String
    },
    reqDate :{
        type : String
    },
    userId : {
        type : String
    }
}) 



const UserAnswer = mongoose.model('UserAnswer',userSchema)//모델로 스키마를 감쌈

module.exports={UserAnswer}//다른 곳에서도 쓸수있게 함