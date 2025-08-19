# Space 458 갤러리 홈페이지

## 프로젝트 소개

스페이스458은 2024년 설립된 동시대 예술 플랫폼으로, 예술이 머무는 장소를 넘어서 지속적으로 질문하고 움직이는 살아있는 공간입니다.

이 프로젝트는 스페이스458 갤러리의 공식 홈페이지로, 미니멀하고 세련된 디자인을 통해 갤러리의 철학과 전시 정보를 효과적으로 전달합니다.

프로젝트 기간 : 2025.08.03 ~ 2025.10.01

## 주요 기능

### 🏠 홈페이지
- 자동 슬라이딩 배너
- 최근 전시 정보 섹션
- 인스타그램 피드 연동

### 📖 About
- 갤러리 철학 및 소개
- 갤러리 공간 사진
- 전시공간 도면 다운로드

### 🎨 Exhibitions
- 현재/예정/과거 전시 필터링
- 전시 상세 정보 페이지
- 전시 포스터 및 전경 이미지

### 📰 News & Events
- 공지사항, 보도자료, 이벤트, 워크숍 분류
- 주요 소식 하이라이트
- 날짜별 정렬

### 📞 Contact
- 갤러리 위치 및 운영 정보
- 문의 유형별 이메일 폼
- 네이버 지도 연동

## 기술 스택

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Font**: Inter (Google Fonts)
- **Package Manager**: Yarn

## 디자인 컨셉

- **미니멀리즘**: 깔끔하고 단순한 레이아웃
- **타이포그래피 중심**: 얇은 폰트와 넓은 자간 활용
- **모바일 퍼스트**: 70% 이상의 모바일 사용률 고려
- **예술적 감각**: 작품이 돋보이는 중성적 배경

## 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 빌드
yarn build

# 프로덕션 서버 실행
yarn start

# 린트 검사
yarn lint
```

## 프로젝트 구조

```
app/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Header.tsx      # 네비게이션 헤더
│   ├── Footer.tsx      # 푸터
│   ├── BannerSlider.tsx # 메인 배너 슬라이더
│   ├── RecentExhibitions.tsx # 최근 전시 섹션
│   └── InstagramFeed.tsx # 인스타그램 피드
├── data/               # 데이터 파일
│   ├── banner.ts       # 배너 데이터
│   ├── exhibitions.ts  # 전시 데이터
│   └── news.ts         # 뉴스 데이터
├── about/              # About 페이지
├── exhibitions/        # 전시 페이지
├── news/              # 뉴스 페이지
├── contact/           # 연락처 페이지
├── layout.tsx         # 루트 레이아웃
├── page.tsx           # 홈페이지
└── globals.css        # 글로벌 스타일
```

## 배포

개발 서버가 `http://localhost:3001`에서 실행됩니다.

## 향후 계획

- [ ] 관리자 페이지 추가
- [ ] 실제 이미지 업로드 시스템
- [ ] 다국어 지원 (한국어/영어)
- [ ] 검색 기능
- [ ] 뉴스레터 구독 기능
