(function () {
  'use strict';

  var PARENT_ORIGIN = 'https://mdbf.co.kr';
  var ENRICH_ENDPOINT = '/api/me';

  var state = {
    auth: null,
    enriched: null,
    listeners: []
  };

  function fireChange() {
    var snapshot = view();
    state.listeners.forEach(function (fn) {
      try { fn(snapshot); } catch (e) {}
    });
  }

  function view() {
    if (!state.auth || !state.auth.isLoggedIn) {
      return { isLoggedIn: false, MEMBER_UID: null, displayName: null, raw: null };
    }
    return {
      isLoggedIn: true,
      MEMBER_UID: state.auth.MEMBER_UID,
      displayName: pickDisplayName(state.auth, state.enriched),
      raw: { auth: state.auth, enriched: state.enriched }
    };
  }

  function pickDisplayName(auth, enriched) {
    if (enriched) {
      if (enriched.name) return enriched.name;
      if (enriched.nickname) return enriched.nickname;
    }
    var uid = auth && auth.MEMBER_UID ? String(auth.MEMBER_UID) : '';
    if (!uid) return null;
    var at = uid.indexOf('@');
    return at > 0 ? uid.slice(0, at) : uid;
  }

  function enrich(uid) {
    if (!uid) return;
    try {
      fetch(ENRICH_ENDPOINT + '?uid=' + encodeURIComponent(uid), { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          if (!data) return;
          state.enriched = data;
          fireChange();
        })
        .catch(function () {});
    } catch (e) {}
  }

  window.imwebAuth = {
    get: function () { return view(); },
    onChange: function (fn) {
      state.listeners.push(fn);
      if (state.auth !== null) {
        try { fn(view()); } catch (e) {}
      }
      return function () {
        state.listeners = state.listeners.filter(function (f) { return f !== fn; });
      };
    },
    requestLogin: function () {
      if (window.parent === window) return;
      window.parent.postMessage({ type: 'mdbf-bridge:open-login' }, PARENT_ORIGIN);
    },
    requestJoin: function () {
      if (window.parent === window) return;
      window.parent.postMessage({ type: 'mdbf-bridge:open-join' }, PARENT_ORIGIN);
    }
  };

  window.addEventListener('message', function (e) {
    if (e.origin !== PARENT_ORIGIN) return;
    var m = e.data;
    if (!m || typeof m !== 'object') return;
    if (m.type === 'mdbf-bridge:auth' || m.type === 'mdbf-bridge:auth-changed') {
      var previousUid = state.auth && state.auth.MEMBER_UID;
      state.auth = m.payload || null;
      var currentUid = state.auth && state.auth.MEMBER_UID;
      if (currentUid && currentUid !== previousUid) {
        state.enriched = null;
        enrich(currentUid);
      } else if (!currentUid) {
        state.enriched = null;
      }
      fireChange();
    }
  });

  if (window.parent !== window) {
    window.parent.postMessage({ type: 'mdbf-bridge:request-auth' }, PARENT_ORIGIN);
  }

  injectUserPillStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountUserPills);
  } else {
    mountUserPills();
  }

  function injectUserPillStyles() {
    if (document.getElementById('imweb-auth-styles')) return;
    var css = '' +
      '.mc-nav-user{display:flex;align-items:center;gap:8px;flex-shrink:0;font-family:Pretendard,-apple-system,BlinkMacSystemFont,sans-serif}' +
      '.mc-nav-user[data-state="hidden"]{display:none}' +
      '.mc-nav-login-btn{background:transparent;border:1px solid rgba(255,255,255,0.18);color:rgba(255,255,255,0.78);padding:6px 14px;border-radius:999px;font-size:12px;letter-spacing:-0.01em;cursor:pointer;font-family:inherit;transition:all .15s}' +
      '.mc-nav-login-btn:hover{border-color:rgba(91,140,255,0.6);color:#fff}' +
      '.mc-nav-user-pill{display:flex;align-items:center;gap:8px;padding:5px 12px 5px 6px;background:rgba(91,140,255,0.10);border:1px solid rgba(91,140,255,0.25);border-radius:999px;font-size:12px;color:#cfd6e6}' +
      '.mc-nav-user-avatar{width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#3364D9,#5B8CFF);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0}' +
      '.mc-nav-user-name{font-weight:500;letter-spacing:-0.01em;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
      '@media (max-width:640px){.mc-nav-user-name{max-width:80px}}';
    var tag = document.createElement('style');
    tag.id = 'imweb-auth-styles';
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  function mountUserPills() {
    var slots = document.querySelectorAll('[data-imweb-user]');
    slots.forEach(function (slot) { renderSlot(slot, view()); });
    window.imwebAuth.onChange(function (v) {
      document.querySelectorAll('[data-imweb-user]').forEach(function (slot) {
        renderSlot(slot, v);
      });
    });
  }

  function renderSlot(slot, v) {
    slot.innerHTML = '';
    if (!v.isLoggedIn) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mc-nav-login-btn';
      btn.textContent = '로그인';
      btn.addEventListener('click', function () { window.imwebAuth.requestLogin(); });
      slot.appendChild(btn);
      slot.setAttribute('data-state', 'logged-out');
      return;
    }
    var pill = document.createElement('div');
    pill.className = 'mc-nav-user-pill';
    var avatar = document.createElement('span');
    avatar.className = 'mc-nav-user-avatar';
    var name = v.displayName || '';
    avatar.textContent = name.charAt(0) || '?';
    var label = document.createElement('span');
    label.className = 'mc-nav-user-name';
    label.textContent = name;
    label.title = name;
    pill.appendChild(avatar);
    pill.appendChild(label);
    slot.appendChild(pill);
    slot.setAttribute('data-state', 'logged-in');
  }
})();
