# mdbf-masterclass

MDBF [the Masterclass](https://mdbf.co.kr) 의 아임웹 임베드용 HTML 컴포넌트 라이브러리.

각 컴포넌트는 독립된 페이지로 GitHub Pages에 호스팅되며, 아임웹 본문에 `<iframe>` 으로 삽입한다.

---

## Live URLs

| 컴포넌트 | URL |
|---|---|
| 인덱스 (전체 컴포넌트 갤러리) | https://parcyun.github.io/mdbf-masterclass/ |
| **Home — 메인 통합 페이지** | https://parcyun.github.io/mdbf-masterclass/home/ |
| Hero — 교사의 첫 걸음 | https://parcyun.github.io/mdbf-masterclass/hero/ |
| Intro — 연수 플랫폼 소개 | https://parcyun.github.io/mdbf-masterclass/intro/ |
| Classes — 클래스별 강좌 (8 트랙) | https://parcyun.github.io/mdbf-masterclass/classes/ |
| Banner — 캐러셀 (4:1) | https://parcyun.github.io/mdbf-masterclass/banner/ |

---

## 디렉토리 구조

```
mdbf-masterclass/
├── index.html          # 인덱스 갤러리 (모든 컴포넌트 미리보기 + 임베드 코드)
├── home/
│   └── index.html      # 메인 통합 (hero + 48px + classes + 48px + banner)
├── hero/
│   └── index.html      # 메인 히어로 (단독 임베드용, footer 없음)
├── intro/
│   └── index.html      # 연수 플랫폼 소개 (풀 페이지, footer 있음)
├── classes/
│   └── index.html      # 클래스별 강좌 (8 트랙, 라이트 배경, postMessage로 부모에 높이 알림)
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

### 1단계 — 아임웹 사이트에 listener 스크립트 한 번만 심기

각 iframe이 자기 콘텐츠 높이를 부모(아임웹)에게 `postMessage`로 알린다. 아임웹에서 그 메시지를 받아 iframe height를 자동 조정하려면, 아래 스니펫을 **아임웹 사이트의 맞춤 코드(footer) 영역에 한 번만** 심으면 된다. 이후 어떤 페이지에 어떤 mdbf 임베드를 넣어도 자동 작동.

```html
<script>
(function() {
  window.addEventListener('message', function(e) {
    if (!e.data || e.data.type !== 'mdbf-embed-height') return;
    var h = e.data.height;
    if (!h || h < 50) return;
    var frames = document.querySelectorAll('iframe[src*="parcyun.github.io/mdbf-masterclass"]');
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].contentWindow === e.source) {
        frames[i].style.height = h + 'px';
        frames[i].setAttribute('scrolling', 'no');
      }
    }
  });
})();
</script>
```

> 아임웹 → 사이트 관리 → 사이트 설정 → 맞춤 코드 → footer 영역에 붙여넣기. (페이지마다 매번 심을 필요 없음)

### 2단계 — 원하는 페이지에 iframe 임베드

인덱스 페이지 ( https://parcyun.github.io/mdbf-masterclass/ ) 의 **임베드 코드** 버튼을 누르면 클립보드에 복사된다. 그대로 아임웹 HTML 블록에 붙여넣기.

기본 형태:

```html
<iframe
  src="https://parcyun.github.io/mdbf-masterclass/hero/"
  style="width:100%; height:600px; border:0; display:block;"
  scrolling="no"
  loading="lazy"
  title="the Masterclass Hero">
</iframe>
```

- `height` 는 listener가 자동으로 정확한 값으로 바꿔주니, **초기 깜빡임 방지용 fallback**으로만 의미가 있다 (대략 600~800px 권장).
- `scrolling="no"` 는 iframe 내부 스크롤바 방지.
- listener 스크립트를 안 심었다면 height 가 고정값으로 남아 콘텐츠가 잘리거나 내부 스크롤이 생긴다.

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
