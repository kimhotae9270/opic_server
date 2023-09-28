const express = require('express');
const router = express.Router();
require("dotenv").config();
const puppeteer = require('puppeteer');

const { exec } = require('child_process');


router.post('/copy',async (req,res) =>{
    (async () => {
        const browser = await puppeteer.launch({
          // Puppeteer 설정 옵션
          executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
          headless: false, // true로 설정하면 브라우저가 화면에 표시되지 않습니다.
        });
      
        const page = await browser.newPage();
      
        // 웹사이트 방문
        await page.goto('');
      
        const buttonSelector = 'button[aria-label="로그인"]';
  
         // 해당 버튼을 클릭합니다.
        await page.click(buttonSelector);
        
      
        // 브라우저 종료
       
      })();
      res.json({success:true})
} )

module.exports = router;