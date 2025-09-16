# Our Wedding Mate 배포 가이드

## Vercel 배포 방법

### 1. GitHub 저장소 준비
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel 배포
1. [Vercel](https://vercel.com)에 접속하여 GitHub 계정으로 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 설정:

```
DATABASE_URL=your-supabase-database-url
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
```

### 4. Supabase 설정 (프로덕션)
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. PostgreSQL 데이터베이스 URL 복사
3. Prisma 스키마를 PostgreSQL로 변경:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

4. 데이터베이스 마이그레이션:
```bash
npx prisma migrate deploy
```

### 5. 도메인 설정 (선택사항)
- Vercel에서 커스텀 도메인 연결 가능
- SSL 인증서 자동 적용

## 배포 후 확인사항

1. ✅ 홈페이지 접속 확인
2. ✅ 회원가입/로그인 기능 테스트
3. ✅ 모든 페이지 정상 작동 확인
4. ✅ 데이터베이스 연결 확인

## 문제 해결

### 빌드 오류
- Node.js 버전 확인 (18.x 이상 권장)
- 의존성 설치 오류 시 `package-lock.json` 삭제 후 재시도

### 데이터베이스 연결 오류
- Supabase 프로젝트 상태 확인
- 환경 변수 정확성 확인
- Prisma 스키마 provider 확인

### 인증 오류
- JWT_SECRET 설정 확인
- 도메인 URL 정확성 확인
