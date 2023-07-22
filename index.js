//index.js
const express = require("express"); //③번 단계에서 다운받았던 express 모듈을 가져온다.
const cors = require("cors");
const { callChatGPT } = require("./chatgpt");
const mongoose = require('mongoose');
const {FeedBack} = require('./models/FeedBack');
const {User} = require('./models/User'); //User 모델을 가져옴

const app = express(); //가져온 express 모듈의 function을 이용해서 새로운 express 앱을 만든다. 🔥
const port = 5000; //포트는 4000번 해도되고, 5000번 해도 된다. -> 이번엔 5000번 포트를 백 서버로 두겠다.

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

mongoose.connect(process.env.MONGO_URI).then(()=> console.log('connect'))
 .catch(err => console.log(err))


app.get("/ask", async function (req, res) {
  res.render("askgpt", {
    pass: true,
  });
});

app.post("/ask", async (req, res) => {
  console.log("hi");
  const prompt = req.body.prompt;
  const response = await callChatGPT(prompt);

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


app.post('/feedback',async(req,res) => {
  const feedback = new FeedBack(req.body)

  await feedback.save().then(()=>{
    res.status(200).json({success:true})
  }).catch((err)=>{
    res.json({success:false, err})
  })
})



app.get("/", (req, res) => {
  console.log("hello");
  //express 앱(app)을 넣고, root directory에 오면,
  res.send("Hello World!"); //"Hello World!" 를 출력되게 해준다.
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); //포트 5000번에서 이 앱을 실행한다.
