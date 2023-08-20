const express = require('express');
const { UserAnswer } = require('../models/UserAnswer');
const router = express.Router();

router.post('/save_answer',async (req,res)=>{
    const userAnswer = new UserAnswer(req.body)
    await userAnswer.save().then(()=>{
        res.status(200).json({success:true})
      }).catch((err)=>{
        res.json({success:false, err})
      })
})

router.get('/getAnswer', async (req,res) => {
  await UserAnswer.find({userId: req.body._id}).sort({ _id: -1 }).then((doc) => {
    if(doc.length === 0){
      res.json({success:false, message : "생성된 답변이 없습니다."})
    }else{
      res.json({success:true , doc : doc})
    }
  }).catch((err)=>{
    res.json({success:false, err})
  })
})

module.exports = router;