const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { smtpTransport } = require('../config/Email');



router.post('/sendEmail',async (req,res)=>{
   
   generateRandom = function (min, max) {
   var ranNum = Math.floor(Math.random()*(max-min+1)) + min;
    return ranNum;
  }
  var ranNum = generateRandom(111111,999999)
    const mailOptions = {
        from: 'kimho010212@naver.com',
        to: req.body.email,
        subject: '[OpicScript]이메일 인증을 완료하세요',
        text: '옆의 6자리 숫자를 입력 해 주세요\t'+ranNum
        
    };
    smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json({success: false, error})
        } else {
            res.status(200).json({success: true, ranNum : ranNum})
        }
    });
      

    
})

module.exports = router;