//index.js
const express = require("express"); //③번 단계에서 다운받았던 express 모듈을 가져온다.
const cors = require("cors");
const { callChatGPT } = require("./chatgpt");
const mongoose = require('mongoose');
const {FeedBack} = require('./models/FeedBack');
const {auth} = require('./middleware/auth')
const {User} = require('./models/User'); //User 모델을 가져옴
const cookieParser = require('cookie-parser');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const Quizlet = require('./router/Quizlet')
const UserAnswer = require('./router/UserAnswerAPI')
const Email = require('./router/snedEmail')
const Student = require('./router/Student')
const app = express(); //가져온 express 모듈의 function을 이용해서 새로운 express 앱을 만든다. 🔥
const port = 5000; //포트는 4000번 해도되고, 5000번 해도 된다. -> 이번엔 5000번 포트를 백 서버로 두겠다.

app.use(cookieParser());
app.use(cors());
app.use(express.json({
  limit: '1mb'
})); // for parsing application/json
app.use(express.urlencoded({ limit: '1mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.timeout = 180000;
mongoose.connect(process.env.MONGO_URI).then(()=> console.log('connect'))
 .catch(err => console.log(err))

 const router = express.Router();





app.get("/ask", async function (req, res) {
  res.render("askgpt", {
    pass: true,
  });
});

app.post("/ask", async (req, res) => {
  console.log("hi");
  const prompt = req.body.prompt;
  const temNum = req.body.temNum;
  const response = await callChatGPT(prompt, temNum);

  if (response) {
    res.json({ response: response });
  } else {
    res.status(500).json({ error: "Failed to get response from ChatGPT API" });
  }
});


app.post('/register', async (req, res) => {
  //회원가입할때 필요한 정보들을 클라이언트에서 가져오면
  //그것들을 데이터 베이스에 넣어준다

  //바디 패서를 통해 바디에 담긴 정보를 가져온다
  const user = new User(req.body)

  //user모델에 저장
  await user.save().then(()=>{
    res.status(200).json({ success: true})
  }).catch((err)=>{
    res.json({ success: false, err})
  })
})


app.post('/login', async (req,res)=>{
  //요청된 이메일을 데이터베이스에서 있는지 찾는다
  await User.findOne({email: req.body.email}).then(user => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "이메일 인증 실패"
      })
    }
    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch){
        return res.json({loginSuccess: false, massage : "비밀번호 틀림"})}
      //비밀번호까지 맞다면 토큰을 생성하기
      user.generateToken((user) => {
        //토큰을 저장한다 쿠키 또는 로컬스토리지에 지금은 쿠키
        res.cookie('x_auth', user.token)
        .status(200).json({ loginSuccess:true, userId: user._id})
        
      })
    })
  })
})


app.get('/auth',auth/*미들웨어*/ , (req,res)=>{
  //여기까지 미들웨어를 통과해 왔다는 얘기는 어스가 트루 라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    image : req.user.image,
    lastname: req.user.lastname,
    role : req.user.role
  })
})


app.get('/logout', auth, async (req,res) => {
  await User.findOneAndUpdate({_id:req.user._id},{token: ""}).then((user) => {
    return res.status(200).send({
      success:true
    })
  })
  .catch((err) => {
    res.json({success: false,err});
  })
})


app.post('/feedback',async(req,res) => {
  const feedback = new FeedBack(req.body)

  await feedback.save().then(()=>{
    res.status(200).json({success:true})
  }).catch((err)=>{
    res.json({success:false, err})
  })
})

app.post('/jsonSave', async(req,res) => {

  const jsonData = req.body;

  const saveJsonToMongoDB = async (data) => {
    try {
      const client = await MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true });
      const db = client.db(process.env.DB_NAME);
      const collection = db.collection(process.env.COLLECTION_NAME);
      await collection.updateOne({_id :  new ObjectId(process.env.OBJECT_ID)},{ $set: { categoryList: data } });
      console.log('데이터가 MongoDB에 성공적으로 업데이트되었습니다.');
      client.close();
      return res.status(200).json({success: true})
  
      
    } catch (error) {
      console.error('MongoDB 저장 중 오류가 발생했습니다.', error);
      return res.json({success: false})
    }
  };
  saveJsonToMongoDB(jsonData);
  
})

app.get('/getJson',async (req,res) => {
  const getDataFromMongoDB = async () => {
    try {
      const client = await MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true });
      const db = client.db(process.env.DB_NAME);
      const collection = db.collection(process.env.COLLECTION_NAME); // 저장한 컬렉션 이름으로 변경해주세요.
  
      const query = {}; // 조회할 조건이 있을 경우 여기에 추가 가능
      const result = await collection.find(query).toArray();
  
      client.close();
  
      return res.status(200).json(result[0].categoryList)
    } catch (error) {
      console.error('MongoDB 조회 중 오류가 발생했습니다.', error);
      return null;
    }
  };
  
  // MongoDB에서 데이터를 조회합니다.
  getDataFromMongoDB()
})






app.get("/", (req, res) => {
  console.log("hello");
  //express 앱(app)을 넣고, root directory에 오면,
  res.send("Hello World!"); //"Hello World!" 를 출력되게 해준다.
});


app.use('/api/answer', UserAnswer)
app.use('/api/email',Email)
app.use('/api/quizlet', Quizlet)
app.use('/api/Student', Student)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); //포트 5000번에서 이 앱을 실행한다.
