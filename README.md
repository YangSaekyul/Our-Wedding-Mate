# Our Wedding Mate

예비 신혼부부를 위한 100% 프라이빗 협업 플래닝 툴

## 프로젝트 개요

Our Wedding Mate는 예비 신혼부부가 결혼 준비 과정을 효율적으로 관리할 수 있도록 도와주는 웹 기반 플래너입니다. 불필요한 커뮤니티 기능을 배제하고, 오직 두 사람의 결혼 준비 과정에만 집중할 수 있는 프라이빗한 환경을 제공합니다.

## 주요 기능

- **메인 대시보드**: 듀얼 D-DAY, 예산 요약, 최근 할 일, 파트너 활동 피드
- **공유 체크리스트 & 스케줄러**: 날짜 지정이 가능한 To-Do 리스트
- **업체 관리**: 업체 정보 및 장/단점 기록, 후보군 비교 기능
- **간편 예산 관리**: 항목별 예산 설정 및 지출 기록
- **위시리스트**: 쿠팡 파트너스 연동을 통한 수익화 기반 마련
- **사용자 인증**: 커플 단위의 계정 시스템

## 기술 스택

- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand
- **데이터베이스**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **인증**: JWT + bcrypt
- **배포**: Vercel

## 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/YangSaekyul/Our-Wedding-Mate.git
cd Our-Wedding-Mate
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`env.example` 파일을 참고하여 `.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요.

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/our_wedding_mate"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

### 4. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npm run db:generate

# 데이터베이스 마이그레이션
npm run db:push
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (main)/            # 메인 서비스 페이지
│   ├── api/               # API 라우트
│   └── globals.css        # 전역 스타일
├── components/            # 재사용 가능한 컴포넌트
│   └── common/           # 공통 컴포넌트
├── lib/                  # 유틸리티 및 설정
│   ├── auth.ts          # 인증 관련 함수
│   ├── middleware.ts    # 미들웨어
│   ├── prisma.ts        # Prisma 클라이언트
│   └── store.ts         # Zustand 스토어
└── types/               # TypeScript 타입 정의
```

## API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인

### 대시보드
- `GET /api/dashboard` - 대시보드 데이터 조회

### 할 일 관리
- `GET /api/todos` - 할 일 목록 조회
- `POST /api/todos` - 할 일 추가
- `PATCH /api/todos/[id]` - 할 일 수정
- `DELETE /api/todos/[id]` - 할 일 삭제

## 배포

### Vercel 배포

1. GitHub 저장소를 Vercel에 연결
2. 환경 변수 설정
3. 자동 배포 완료

### 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

- `DATABASE_URL`: Supabase 데이터베이스 연결 문자열
- `JWT_SECRET`: JWT 토큰 서명용 시크릿 키
- `NEXTAUTH_URL`: 프로덕션 도메인
- `NEXTAUTH_SECRET`: NextAuth 시크릿

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 ISC 라이선스 하에 배포됩니다.

## 연락처

제휴 및 문의: contact@ourweddingmate.com

---

© 2025 Our Wedding Mate. All rights reserved.
