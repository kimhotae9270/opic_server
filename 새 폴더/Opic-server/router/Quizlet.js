const express = require('express');
const router = express.Router();
require("dotenv").config();
const puppeteer = require('puppeteer');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Capabilities, Browser } = require('selenium-webdriver/lib/capabilities');

const { exec } = require('child_process');


router.post('/copy',async (req,res) =>{
  
  
  // Chrome 브라우저 옵션 설정
  const capabilities = Capabilities.chrome();
  const options = new chrome.Options();
  //options.addArguments('--headless'); // 브라우저를 숨김모드(headless)로 실행하려면 주석 제거
  options.addArguments('--no-sandbox')
  options.addArguments('--disable-dev-shm-usage')
  options.addArguments('--ignore-certificate-errors')
  options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36")
  options.addArguments("app-version=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36")
  
  
  // 웹 드라이버 생성 (Chrome 사용)
  const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  // 웹사이트에 접속
  (async () => {
    try {
      await driver.get('https://quizlet.com/ko'); // 접속하고자 하는 웹사이트 URL로 변경
  
      // 웹 페이지가 로드될 때까지 대기 (예: 페이지의 title이 특정 문자열을 포함할 때까지)
      //await driver.wait(until.titleContains('Example'), 10000); // 10초 타임아웃 설정
  
      // 웹 페이지의 내용을 출력 (예: 페이지 소스)
      //const pageSource = await driver.getPageSource();
      //console.log(pageSource);
  
      // 브라우저 종료
      await driver.quit();
      res.json({success:true})
    } catch (error) {
      console.error('에러 발생:', error);
      res.json({success:false})
    }
  })();
  
} )

module.exports = router;