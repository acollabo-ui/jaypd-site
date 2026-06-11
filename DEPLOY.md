# jaypd.kr 배포 가이드

> 사이트 골격·글 3개·SEO/AEO 완료. 빌드 검증 통과 (7페이지).
> 아래는 승재가 해야 하는 것 + Claude가 이어서 할 수 있는 것.

## 승재가 직접 해야 하는 것 (위임 불가)

1. **jaypd.kr 도메인 구매** — 가비아 등 국내 등록업체 (10분, 연 2만원 안팎)
2. **GitHub 계정으로 빈 저장소 생성** — 예: `jaypd-site` (private 가능)
3. **Cloudflare 계정 생성** (무료)
4. `src/config.ts`의 TODO 링크 4개 채우기: 유튜브 채널 URL, 인스타, 멜론 크레딧, 믹스 구글폼
5. 비포애프터 곡 3개 음원 + 프로필 사진 (오면 /mix와 /about에 반영)

## 배포 순서 (1번 끝나면 Claude와 같이 하면 됨)

1. 이 폴더에서 `git init` → GitHub 저장소에 push
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**
   - Framework preset: **Astro** / Build command: `npm run build` / Output: `dist`
3. 배포 확인 후 **Custom domains**에 jaypd.kr 추가
   → 가비아에서 네임서버를 Cloudflare가 알려주는 2개로 변경
4. Cloudflare **Web Analytics** 활성화 (스크립트 한 줄 → Base.astro에 추가)
5. **네이버 서치어드바이저** 등록 (sitemap: `https://jaypd.kr/sitemap-index.xml`)

## 글 발행 플로우 (운영)

```
Rooms/blog/drafts/   ← 초안 (지금 글 3개가 여기 있음 — 검수해줘)
Rooms/blog/posts/    ← 승재 검수 끝나면 여기로 이동
npm run publish-posts ← 분쟁 키워드 필터 통과분만 src/content/blog/로 복사
git push             ← Cloudflare가 자동 배포
```

- 분쟁 키워드(정원희, 소송, 가처분 등) 검출 시 해당 글은 **발행 차단 + 보고**. 키워드 목록은 `scripts/publish.mjs` 상단.
- 네이버 블로그 재게시: 발행 후 본문 복붙 + 말미 "원문: jaypd.kr/..." (수동, 주 1회)

## 로컬에서 돌려보기

```
npm install
npm run dev      # http://localhost:4321
npm run build    # 배포 전 빌드 확인
```

## 체크 (빌드 검증 완료 항목)

- [x] 4페이지: / /about /blog /mix
- [x] schema.org: Person(/about) · Article(글마다) · FAQPage(/mix)
- [x] sitemap-index.xml · rss.xml · OG 태그 · canonical
- [x] robots.txt — AI 크롤러(GPTBot, ClaudeBot, PerplexityBot 등) 명시 허용
- [x] llms.txt — 프로필 사실 + 글 링크 자동 생성
- [x] 모든 글 하단 고정 푸터 → /mix 전환 동선
- [x] author 표기 통일: "프로듀서 김승재 (Jay)"
- [x] 분쟁 키워드 필터 동작 테스트 통과
