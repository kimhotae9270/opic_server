const express = require('express');
const { Student } = require('../models/Student');
require("dotenv").config();
const router = express.Router();
const { MongoClient } = require('mongodb');
const {Translated} = require('../models/Translated')


router.post('/addStudent', async(req,res)=>{
    const student = new Student(req.body)

  //user모델에 저장
    await student.save().then(()=>{
    res.status(200).json({ success: true})
  }).catch((err)=>{
    res.json({ success: false, err})
  })
})

router.get('/getStudent', async(req,res)=>{
    await Student.find({}).sort({ _id: -1 }).then((doc) => {
        if(doc.length === 0){
          res.json({success:false, message : "생성된 답변이 없습니다."})
        }else{
          res.json({success:true , students : doc})
        }
      }).catch((err)=>{
        res.json({success:false, err})
      })



});


router.post('/saveTranslated',async (req,res) => {
    const translated = new Translated(req.body)

    //user모델에 저장
    await translated.save().then(()=>{
      res.status(200).json({ success: true})
    }).catch((err)=>{
      res.json({ success: false, err})
    })


})

router.get('/getTranslated',async (req,res)=>{
    await Translated.find({phoneNum: req.body.phoneNum,name:req.body.name}).then(translated => {
        if(!translated){
          return res.json({
            Success: false,
            message: "자료가 없습니다"
          })
        }else{
            res.json({Success : true,translated : translated})
        }
    })
})


module.exports = router;