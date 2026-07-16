# jaypd.kr 배포 가이드 (2026-07-16 갱신)

> ✅ 운영 중: **https://jaypd.kr** (백업 주소: https://jaypd-site.pages.dev)
> GitHub: https://github.com/acollabo-ui/jaypd-site — **main에 푸시하면 Cloudflare가 자동 배포**
> Cloudflare 계정: a_collabo@panicbutton.co.kr / 프로젝트: jaypd-site
> 네임서버는 가비아 → Cloudflare 이전 완료: `greg.ns.cloudflare.com` / `khloe.ns.cloudflare.com`

## 사이트 구조 (2026-07-16 개편)

**상단 가로 메뉴** 4탭 + 푸터. **홈이 곧 믹스 & 컨설팅 판매 페이지다.**

| 메뉴 | 경로 | 내용 |
| --- | --- | --- |
| 믹스 & 컨설팅 | `/` | 홈. 앨범 그리드, Before/After 플레이어, 가격 3종, 후기 |
| 블로그 | `/posts` | 블로그와 평론을 합친 통합 게시판. 카테고리 필터 |
| 장난감 | `/tools` | HTML 실험물 목록 (아직 비어 있음) |
| 유튜브 | (외부) | 꼰대레코드 |
| — | `/about` | 소개 — 메뉴에 없고 푸터에만 있다 |

- 사업자 정보는 `src/config.ts`의 `BUSINESS`에 모아두고 푸터에 상시 노출한다. **전자상거래법상 필수 표기라 지우면 안 된다.**
- 옛 URL(`/mix`, `/blog/*`, `/review`, `/club`)은 `public/_redirects`에서 301로 넘긴다. 색인이 죽지 않게 유지할 것.
- 사이트 안에서 믹스 페이지를 가리킬 땐 `SITE.links.mix`를 쓴다(= `/`). 경로를 직접 박지 말 것.

## 남은 것 — 승재가 직접 (위임 불가)

1. `src/config.ts`의 TODO 링크 2개: **인스타그램**, **멜론 크레딧** (유튜브·믹스 구글폼은 채워짐)
2. **믹스 페이지 앨범 사진 3장** — `public/images/mix/`에 `10.jpg` `11.jpg` `12.jpg`를 넣으면 자동 표시된다.
   지금은 "20+@ Team / 200+ @ Songs / Updating.." 라벨 타일로 나온다.
3. **netlify 정리** — suengjaesmix.netlify.app은 jaypd.kr 홈으로 이전 완료. netlify 쪽 레포에
   `_redirects` 파일을 만들고 `/*  https://jaypd.kr/  301` 한 줄을 넣어야 옛 주소가 살아난다.
4. **Gmail(suengjaesmusic) 용량 초과 해결** — 2025년 12월부터 수신 중단 상태. 별건이지만 시급.

## 남은 것 — Claude와 같이

1. Cloudflare **Web Analytics** 활성화 (스크립트 한 줄 → Base.astro)
2. **네이버 서치어드바이저** 등록 (sitemap: `https://jaypd.kr/sitemap-index.xml`)

## 글 발행 플로우 (운영)

방법은 두 가지. 둘 다 최종적으로 GitHub main에 올라가야 반영된다.

**① Decap CMS** — https://jaypd.kr/admin 에서 바로 쓰기. GitHub에 직접 커밋된다.

**② 볼트에서 스크립트로 발행**
```
Rooms/blog/drafts/    ← 초안
Rooms/blog/posts/     ← 검수 끝나면 여기로 이동
npm run publish-posts ← 분쟁 키워드 필터 통과분만 src/content/posts/로 복사
git add → commit → push  ← Cloudflare가 자동 배포
```

- 분쟁 키워드(정원희, 소송, 가처분 등) 검출 시 해당 글은 **발행 차단 + 보고**. 목록은 `scripts/publish.mjs` 상단.
- 글 프론트매터에 `category`가 없으면 `믹싱지식`으로 들어간다. 카테고리는 `src/content.config.ts`의 `CATEGORIES`에서 늘린다.
- 네이버 블로그 재게시: 발행 후 본문 복붙 + 말미 "원문: jaypd.kr/..." (수동, 주 1회)

## ⚠️ 로컬 폴더는 반드시 git 클론으로 쓸 것

Decap CMS로 쓴 글은 **GitHub에만** 저장된다. git 클론이 아닌 폴더에서 작업하면
그 글들을 못 받아오고, 그 상태로 덮어쓰면 **글이 통째로 사라진다.**
(2026-07-16 개편 때 실제로 글 2편·구글 인증 파일·배경 디자인이 날아갈 뻔했다.)

작업 전에는 항상:
```
git pull            # 먼저 최신본을 받고 시작
npm install
npm run dev         # http://localhost:4321
npm run build       # 배포 전 빌드 확인
```

## 체크 (2026-07-16 빌드·실서버 검증 완료)

- [x] 11페이지 빌드 · 콘솔 에러 0
- [x] schema.org: Person(/about) · Article(글마다) · ProfessionalService(/mix, 가격 3종)
- [x] sitemap-index.xml · rss.xml · OG 태그 · canonical
- [x] robots.txt — AI 크롤러(GPTBot, ClaudeBot, PerplexityBot 등) 명시 허용
- [x] llms.txt — 프로필 사실 + 글 링크 자동 생성
- [x] 모든 글 하단 → /mix 전환 동선
- [x] author 표기 통일: "프로듀서 김승재 (Jay)"
- [x] 분쟁 키워드 필터 동작 테스트 통과
- [x] 옛 URL 301 리다이렉트 실서버 확인 (/blog/* /review /club)
- [x] Before/After 플레이어 실서버 동작 확인
