# mdbf-masterclass

MDBF [the Masterclass](https://mdbf.co.kr) 의 아임웹 임베드용 HTML 컴포넌트 라이브러리.

각 컴포넌트는 독립된 페이지로 GitHub Pages에 호스팅되며, 아임웹 본문에 `<iframe>` 으로 삽입한다.

---

## Live URLs

| 컴포넌트 | URL |
|---|---|
| 인덱스 (전체 컴포넌트 갤러리) | https://parcyun.github.io/mdbf-masterclass/ |
| Hero — 교사의 첫 걸음 | https://parcyun.github.io/mdbf-masterclass/hero/ |

---

## 디렉토리 구조

```
mdbf-masterclass/
├── index.html          # 인덱스 갤러리 (모든 컴포넌트 미리보기 + 임베드 코드)
├── hero/
│   └── index.html      # 메인 히어로
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

인덱스 페이지 ( https://parcyun.github.io/mdbf-masterclass/ ) 에서 원하는 컴포넌트의 **임베드 코드** 버튼을 누르면 클립보드에 복사된다. 그대로 아임웹 HTML 블록에 붙여넣기.

기본 형태:

```html
<iframe 
  src="https://parcyun.github.io/mdbf-masterclass/hero/" 
  style="width:100%; height:80vh; border:0; display:block;"
  loading="lazy"
  title="the Masterclass Hero">
</iframe>
```

`height` 는 컴포넌트 성격에 따라 조절 (히어로는 `80vh~100vh`, 카드 섹션은 고정 `600px` 등).

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
