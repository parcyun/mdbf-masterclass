/*
 * MDBF iframe auto-resize (child side)
 * 부모(아임웹) 페이지로 실제 높이를 postMessage로 전달.
 * 부모는 { type:'mcResize' } 메시지를 받으면 iframe height를 갱신.
 *
 * 사용법: 임베드용 페이지 </body> 직전에
 *   <script src="/assets/iframe-resizer.js"></script>
 * 한 줄만 추가.
 */
(function () {
  if (window.top === window.self) return; // iframe 안이 아니면 작동 X

  var lastH = 0;
  function report() {
    var h = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0
    );
    if (h === lastH) return;
    lastH = h;
    parent.postMessage({ type: 'mcResize', id: 'mdbf', height: h }, '*');
  }

  window.addEventListener('load', report);
  window.addEventListener('resize', report);
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(report).observe(document.documentElement);
  }
  // 첫 페인트 직후도 한 번
  setTimeout(report, 50);
  setTimeout(report, 500);
})();
