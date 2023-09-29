const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    stars : {
        type: String
    },
    text : {
        type: String,
    },
    email : {
        type : String
    },
    date : {
        type: String
    }
}) 



const FeedBack = mongoose.model('FeedBack',userSchema)//모델로 스키마를 감쌈

module.exports={FeedBack}//다른 곳에서도 쓸수있게 함