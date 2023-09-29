const express = require('express');
const { UserAnswer } = require('../models/UserAnswer');
require("dotenv").config();
const router = express.Router();
const { MongoClient } = require('mongodb');


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


router.get('/getCountAnswer', async (req,res)=>{
  const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // MongoDB 서버에 연결
    await client.connect();
    const collectionName = "useranswers"
    const dbName = 'test'
    // 데이터베이스와 컬렉션을 가져옴
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 컬렉션에서 데이터 개수 가져오기
    const count = await collection.countDocuments();

    res.json({count : count})
  } finally {
    // 연결 해제
    client.close();
  }
})


router.get('/getUsefulAnwser', async(req,res)=>{
  const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // MongoDB 서버에 연결
    await client.connect();
    const collectionName = "useranswers"
    const dbName = 'test'
    // 데이터베이스와 컬렉션을 가져옴
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // title 필드가 존재하는 문서 가져오기
    const documents = await collection.find({ title: { $exists: true, $ne: "" } }).toArray();
    const count = await collection.countDocuments({ title: { $ne: "" } });
    res.json({document : documents, count: count})
  } finally {
    // 연결 해제
    client.close();
    
  }
})


module.exports = router;