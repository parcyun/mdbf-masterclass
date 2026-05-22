# mdbf-masterclass

MDBF [the Masterclass](https://mdbf.co.kr) 의 아임웹 임베드용 HTML 컴포넌트 라이브러리.

각 컴포넌트는 독립된 페이지로 GitHub Pages에 호스팅되며, 아임웹 본문에 `<iframe>` 으로 삽입한다.

---

## Live URLs

| 컴포넌트 | URL | 임베드 height (px, 추정) |
|---|---|---|
| 인덱스 (전체 컴포넌트 갤러리) | https://parcyun.github.io/mdbf-masterclass/ | — |
| Hero — 교사의 첫 걸음 | https://parcyun.github.io/mdbf-masterclass/hero/ | 900 |
| Intro — 연수 플랫폼 소개 | https://parcyun.github.io/mdbf-masterclass/intro/ | 3600 |
| Classes — 클래스별 강좌 (8 트랙) | https://parcyun.github.io/mdbf-masterclass/classes/ | 1300 |
| Banner — 캐러셀 (4:1) | https://parcyun.github.io/mdbf-masterclass/banner/ | 300 |

> height는 데스크탑 기준 추정값. 모바일에서는 더 길어질 수 있어 아임웹에서 실측해 최종 값으로 고정 권장. 빈 공간은 페이지 배경색이 자연스럽게 채움.

---

## 디렉토리 구조

```
mdbf-masterclass/
├── index.html          # 인덱스 갤러리 (모든 컴포넌트 미리보기 + 임베드 코드)
├── hero/
│   └── index.html      # 메인 히어로 (다크, 풀 viewport)
├── intro/
│   └── index.html      # 연수 플랫폼 소개 (풀 페이지)
├── classes/
│   └── index.html      # 클래스별 강좌 (8 트랙, 라이트 배경)
├── banner/
│   └── index.html      # 4:1 배너 캐러셀 (자동 슬라이드 + nav + dot)
├── assets/             # 공용 자원 (여러 페이지가 공유)
│   ├── css/
│   ├── js/
│   ├── fonts/
│   └── images/
├── README.md
└── .gitignore
```

각 컴포넌트는 `/{name}/index.html` 구조라 URL이 깔끔하게 떨어진다 (`/hero/`).

---

## 새 컴포넌트 추가하는 법

1. 루트에 새 폴더 생성: `mkdir new-section`
2. 그 안에 `index.html` 작성 — 완전 독립 페이지 (CSS/JS 전부 인라인 또는 `../assets/` 참조)
3. 루트 `index.html` 의 `.grid` 안에 카드 하나 추가:
   ```html
   <article class="card">
     <div class="card-preview">
       <iframe src="./new-section/" loading="lazy"></iframe>
       <div class="overlay"></div>
     </div>
     ...
   </article>
   ```
4. 커밋 & 푸시: `git add . && git commit -m "feat: add new-section" && git push`
5. Pages는 1~2분 안에 자동 갱신

---

## 아임웹에 임베드하는 법

인덱스 페이지 ( https://parcyun.github.io/mdbf-masterclass/ ) 의 **임베드 코드** 버튼을 누르면 클립보드에 복사된다. 그대로 아임웹 HTML 블록에 붙여넣기.

기본 형태:

```html
<iframe
  src="https://parcyun.github.io/mdbf-masterclass/hero/"
  style="width:100%; height:900px; border:0; display:block;"
  loading="lazy"
  title="the Masterclass Hero">
</iframe>
```

핵심: **`height` 값은 페이지 전체 높이로 고정**한다. 아임웹에서 임베드한 후, 모바일까지 포함해 잘림이 없는 최대 높이를 한 번만 측정해 그 값으로 고정. 빈 공간은 페이지 배경색이 자연스럽게 채운다.

## 신규 페이지를 만들 때 (규칙)

1. `{name}/index.html` 폴더 + 페이지 작성
2. 데스크탑/모바일 모두 펼친 상태의 전체 높이를 측정 (브라우저 개발자도구 → `document.documentElement.scrollHeight`)
3. 인덱스 갤러리(`/index.html`) 카드의 임베드 코드 `height:` 값에 그 값으로 고정 명시
4. README의 Live URLs 표에도 height 값 기록

---

## 왜 iframe 임베드인가

아임웹에 HTML 코드를 직접 임베드하면 `100vw/100vh` 가 아임웹 컨테이너가 아닌 브라우저 viewport 기준으로 계산되어 레이아웃이 깨지고, 아임웹의 전역 CSS reset과 z-index가 충돌한다.

iframe 은 독립된 브라우징 컨텍스트라 viewport 단위·스타일·스크립트가 모두 격리된다. 수정도 `git push` 한 번이면 즉시 반영된다.

---

## 디자인 시스템

- **컬러**: MDBF Blue `#3364D9`, Brand Light `#5B8CFF`
- **폰트**: Pretendard (본문), Montserrat Light (signature), JetBrains Mono (코드)
- **톤**: Apple Liquid Design (글래스모피즘, 고곡률) + Toss Minimalism

상세 가이드: parcyun studio MDBF 디자인 스킬 참조.

---

Designed by parcyun studio · [@parcyun](https://www.instagram.com/parcyun)
