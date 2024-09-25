# 풋살 온라인 프로젝트

## 필수 기능
- [ ] 회원가입 
- [ ] 로그인 
- [ ] 캐시 구매 
- [ ] 선수 뽑기 
- [ ] 선발 선수 목록 조회 
- [ ] 보유 선수 목록 조회 
- [ ] 팀 선발 추가 
- [ ] 팀 선발 제거 
- [ ] 경기하기 (팀지정) 
- [ ] 선수 상세 조회 
 
## 도전 기능
- [ ] 랭킹 조회

## 프로젝트 구조 
```
📁 ROOT
├── README.md
├── babel.config.json
├── 📁 config
│   ├── ecosystem.config.cjs
│   └── winston.config.js
├── 📁 logs
│   ├── 2024-09-22.exception.log
│   ├── 2024-09-22.log
│   └── error
│       ├── 2024-09-22.error.log
├── package-lock.json
├── package.json
├── 📁 prisma
│   └── schema.prisma
├── 📁 src
│   ├── app.js
│   ├── 📁 controllers
│   │   ├── games.controller.js
│   │   ├── schedule.controller.js
│   │   ├── stores.controller.js
│   │   ├── teams.controller.js
│   │   └── users.controller.js
│   ├── 📁 errors
│   │   └── status.error.js
│   ├── 📁 middlewares
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── 📁 routes
│   │   ├── games.router.js
│   │   ├── stores.router.js
│   │   ├── teams.router.js
│   │   └── users.router.js
│   ├── 📁 services
│   │   ├── games.service.js
│   │   ├── schedule.service.js
│   │   ├── stores.service.js
│   │   ├── teams.service.js
│   │   └── users.service.js
│   └── 📁 utils
│       ├── authUtils.js
│       ├── dateUtils.js
│       ├── mathUtils.js
│       └── prisma
│           └── index.js
└── 📁 test
    ├── index.js
    └── index.spec.js
```
