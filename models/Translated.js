const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : {
        type: String
    },
    phoneNum : {
        type: String,
    },
    translated : {
        type : String
    },
    qTranslated : {
        type: String
    }
}) 



const Translated = mongoose.model('Translated',userSchema)//모델로 스키마를 감쌈

module.exports={Translated}//다른 곳에서도 쓸수있게 함