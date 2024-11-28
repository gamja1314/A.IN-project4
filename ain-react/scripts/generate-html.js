const fs = require('fs');
const path = require('path');
require('dotenv').config();

// template 파일 읽기
const templatePath = path.join(__dirname, '../public/index.html.template');
const outputPath = path.join(__dirname, '../public/index.html');

let content = fs.readFileSync(templatePath, 'utf8');

// 환경 변수 치환
content = content.replace('%REACT_APP_NAVER_CLIENT_ID%', process.env.REACT_APP_NAVER_CLIENT_ID);

// 결과 파일 저장
fs.writeFileSync(outputPath, content);