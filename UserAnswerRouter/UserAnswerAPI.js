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

module.exports = router;