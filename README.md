# 🧩 opic_server — Backend for “opicscipt” (Node.js + MongoDB)

**opicscipt**(영어 OPIC 대비용 스크립트/학습 서비스)의 백엔드 서버입니다.  
로그인/권한, **학생 관리**, **질문 관리**, **리뷰(피드백)** 등 핵심 도메인을 제공하며, 데이터는 **MongoDB**에 저장됩니다.

---

## 🚀 Features
- **Auth**: 이메일/비밀번호 로그인, 비밀번호 해싱(bcrypt)
- **학생 관리**: 학생 프로필/진도/메모 CRUD
- **질문 관리**: 질문 카테고리, 난이도, 예시답안/키워드 관리
- **리뷰/피드백**: 강사/관리자가 남긴 리뷰 열람/정렬/필터
- **관리자 기능**: 사용자 역할(학생/강사/관리자)별 접근 제어

---

## 🛠 Tech Stack
- **Runtime**: Node.js (Express)
- **DB**: MongoDB (+ Mongoose)
- **Auth**: 쿠키 기반 토큰 인증(서버 저장·검증), bcrypt

---

## 📂 Typical Structure
