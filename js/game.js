window.__WONDA_EMBED = {"wonda-eng-bridge-correct-1": "audio/audio_000.mp3", "wonda-eng-bridge-correct-2": "audio/audio_001.mp3", "wonda-eng-bridge-correct-3": "audio/audio_002.mp3", "wonda-eng-bridge-done": "audio/audio_003.mp3", "wonda-eng-bridge-intro": "audio/audio_004.mp3", "wonda-eng-bridge-silly-1": "audio/audio_005.mp3", "wonda-eng-bridge-silly-2": "audio/audio_006.mp3", "wonda-eng-bridge-silly-3": "audio/audio_007.mp3", "wonda-eng-build-bridge": "audio/audio_008.mp3", "wonda-eng-build-robot": "audio/audio_009.mp3", "wonda-eng-build-vehicle": "audio/audio_010.mp3", "wonda-eng-bye": "audio/audio_011.mp3", "wonda-eng-cog": "audio/audio_012.mp3", "wonda-eng-complete": "audio/audio_013.mp3", "wonda-eng-correct-1": "audio/audio_014.mp3", "wonda-eng-correct-2": "audio/audio_015.mp3", "wonda-eng-correct-3": "audio/audio_016.mp3", "wonda-eng-design-rockets": "audio/audio_017.mp3", "wonda-eng-finished-yesorno": "audio/audio_018.mp3", "wonda-eng-mission-start": "audio/audio_019.mp3", "wonda-eng-oops": "audio/audio_020.mp3", "wonda-eng-quiz-1": "audio/audio_021.mp3", "wonda-eng-quiz-2": "audio/audio_022.mp3", "wonda-eng-quiz-3": "audio/audio_023.mp3", "wonda-eng-section3-intro": "audio/audio_024.mp3", "wonda-eng-section4-intro": "audio/audio_025.mp3", "wonda-eng-section5-intro": "audio/audio_026.mp3", "wonda-eng-section7-intro": "audio/audio_027.mp3", "wonda-eng-skill-clever": "audio/audio_028.mp3", "wonda-eng-skill-creative": "audio/audio_029.mp3", "wonda-eng-skill-patience": "audio/audio_030.mp3", "wonda-eng-skill-problemsolvers": "audio/audio_031.mp3", "wonda-eng-skill-thinking": "audio/audio_032.mp3", "wonda-eng-skills-assess": "audio/audio_033.mp3", "wonda-eng-story-astronaut": "audio/audio_034.mp3", "wonda-eng-story-bridge": "audio/audio_035.mp3", "wonda-eng-story-robot": "audio/audio_036.mp3", "wonda-eng-what-is-1": "audio/audio_037.mp3", "wonda-eng-what-is-2": "audio/audio_038.mp3", "wonda-stem-yesorno": "audio/audio_039.mp3"};


// === next block ===


(function () {
  'use strict';

  // ===================================================================
  // CHILD IDENTITY — per Finneen's integration spec
  // (ENGINEER-SHAREABLE-INTEGRATION.md §3).
  //
  // On first load mint localStorage.wonderleap_child_id (per-browser, NOT
  // per-person). The host platform can overwrite this BEFORE the iframe
  // loads — e.g. set it from the parent React app via a child-frame URL
  // query param or a same-origin localStorage write — to attach this
  // child's events/reports to a stable account-scoped identity.
  // All backend records key off child_id.
  // ===================================================================
  try {
    if (!localStorage.getItem('wonderleap_child_id')) {
      const cid = 'child-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('wonderleap_child_id', cid);
    }
  } catch (e) { /* private mode etc — silent */ }

  // ===================================================================
  // PHASE 1 TRACKING — local-only event log in browser localStorage.
  // Same key as Health zone so the teacher dashboard sees all zones.
  // ===================================================================
  const Track = (function () {
    const KEY = 'wlhch_events';
    const SESS_KEY = 'wlhch_session';
    const MAX = 500;
    const IDLE_MS = 30 * 60 * 1000;
    function sessionId() {
      try {
        const raw = localStorage.getItem(SESS_KEY);
        const now = Date.now();
        if (raw) {
          const s = JSON.parse(raw);
          if (now - s.last < IDLE_MS) {
            s.last = now; localStorage.setItem(SESS_KEY, JSON.stringify(s));
            return s.id;
          }
        }
        const id = 's' + now.toString(36) + Math.random().toString(36).slice(2, 6);
        localStorage.setItem(SESS_KEY, JSON.stringify({ id, start: now, last: now }));
        return id;
      } catch (e) { return 'no-storage'; }
    }
    function event(type, data) {
      try {
        const evts = JSON.parse(localStorage.getItem(KEY) || '[]');
        evts.push({ ts: Date.now(), session: sessionId(), page: 'engineer', type, data: data || null });
        while (evts.length > MAX) evts.shift();
        localStorage.setItem(KEY, JSON.stringify(evts));
      } catch (e) {}
    }
    return { event };
  })();

  // ===================================================================
  // Iframe-fresh-start: if loaded inside the WonderLeap parent app with
  // a new HMAC sessionId, clear any local events from a previous play
  // (different student / previous attempt on the same browser). The
  // HMAC sessionId is the authoritative "this is a new attempt" signal.
  // ===================================================================
  try {
    const hmacSid = new URLSearchParams(window.location.search).get('sessionId');
    if (hmacSid) {
      const lastSid = localStorage.getItem('wlhch_last_hmac_sid');
      if (lastSid !== hmacSid) {
        localStorage.removeItem('wlhch_events');
        localStorage.removeItem('wlhch_session');
        localStorage.setItem('wlhch_last_hmac_sid', hmacSid);
      }
    }
  } catch (e) {}

  Track.event('mission_open', { mission: 'engineer' });

  // ===================================================================
  // SILENT MODE
  // ===================================================================
  const SILENT_MODE = false;

  // ===================================================================
  // WONDA mascot SVG
  // ===================================================================
  function wondaSVG() {
    return `
      <svg viewBox="0 0 220 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g class="wonda-cape">
          <path d="M 36 102 Q 18 160 38 210 L 110 200 L 182 210 Q 202 160 184 102 Z"
                fill="#7C3AED" stroke="#1A2530" stroke-width="4" stroke-linejoin="round"/>
          <path d="M 60 110 Q 50 170 70 200 L 110 196 L 150 200 Q 170 170 160 110 Z"
                fill="#A78BFA" opacity=".55"/>
          <animateTransform attributeName="transform" type="rotate"
                            values="0 110 100;-1.8 110 100;0 110 100;1.8 110 100;0 110 100"
                            dur="3.4s" repeatCount="indefinite"/>
        </g>
        <path d="M 110 20 Q 130 28 142 66 Q 170 72 196 82 Q 192 110 162 127 Q 178 162 163 183 Q 140 178 110 165 Q 80 178 57 183 Q 42 162 58 127 Q 28 110 24 82 Q 50 72 78 66 Q 90 28 110 20 Z"
              fill="#FFD93D" stroke="#1A2530" stroke-width="5" stroke-linejoin="round"/>
        <path d="M 72 82 Q 86 76 100 84" stroke="#1A2530" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M 120 84 Q 134 76 148 82" stroke="#1A2530" stroke-width="4" fill="none" stroke-linecap="round"/>
        <g class="wonda-eye" transform="translate(86 106)">
          <ellipse cx="0" cy="0" rx="14" ry="17" fill="#FFFFFF" stroke="#1A2530" stroke-width="3"/>
          <circle cx="2" cy="4" r="8" fill="#1A2530"/>
          <circle cx="6" cy="0" r="3" fill="#FFFFFF"/>
          <circle cx="-6" cy="-6" r="1.6" fill="#FFFFFF"/>
          <animateTransform attributeName="transform" type="scale"
                            values="1 1;1 1;1 0.08;1 1;1 1;1 1;1 0.08;1 1;1 1"
                            keyTimes="0;0.38;0.41;0.44;0.7;0.93;0.95;0.98;1"
                            dur="5s" repeatCount="indefinite" additive="sum"/>
        </g>
        <g class="wonda-eye" transform="translate(134 106)">
          <ellipse cx="0" cy="0" rx="14" ry="17" fill="#FFFFFF" stroke="#1A2530" stroke-width="3"/>
          <circle cx="2" cy="4" r="8" fill="#1A2530"/>
          <circle cx="6" cy="0" r="3" fill="#FFFFFF"/>
          <circle cx="-6" cy="-6" r="1.6" fill="#FFFFFF"/>
          <animateTransform attributeName="transform" type="scale"
                            values="1 1;1 1;1 0.08;1 1;1 1;1 1;1 0.08;1 1;1 1"
                            keyTimes="0;0.38;0.41;0.44;0.7;0.93;0.95;0.98;1"
                            dur="5s" repeatCount="indefinite" additive="sum"/>
        </g>
        <circle cx="66" cy="128" r="8" fill="#F8A5C2" opacity=".7"/>
        <circle cx="154" cy="128" r="8" fill="#F8A5C2" opacity=".7"/>
        <g class="wonda-mouth">
          <g class="mouth-closed">
            <path d="M 80 138 Q 110 168 140 138 Q 134 152 110 154 Q 86 152 80 138 Z"
                  fill="#FFFFFF" stroke="#1A2530" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M 96 148 Q 110 158 124 148 L 122 152 L 98 152 Z" fill="#FF6B9E"/>
          </g>
          <g class="mouth-open" opacity="0">
            <ellipse cx="110" cy="148" rx="14" ry="11" fill="#FFFFFF" stroke="#1A2530" stroke-width="3.5"/>
            <ellipse cx="110" cy="150" rx="9" ry="6" fill="#FF6B9E"/>
          </g>
        </g>
        <g class="wonda-heart" transform="translate(110 196)">
          <path d="M 0 -4 C -10 -22 -34 -22 -34 -2 C -34 14 -12 28 0 38 C 12 28 34 14 34 -2 C 34 -22 10 -22 0 -4 Z"
                fill="#FF6B6B" stroke="#1A2530" stroke-width="3.5" stroke-linejoin="round"/>
          <rect x="-10" y="-2" width="20" height="6" fill="#FFFFFF" rx="1"/>
          <rect x="-3" y="-9" width="6" height="20" fill="#FFFFFF" rx="1"/>
          <animateTransform attributeName="transform" type="scale"
                            values="1;1.12;1;1.06;1"
                            dur="1.4s" repeatCount="indefinite" additive="sum"/>
        </g>
      </svg>
    `;
  }
  document.getElementById('wonda-svg-wrap').innerHTML = wondaSVG();

  // ===================================================================
  // Engineer mission WONDA voiceover clips (preloaded on boot).
  // All 40 clips are bundled and mapped via window.__WONDA_EMBED above.
  // If a clip ever fails to load it falls back to SILENT bubble-text
  // display — NEVER to browser TTS (per client requirement).
  // ===================================================================
  const AUDIO_PATH = 'audio/wonda/';
  const WONDA_MP3S = [
    'wonda-eng-mission-start',
    // Section 2 "what is an engineer" — split into 2 chained clips
    // so each Maria recording is ~20s instead of one ~40s file.
    'wonda-eng-what-is-1','wonda-eng-what-is-2',
    'wonda-eng-section3-intro','wonda-eng-section4-intro','wonda-eng-section5-intro',
    'wonda-eng-bridge-intro','wonda-eng-section7-intro','wonda-eng-complete',
    'wonda-eng-build-bridge','wonda-eng-design-rockets','wonda-eng-build-vehicle','wonda-eng-build-robot',
    'wonda-eng-story-bridge','wonda-eng-story-astronaut','wonda-eng-story-robot',
    'wonda-eng-skill-thinking','wonda-eng-skill-clever','wonda-eng-skill-patience',
    'wonda-eng-skill-creative','wonda-eng-skill-problemsolvers',
    'wonda-eng-skills-assess',    // Section 5b — "Now tap the skills YOU used today!"
    'wonda-eng-bridge-correct-1','wonda-eng-bridge-correct-2','wonda-eng-bridge-correct-3',
    'wonda-eng-bridge-silly-1','wonda-eng-bridge-silly-2','wonda-eng-bridge-silly-3',
    'wonda-eng-bridge-done',
    'wonda-eng-quiz-1','wonda-eng-quiz-2','wonda-eng-quiz-3',
    'wonda-eng-correct-1','wonda-eng-correct-2','wonda-eng-correct-3',
    'wonda-eng-oops',
    'wonda-eng-cog',
    'wonda-eng-bye',
    'wonda-stem-yesorno',         // BEFORE popup — "do you know what an engineer is?"
    'wonda-eng-finished-yesorno'  // AFTER popup — "now we're finished — do you know what an engineer is?"
  ];

  // ===================================================================
  // WONDA module — audio-only (NO TTS, per WonderLeap client requirement).
  // If an mp3 fails to load or play, the speech bubble still shows the
  // text and chained onend callbacks still fire after a reading delay,
  // so the mission never stalls. Browser TTS is never invoked.
  // ===================================================================
  const WONDA = (function () {
    let muted = false;
    let lastAction = null;
    let currentAudio = null;
    const audioCache = {};

    function preload(names, onProgress) {
      if (SILENT_MODE) {
        if (typeof onProgress === 'function') onProgress(names.length, names.length, '(silent)', true);
        return Promise.resolve(audioCache);
      }
      return new Promise((resolve) => {
        const total = names.length;
        let loaded = 0;
        if (!total) { resolve(audioCache); return; }
        names.forEach(name => {
          const audio = new Audio();
          audio.preload = 'auto';
          let done = false;
          const finish = (ok) => {
            if (done) return;
            done = true;
            if (ok) audioCache[name] = audio;
            loaded++;
            if (typeof onProgress === 'function') onProgress(loaded, total, name, ok);
            if (loaded === total) resolve(audioCache);
          };
          audio.addEventListener('canplaythrough', () => finish(true), { once: true });
          audio.addEventListener('loadeddata',     () => finish(true), { once: true });
          audio.addEventListener('error',          () => finish(false), { once: true });
          setTimeout(() => finish(audio.readyState >= 2), 8000);
          audio.src = (window.__WONDA_EMBED[name]||(AUDIO_PATH + name + '.mp3'));
          audio.load();
        });
      });
    }

    // Silent text display — shows the bubble and fires onend after an
    // estimated reading duration. Used when an mp3 is missing or fails.
    // This REPLACES the old TTS fallback path.
    function silentSay(text, opts) {
      opts = opts || {};
      const bubble = document.getElementById('wonda-bubble');
      if (bubble && text) {
        bubble.textContent = String(text);
        bubble.classList.add('show');
      }
      if (typeof opts.onend === 'function') {
        const t = String(text || '');
        setTimeout(opts.onend, Math.min(4500, 800 + t.length * 45));
      }
    }

    function play(filename, opts) {
      opts = opts || {};
      lastAction = { kind: 'mp3', name: filename, opts: opts };
      const bubble = document.getElementById('wonda-bubble');
      if (bubble && (opts.bubbleText || opts.fallbackText)) {
        bubble.textContent = opts.bubbleText || opts.fallbackText;
        bubble.classList.add('show');
      }
      if (SILENT_MODE || muted) {
        if (typeof opts.onend === 'function') {
          const txt = opts.bubbleText || opts.fallbackText || '';
          setTimeout(opts.onend, Math.min(2500, 600 + txt.length * 40));
        }
        return;
      }
      const audio = audioCache[filename];
      const wrap = document.getElementById('wonda-svg-wrap');
      if (!audio) {
        // Audio not loaded — silent text, no TTS
        silentSay(opts.fallbackText || opts.bubbleText, opts);
        return;
      }
      if (currentAudio && currentAudio !== audio) {
        try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (e) {}
      }
      try { audio.currentTime = 0; } catch (e) {}
      audio.muted = false; currentAudio = audio;
      if (wrap) wrap.classList.add('talking');
      const cleanup = () => {
        if (wrap) wrap.classList.remove('talking');
        if (currentAudio === audio) currentAudio = null;
      };
      audio.onended = () => {
        cleanup();
        if (typeof opts.onend === 'function') opts.onend();
      };
      audio.onerror = () => {
        cleanup();
        // Audio failed mid-play — silent text, no TTS
        console.warn('Audio play error:', filename);
        silentSay(opts.fallbackText || opts.bubbleText, opts);
      };
      const p = audio.play();
      if (p && p.catch) {
        p.catch((err) => {
          cleanup();
          // Autoplay blocked or play failed — silent text, no TTS
          console.warn('Audio play blocked:', filename, err && err.message);
          silentSay(opts.fallbackText || opts.bubbleText, opts);
        });
      }
    }

    function playRandom(names, opts) {
      opts = opts || {};
      const i = Math.floor(Math.random() * names.length);
      const merged = Object.assign({}, opts);
      if (Array.isArray(opts.texts) && opts.texts[i]) {
        merged.bubbleText = opts.texts[i];
        merged.fallbackText = opts.texts[i];
      }
      delete merged.texts;
      play(names[i], merged);
    }

    // Text-only narration (used for sections that have no mp3 clip).
    // Shows bubble, fires onend after reading delay. No TTS.
    function say(text, opts) {
      lastAction = { kind: 'text', text: String(text), opts: opts || {} };
      silentSay(text, opts);
    }

    function replay() {
      if (!lastAction) return;
      if (lastAction.kind === 'mp3') play(lastAction.name, lastAction.opts);
      else                            silentSay(lastAction.text, lastAction.opts);
    }

    function setMuted(m) {
      muted = !!m;
      if (muted) {
        if (currentAudio) { try { currentAudio.pause(); } catch (e) {} }
        const wrap = document.getElementById('wonda-svg-wrap');
        if (wrap) wrap.classList.remove('talking');
      }
    }

    // Hard-stop currently-playing audio. Used when the child taps through
    // a popup so prompt audio doesn't bleed into the next clip.
    function stop() {
      if (currentAudio) {
        try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (e) {}
        currentAudio = null;
      }
      const wrap = document.getElementById('wonda-svg-wrap');
      if (wrap) wrap.classList.remove('talking');
    }

    function init() { /* no-op — kept for backward-compat */ }

    return {
      init, preload, play, playRandom, say, replay, setMuted, stop,
      get muted() { return muted; },
      get supported() { return false; }  // TTS removed; never supported
    };
  })();

  // ===================================================================
  // Loader + preload
  // ===================================================================
  const loaderMascot = document.getElementById('wonda-loader-mascot');
  if (loaderMascot) loaderMascot.innerHTML = wondaSVG();
  const loaderFill  = document.getElementById('wonda-loader-fill');
  const loaderCount = document.getElementById('wonda-loader-count');
  let loaderHidden = false;
  function hideLoader() {
    if (loaderHidden) return;
    loaderHidden = true;
    const loader = document.getElementById('wonda-loader');
    if (loader) {
      loader.classList.add('hide');
      setTimeout(() => { loader.style.display = 'none'; }, 600);
    }
    // The confidence popup is the very first thing the child sees —
    // shown as soon as the loader fades, no need to tap the page first.
    setTimeout(() => { if (typeof bootMission === 'function') bootMission(); }, 500);
  }
  if (SILENT_MODE) {
    hideLoader();
  } else {
    WONDA.preload(WONDA_MP3S, (loaded, total, name, ok) => {
      if (loaderFill)  loaderFill.style.width = (loaded / total * 100) + '%';
      if (loaderCount) loaderCount.textContent = loaded + ' / ' + total;
    }).then(() => setTimeout(hideLoader, 350));
    setTimeout(hideLoader, 12000);
  }

  // ===================================================================
  // Web Audio — gentle SFX
  // ===================================================================
  const audio = { ctx: null };
  function ensureCtx() {
    if (SILENT_MODE) return;
    if (!audio.ctx && (window.AudioContext || window.webkitAudioContext)) {
      audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume();
  }
  function noteAt(t, freq, dur, vol, type) {
    if (!audio.ctx) return;
    const osc = audio.ctx.createOscillator();
    osc.type = type || 'sine'; osc.frequency.value = freq;
    const g = audio.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(audio.ctx.destination);
    osc.start(t); osc.stop(t + dur);
  }
  function fxClick()   { ensureCtx(); if (!audio.ctx) return; noteAt(audio.ctx.currentTime, 700, 0.05, 0.06, 'sine'); }
  function fxDing()    { ensureCtx(); if (!audio.ctx) return;
    const t = audio.ctx.currentTime;
    [880, 1175, 1568].forEach((f, i) => noteAt(t + i * 0.06, f, 0.18, 0.10));
  }
  function fxChime()   { ensureCtx(); if (!audio.ctx) return;
    const t = audio.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => noteAt(t + i * 0.08, f, 0.22, 0.11));
  }
  function fxOops()    { ensureCtx(); if (!audio.ctx) return;
    const t = audio.ctx.currentTime;
    noteAt(t, 440, 0.18, 0.10, 'sine');
    noteAt(t + 0.16, 370, 0.20, 0.10, 'sine');
  }
  function fxGiggle()  { ensureCtx(); if (!audio.ctx) return;
    const t = audio.ctx.currentTime;
    [880, 1100, 880, 1100, 880].forEach((f, i) => noteAt(t + i * 0.08, f, 0.07, 0.08, 'triangle'));
  }
  function fxWhirr()   { ensureCtx(); if (!audio.ctx) return;
    const t = audio.ctx.currentTime;
    const osc = audio.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.linearRampToValueAtTime(260, t + 0.4);
    osc.frequency.linearRampToValueAtTime(120, t + 0.8);
    const lp = audio.ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 600;
    const g = audio.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.06);
    g.gain.linearRampToValueAtTime(0.07, t + 0.7);
    g.gain.linearRampToValueAtTime(0, t + 0.85);
    osc.connect(lp); lp.connect(g); g.connect(audio.ctx.destination);
    osc.start(t); osc.stop(t + 0.9);
  }
  function fxHorn()    { ensureCtx(); if (!audio.ctx) return;
    const t = audio.ctx.currentTime;
    [330, 330, 440].forEach((f, i) => noteAt(t + i * 0.18, f, 0.18, 0.13, 'square'));
  }
  function fxConfetti() { ensureCtx(); if (!audio.ctx) return;
    const t = audio.ctx.currentTime;
    [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => noteAt(t + i * 0.05, f, 0.18, 0.10));
  }

  // ===================================================================
  // Section navigation
  // ===================================================================
  let currentSection = 1;
  const SECTION_LINES = {
    1: "Welcome, little Engineer! Today we are going to meet… an engineer! Are you ready? Tap the big orange button to start!",
    2: "An engineer is someone who uses science, math, and creative thinking to solve problems and build things that help people. Engineers design and create all sorts of useful stuff — like bridges, robots, video games, rockets, and roller coasters. They ask questions like \"How does this work?\" and \"How can we make it better?\" Then they come up with clever ideas, test them out, and keep improving until their inventions work just right.",
    3: "Engineers build all sorts of amazing things! Tap each picture to hear about it.",
    4: "Now let's hear some stories about how engineers help! Tap a story to hear it.",
    5: "Engineers have lots of special skills. Tap each shiny badge to hear about it!",
    6: "Uh oh! There's a big river and no bridge! Can you help me build one? Drag the right pieces across!",
    7: "Engineer quiz time! Listen carefully, then tap the picture you think is right!",
    8: "Hooray! You finished the Engineer Mission! You are a true Future Tech Engineer!"
  };
  // Section 2 "what is an engineer" — split into 2 chained clips so
  // each Maria recording stays around 20s. Bubble shows the current
  // part as its audio plays.
  const ENG_WHAT_IS_PARTS = [
    "An engineer is someone who uses science, math, and creative thinking to solve problems and build things that help people. Engineers design and create all sorts of useful stuff — like bridges, robots, video games, rockets, and roller coasters.",
    "They ask questions like \"How does this work?\" and \"How can we make it better?\" Then they come up with clever ideas, test them out, and keep improving until their inventions work just right."
  ];
  function playWhatIs(idx) {
    idx = idx || 0;
    if (idx >= ENG_WHAT_IS_PARTS.length) return;
    WONDA.play('wonda-eng-what-is-' + (idx + 1), {
      bubbleText:   ENG_WHAT_IS_PARTS[idx],
      fallbackText: ENG_WHAT_IS_PARTS[idx],
      onend: () => playWhatIs(idx + 1)
    });
  }

  // Section 2 is played via playWhatIs() (two chained clips) — not via
  // SECTION_AUDIO, so leave it out of this map.
  const SECTION_AUDIO = {
    1: 'wonda-eng-mission-start',
    3: 'wonda-eng-section3-intro',
    4: 'wonda-eng-section4-intro',
    5: 'wonda-eng-section5-intro',
    6: 'wonda-eng-bridge-intro',
    7: 'wonda-eng-section7-intro',
    8: 'wonda-eng-complete'
  };

  function showSection(n) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('sec-' + n);
    if (!el) return;
    el.classList.add('active');
    currentSection = n;
    Track.event('section_enter', { section: n });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      // Section 2 plays the two chained "what is an engineer" parts.
      if (n === 2) { playWhatIs(0); return; }
      // Section 5b — skills self-assessment screen
      if (n === 'skills') {
        WONDA.play('wonda-eng-skills-assess', {
          bubbleText:   "Now tap the skills YOU used today! You can pick more than one. Tap Done when you're finished!",
          fallbackText: "Now tap the skills YOU used today! You can pick more than one. Tap Done when you're finished!"
        });
        return;
      }
      const mp3 = SECTION_AUDIO[n];
      if (mp3) {
        const playOpts = { bubbleText: SECTION_LINES[n], fallbackText: SECTION_LINES[n] };
        // For Section 7 (the quiz), chain Q1 audio after the intro so the
        // two MP3s never overlap. paintQuizQuestion was already called
        // with skipFirstAudio=true so it hasn't fired Q1 itself.
        if (n === 7) {
          playOpts.onend = () => {
            if (quizIdx === 0) {
              const q0 = QUIZ[0], clip0 = QUIZ_QUESTION_CLIPS[0];
              if (clip0 && q0) WONDA.play(clip0, { bubbleText: q0.ask, fallbackText: q0.ask });
            }
          };
        }
        WONDA.play(mp3, playOpts);
      } else if (SECTION_LINES[n]) {
        WONDA.say(SECTION_LINES[n]);
      }
    }, 350);
    if (n === 7) startQuiz();
    if (n === 8) celebrate();
  }

  document.querySelectorAll('.btn.next').forEach(b => {
    b.addEventListener('click', () => {
      fxClick(); ensureCtx();
      // Allow numeric ("6") or string ("skills") section ids
      const raw = b.dataset.next;
      const asNum = parseInt(raw, 10);
      const n = (!isNaN(asNum) && String(asNum) === raw) ? asNum : raw;
      if (n) showSection(n);
    });
  });
  document.getElementById('btn-start').addEventListener('click', () => {
    fxClick(); ensureCtx();
    showSection(2);
  });

  // ===================================================================
  // Section 5b — Skills self-assessment
  // ===================================================================
  document.querySelectorAll('#skills-tick-grid .tick-card').forEach(card => {
    card.addEventListener('click', () => {
      fxClick();
      card.classList.toggle('ticked');
      const isOn = card.classList.contains('ticked');
      card.setAttribute('aria-pressed', isOn ? 'true' : 'false');
    });
  });
  const skillsDoneBtn = document.getElementById('skills-done-btn');
  if (skillsDoneBtn) {
    skillsDoneBtn.addEventListener('click', () => {
      fxClick();
      const ticked = [];
      document.querySelectorAll('#skills-tick-grid .tick-card.ticked').forEach(c => {
        ticked.push(c.dataset.skill);
      });
      const total = 5;
      Track.event('skills_self_assess', {
        ticked: ticked,
        ticked_count: ticked.length,
        total_options: total,
        correct_count: ticked.length
      });
      try {
        localStorage.setItem('wlhch_skills_self_assess', JSON.stringify({
          ticked: ticked,
          ts: Date.now(),
          mission: 'engineer'
        }));
      } catch (e) {}
      showSection(6);
    });
  }

  // Section replay buttons
  [1, 2, 3, 6].forEach(n => {
    const el = document.getElementById('replay-' + n);
    if (!el) return;
    el.addEventListener('click', () => {
      fxClick();
      Track.event('section_replay', { section: n });
      if (n === 2) { playWhatIs(0); return; }
      const mp3 = SECTION_AUDIO[n];
      if (mp3) WONDA.play(mp3, { bubbleText: SECTION_LINES[n], fallbackText: SECTION_LINES[n] });
      else     WONDA.say(SECTION_LINES[n]);
    });
  });

  // ===================================================================
  // Tappable cog (Section 2)
  // ===================================================================
  const tappableCog = document.getElementById('tappable-cog');
  if (tappableCog) {
    tappableCog.addEventListener('click', () => {
      Track.event('hero_tap', { section: 2 });
      tappableCog.classList.add('spinning');
      setTimeout(() => tappableCog.classList.remove('spinning'), 1200);
      fxWhirr();
      WONDA.play('wonda-eng-cog', { bubbleText: "Look at it spin! Round and round!", fallbackText: "Look at it spin! Round and round!" });
    });
  }

  // ===================================================================
  // Picture / story / skill cards
  // ===================================================================
  function categoryFromAudio(audio) {
    if (!audio) return 'unknown';
    if (audio.indexOf('wonda-build-')   === 0) return 'whatTheyBuild';
    if (audio.indexOf('wonda-story-')   === 0) return 'stories';
    if (audio.indexOf('wonda-skill-')   === 0) return 'skills';
    return 'other';
  }
  document.querySelectorAll('[data-line]').forEach(el => {
    el.addEventListener('click', () => {
      fxClick();
      const line  = el.dataset.line;
      const audio = el.dataset.audio;
      Track.event('card_tap', { card: audio || 'unknown', category: categoryFromAudio(audio) });
      if (audio) WONDA.play(audio, { bubbleText: line, fallbackText: line });
      else if (line) WONDA.say(line);
    });
  });

  // ===================================================================
  // BUILD THE BRIDGE mini-game (Section 6)
  // ===================================================================
  const build = {
    correctNeeded: 3,
    correctSoFar: 0,
    activeDrag: null,
    cheerClips: ['wonda-eng-bridge-correct-1','wonda-eng-bridge-correct-2','wonda-eng-bridge-correct-3'],
    cheerTexts: ["Yes! Great choice!", "Perfect, Engineer!", "That's exactly right!"],
    sillyClips: ['wonda-eng-bridge-silly-1','wonda-eng-bridge-silly-2','wonda-eng-bridge-silly-3'],
    sillyTexts: ["Hee hee, that won't hold a bridge!", "Silly! Try another one!", "Not that one, Engineer!"]
  };
  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function getDropZoneRect() {
    return document.getElementById('build-river').getBoundingClientRect();
  }
  function pointInRect(x, y, r) {
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  function startDrag(item, x, y) {
    if (item.classList.contains('gone') || item.disabled) return;
    fxClick();
    const rect = item.getBoundingClientRect();
    build.activeDrag = {
      item, offsetX: x - rect.left, offsetY: y - rect.top
    };
    item.classList.add('dragging');
    item.style.left = (x - build.activeDrag.offsetX) + 'px';
    item.style.top  = (y - build.activeDrag.offsetY) + 'px';
    item.style.width  = rect.width  + 'px';
    item.style.height = rect.height + 'px';
  }
  function moveDrag(x, y) {
    if (!build.activeDrag) return;
    const it = build.activeDrag.item;
    it.style.left = (x - build.activeDrag.offsetX) + 'px';
    it.style.top  = (y - build.activeDrag.offsetY) + 'px';
  }
  function endDrag(x, y) {
    if (!build.activeDrag) return;
    const item = build.activeDrag.item;
    const zone = getDropZoneRect();
    const inside = pointInRect(x, y, zone);
    item.classList.remove('dragging');
    item.style.left = item.style.top = item.style.width = item.style.height = '';

    if (inside) {
      const correct = item.dataset.correct === '1';
      Track.event('build_drop', { item: item.dataset.name, correct });
      if (correct) {
        fxDing();
        sparkleBurst(zone.left + zone.width/2, zone.top + zone.height/2);
        WONDA.playRandom(build.cheerClips, { texts: build.cheerTexts });
        const loaded = document.getElementById('build-loaded');
        loaded.classList.remove('empty');
        const clone = item.cloneNode(true);
        clone.removeAttribute('data-correct');
        clone.removeAttribute('aria-label');
        clone.style.cursor = 'default';
        loaded.appendChild(clone);
        item.classList.add('gone');
        build.correctSoFar++;
        if (build.correctSoFar >= build.correctNeeded) {
          setTimeout(() => buildComplete(), 700);
        }
      } else {
        fxGiggle();
        item.classList.add('bouncing');
        setTimeout(() => item.classList.remove('bouncing'), 500);
        WONDA.playRandom(build.sillyClips, { texts: build.sillyTexts });
      }
    }
    build.activeDrag = null;
  }
  function buildComplete() {
    Track.event('build_complete');
    fxChime();
    const placeholder = document.getElementById('bridge-placeholder');
    const complete    = document.getElementById('bridge-complete');
    if (placeholder) placeholder.style.display = 'none';
    if (complete)    complete.style.display    = 'block';
    setTimeout(walkPersonAcrossBridge, 400);

    WONDA.play('wonda-eng-bridge-done', {
      bubbleText: "Hooray! The bridge is finished! Look — someone is crossing safely! You did it!",
      fallbackText: "Hooray! The bridge is finished! Look — someone is crossing safely! You did it!"
    });
    document.getElementById('build-next').style.display = 'inline-flex';
    document.getElementById('build-replay').style.display = 'inline-flex';
    document.querySelectorAll('#build-item-grid .build-item:not(.gone)').forEach(b => {
      b.style.opacity = '.45';
      b.disabled = true;
    });
  }
  let personWalkRAF = null;
  function walkPersonAcrossBridge() {
    const p = document.getElementById('person-walking');
    if (!p) return;
    if (personWalkRAF) cancelAnimationFrame(personWalkRAF);
    p.setAttribute('opacity', '1');
    const startX = 70;
    const endX   = 250;
    const duration = 2600;
    const t0 = performance.now();
    function step(now) {
      const t = Math.min(1, (now - t0) / duration);
      const x = startX + (endX - startX) * t;
      p.setAttribute('x', x);
      const bob = Math.sin(t * Math.PI * 8) * 1.5;
      p.setAttribute('y', 112 + bob);
      if (t < 1) personWalkRAF = requestAnimationFrame(step);
    }
    personWalkRAF = requestAnimationFrame(step);
  }

  function resetBuild() {
    build.correctSoFar = 0;
    document.querySelectorAll('#build-item-grid .build-item').forEach(b => {
      b.classList.remove('gone','bouncing');
      b.disabled = false;
      b.style.opacity = '';
    });
    const loaded = document.getElementById('build-loaded');
    loaded.innerHTML = '';
    loaded.classList.add('empty');
    document.getElementById('build-next').style.display = 'none';
    document.getElementById('build-replay').style.display = 'none';
    const placeholder = document.getElementById('bridge-placeholder');
    const complete    = document.getElementById('bridge-complete');
    if (placeholder) placeholder.style.display = 'block';
    if (complete)    complete.style.display    = 'none';
    if (personWalkRAF) { cancelAnimationFrame(personWalkRAF); personWalkRAF = null; }
    const person = document.getElementById('person-walking');
    if (person) {
      person.setAttribute('opacity', '0');
      person.setAttribute('x', '-30');
      person.setAttribute('y', '112');
    }
  }
  document.getElementById('build-replay').addEventListener('click', () => { fxClick(); resetBuild(); });

  document.querySelectorAll('#build-item-grid .build-item').forEach(item => {
    item.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      item.setPointerCapture(e.pointerId);
      startDrag(item, e.clientX, e.clientY);
    });
    item.addEventListener('pointermove', (e) => {
      if (build.activeDrag && build.activeDrag.item === item) moveDrag(e.clientX, e.clientY);
    });
    item.addEventListener('pointerup', (e) => {
      if (build.activeDrag && build.activeDrag.item === item) endDrag(e.clientX, e.clientY);
    });
    item.addEventListener('pointercancel', (e) => {
      if (build.activeDrag && build.activeDrag.item === item) endDrag(e.clientX, e.clientY);
    });
  });

  function sparkleBurst(x, y) {
    const emojis = ['✨','⭐','💫','🌟'];
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('div');
      s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      s.style.cssText =
        'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
        'font-size:22px;pointer-events:none;z-index:80;' +
        'transition:transform .8s cubic-bezier(.2,1.4,.4,1.2),opacity .8s;';
      document.body.appendChild(s);
      const ang = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 60;
      requestAnimationFrame(() => {
        s.style.transform = 'translate(' + (Math.cos(ang) * dist) + 'px,' + (Math.sin(ang) * dist) + 'px) scale(.4)';
        s.style.opacity = '0';
      });
      setTimeout(() => s.remove(), 900);
    }
  }

  // ===================================================================
  // QUIZ (Section 7)
  // ===================================================================
  const QUIZ = [
    {
      ask: "What does an engineer build over a river? Tap the picture!",
      heading: "What does an engineer build over a river?",
      options: [
        { emoji: "🌉", label: "bridge",  correct: true  },
        { emoji: "🍕", label: "pizza",   correct: false },
        { emoji: "🎈", label: "balloon", correct: false }
      ]
    },
    {
      ask: "Which one is an engineer's tool?",
      heading: "Which one is an engineer's tool?",
      options: [
        { emoji: "🔧", label: "spanner", correct: true  },
        { emoji: "🍌", label: "banana",  correct: false },
        { emoji: "🎩", label: "hat",     correct: false }
      ]
    },
    {
      ask: "Do engineers solve problems and build things?",
      heading: "Do engineers solve problems and build things?",
      options: [
        { emoji: "👍", label: "YES", correct: true  },
        { emoji: "👎", label: "NO",  correct: false }
      ]
    }
  ];
  const QUIZ_CHEERS = ["Wow! Well done, Engineer!", "Brilliant! You are amazing, well done!", "Yes! Super star, Engineer!"];
  const QUIZ_CHEER_CLIPS    = ['wonda-eng-correct-1','wonda-eng-correct-2','wonda-eng-correct-3'];
  const QUIZ_OOPS_CLIPS     = ['wonda-eng-oops'];
  const QUIZ_QUESTION_CLIPS = ['wonda-eng-quiz-1','wonda-eng-quiz-2','wonda-eng-quiz-3'];
  let quizIdx = 0;

  function paintQuizProgress() {
    const dots = document.querySelectorAll('#quiz-progress .qp-dot');
    dots.forEach((d, i) => {
      d.classList.remove('current','done');
      if (i < quizIdx) d.classList.add('done');
      if (i === quizIdx) d.classList.add('current');
    });
  }
  function startQuiz() { quizIdx = 0; paintQuizQuestion(true); }
  function paintQuizQuestion(skipAudio) {
    paintQuizProgress();
    const q = QUIZ[quizIdx];
    if (!q) {
      // Quiz finished → ask the AFTER confidence question, THEN celebrate
      showConfidence('after', () => showSection(8));
      return;
    }
    document.getElementById('quiz-question').textContent = q.heading;
    const opts = document.getElementById('quiz-options');
    opts.innerHTML = '';
    const shuffled = q.options.slice().sort(() => Math.random() - 0.5);
    shuffled.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'quiz-option';
      b.type = 'button';
      b.setAttribute('aria-label', opt.label);
      b.innerHTML = '<span class="qopt-emoji" aria-hidden="true">' + opt.emoji + '</span>' +
                    '<span class="qopt-label">' + opt.label + '</span>';
      b.addEventListener('click', () => onQuizPick(b, opt));
      opts.appendChild(b);
    });
    if (skipAudio) return;
    setTimeout(() => {
      const clip = QUIZ_QUESTION_CLIPS[quizIdx];
      if (clip) WONDA.play(clip, { bubbleText: q.ask, fallbackText: q.ask });
      else      WONDA.say(q.ask);
    }, 250);
  }
  function onQuizPick(btn, opt) {
    fxClick();
    Track.event('quiz_answer', { q: quizIdx + 1, correct: opt.correct, choice: opt.label });
    if (opt.correct) {
      btn.classList.add('right');
      fxChime();
      sparkleBurst(btn.getBoundingClientRect().left + btn.offsetWidth/2,
                   btn.getBoundingClientRect().top  + btn.offsetHeight/2);
      WONDA.playRandom(QUIZ_CHEER_CLIPS, {
        texts: QUIZ_CHEERS,
        onend: () => { quizIdx++; setTimeout(paintQuizQuestion, 400); }
      });
      document.querySelectorAll('#quiz-options .quiz-option').forEach(b => b.disabled = true);
    } else {
      btn.classList.add('wrong');
      fxOops();
      WONDA.playRandom(QUIZ_OOPS_CLIPS, {
        bubbleText: "Ooh, nearly! Let's try again!",
        fallbackText: "Ooh, nearly! Let's try again!",
        onend: () => {
          setTimeout(() => { btn.classList.remove('wrong'); paintQuizQuestion(); }, 200);
        }
      });
    }
  }
  document.getElementById('quiz-replay').addEventListener('click', () => {
    fxClick();
    const q = QUIZ[quizIdx];
    if (!q) return;
    const clip = QUIZ_QUESTION_CLIPS[quizIdx];
    if (clip) WONDA.play(clip, { bubbleText: q.ask, fallbackText: q.ask });
    else      WONDA.say(q.ask);
  });

  // ===================================================================
  // MISSION COMPLETE — confetti + spinning cogs + certificate
  // ===================================================================
  function celebrate() {
    Track.event('mission_complete', { mission: 'engineer' });
    fxConfetti();
    burstConfetti(60);
    burstCelebrateCogs(8);
    setTimeout(() => fxHorn(), 400);
    updateHeroName();
    // Submit score to the WonderLeap backend via the HMAC bridge.
    // Standalone-safe: bridge is inert when session params are missing.
    submitMissionScore();
  }

  // ===================================================================
  // HMAC SCORE SUBMISSION — quiz first-try correctness drives the score
  // (0/3 = 0, 1/3 = 33, 2/3 = 67, 3/3 = 100). Bridge completion is
  // implicit (mission can't reach Section 8 without it). The
  // WL_BRIDGE.submitScore(toolScore, totalRounds, timeSpent) interface
  // matches the Welcome / Electrician / Cybersecurity games — the
  // bridge itself computes score/stars/signature.
  // ===================================================================
  function submitMissionScore() {
    if (!window.WL_BRIDGE) {
      console.log('🎮 Standalone mode — score not submitted');
      return;
    }
    let evts = [];
    try { evts = JSON.parse(localStorage.getItem('wlhch_events') || '[]'); } catch (e) {}
    let sess = '';
    try {
      const s = JSON.parse(localStorage.getItem('wlhch_session') || '{}');
      sess = (s && s.id) || '';
    } catch (e) {}
    const mine = evts.filter(e => e.session === sess && e.page === 'engineer');

    // Quiz first-try correctness (3 questions) → toolScore
    const quizFirst = { 1: null, 2: null, 3: null };
    mine.forEach(e => {
      if (e.type === 'quiz_answer' && e.data && quizFirst[e.data.q] === null) {
        quizFirst[e.data.q] = !!e.data.correct;
      }
    });
    const correctCount   = [1, 2, 3].reduce((c, q) => c + (quizFirst[q] ? 1 : 0), 0);
    const totalQuestions = 3;

    // Time spent in seconds (from mission_open to now)
    const opened = mine.find(e => e.type === 'mission_open');
    const timeSpent = opened ? Math.round((Date.now() - opened.ts) / 1000) : 0;

    // Delegate to the shared bridge — it computes score/stars/signature
    // and POSTs the same shape as Welcome / Electrician / Cybersecurity.
    window.WL_BRIDGE.submitScore(correctCount, totalQuestions, timeSpent);
  }

  function burstConfetti(count) {
    const colours = ['#76FF03','#00C853','#2196F3','#1565C0','#7C3AED','#FFD54F','#FF9800'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.background = colours[Math.floor(Math.random() * colours.length)];
      p.style.animationDuration = (2 + Math.random() * 2) + 's';
      p.style.animationDelay = (Math.random() * 0.5) + 's';
      p.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 5000);
    }
  }
  function burstCelebrateCogs(count) {
    const colours = ['#76FF03','#2196F3','#FFB300','#7C3AED'];
    for (let i = 0; i < count; i++) {
      const wrap = document.createElement('div');
      wrap.className = 'celebrate-cog';
      wrap.style.left = (Math.random() * 90 + 5) + 'vw';
      wrap.style.animationDelay = (Math.random() * 1.5) + 's';
      wrap.style.animationDuration = (4 + Math.random() * 2) + 's';
      const col = colours[Math.floor(Math.random() * colours.length)];
      wrap.innerHTML = '<svg viewBox="0 0 64 64" width="100%" height="100%"><polygon points="-3,-30 3,-30 6,-23 12,-19 22,-23 28,-15 23,-7 30,-3 30,3 23,7 28,15 22,23 12,19 6,23 3,30 -3,30 -6,23 -12,19 -22,23 -28,15 -23,7 -30,3 -30,-3 -23,-7 -28,-15 -22,-23 -12,-19 -6,-23" transform="translate(32,32)" fill="' + col + '" stroke="#1A2530" stroke-width="2"/><circle cx="32" cy="32" r="6" fill="#1A2530"/></svg>';
      document.body.appendChild(wrap);
      setTimeout(() => wrap.remove(), 6500);
    }
  }
  function updateHeroName() {
    const input = document.getElementById('hero-name-input');
    const display = document.getElementById('hero-name-display');
    const name = (input.value || '').trim();
    display.textContent = name || 'Little Engineer';
  }
  // Restore previously-typed hero name across sessions, per Finneen's spec
  // (wlhch_hero localStorage key — ENGINEER-SHAREABLE-INTEGRATION.md §4).
  try {
    const savedHero = localStorage.getItem('wlhch_hero');
    if (savedHero) {
      const _heroIn = document.getElementById('hero-name-input');
      if (_heroIn && !_heroIn.value) _heroIn.value = savedHero;
      updateHeroName();
    }
  } catch (e) { /* private mode — silent */ }

  let nameDebounce = null;
  document.getElementById('hero-name-input').addEventListener('input', () => {
    updateHeroName();
    clearTimeout(nameDebounce);
    nameDebounce = setTimeout(() => {
      const n = (document.getElementById('hero-name-input').value || '').trim();
      if (n) {
        Track.event('mission_name', { name: n });
        try { localStorage.setItem('wlhch_hero', n); } catch (e) {}
      }
    }, 800);
  });
  document.getElementById('btn-print').addEventListener('click', () => {
    fxClick(); updateHeroName();
    setTimeout(() => window.print(), 200);
  });

  // ===================================================================
  // Downloadable per-completion report
  // ===================================================================
  function generateEngineerReport() {
    const evts    = JSON.parse(localStorage.getItem('wlhch_events') || '[]');
    const session = (JSON.parse(localStorage.getItem('wlhch_session') || '{}') || {}).id;
    const mine    = evts.filter(e => e.session === session && e.page === 'engineer');

    const completed = mine.some(e => e.type === 'mission_complete');
    const nameInput = (document.getElementById('hero-name-input').value || '').trim();
    const nameEvt   = mine.filter(e => e.type === 'mission_name').slice(-1)[0];
    const name      = nameInput || (nameEvt && nameEvt.data && nameEvt.data.name) || 'Little Engineer';

    const first = mine[0];
    const last  = mine[mine.length - 1];
    const startTs = first ? first.ts : Date.now();
    const endTs   = last  ? last.ts  : Date.now();
    const durMs   = endTs - startTs;
    const m = Math.floor(durMs / 60000), s = Math.floor((durMs % 60000) / 1000);
    const durLabel = (m ? (m + 'm ') : '') + s + 's';
    const dateLabel = new Date(endTs).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' });

    const quizFirst = { 1: null, 2: null, 3: null };
    mine.forEach(e => {
      if (e.type === 'quiz_answer' && e.data) {
        const q = e.data.q;
        if (quizFirst[q] === null) quizFirst[q] = !!e.data.correct;
      }
    });
    const QUIZ_LABELS = {
      1: "What does an engineer build over a river?",
      2: "Which one is an engineer's tool?",
      3: "Do engineers solve problems and build things?"
    };

    const cardCounts = {};
    mine.forEach(e => {
      if (e.type === 'card_tap' && e.data && e.data.card) {
        cardCounts[e.data.card] = (cardCounts[e.data.card] || 0) + 1;
      }
    });
    const BUILDS = {
      'wonda-eng-build-bridge':  { icon: '🌉', label: 'Big strong bridges' },
      'wonda-eng-design-rockets':  { icon: '🚀', label: 'Rockets that fly to space' },
      'wonda-eng-build-vehicle': { icon: '🚗', label: 'Cars, trains, aeroplanes' },
      'wonda-eng-build-robot':   { icon: '🤖', label: 'Clever robots' }
    };
    const SKILLS = {
      'wonda-eng-skill-thinking':       { icon: '🧠', label: 'Thinking' },
      'wonda-eng-skill-clever':         { icon: '💡', label: 'Clever' },
      'wonda-eng-skill-patience':       { icon: '⏳', label: 'Patience' },
      'wonda-eng-skill-creative':       { icon: '🎨', label: 'Creative' },
      'wonda-eng-skill-problemsolvers': { icon: '🧩', label: 'Problem Solving' }
    };
    const STORIES = {
      'wonda-eng-story-bridge':    { icon: '🌉', label: 'A bridge for the town' },
      'wonda-eng-story-astronaut': { icon: '🚀', label: 'A rocket to the moon' },
      'wonda-eng-story-robot':     { icon: '🤖', label: 'A helpful robot' }
    };

    let buildRight = 0, buildWrong = 0;
    mine.forEach(e => {
      if (e.type === 'build_drop' && e.data) {
        if (e.data.correct) buildRight++; else buildWrong++;
      }
    });

    const lastSection = mine.reduce((acc, e) => {
      if (e.type === 'section_enter' && e.data && e.data.section > acc) return e.data.section;
      return acc;
    }, 0);

    const confBefore = mine.filter(e => e.type === 'confidence_before').slice(-1)[0];
    const confAfter  = mine.filter(e => e.type === 'confidence_after').slice(-1)[0];
    const confBeforeAns = confBefore && confBefore.data ? confBefore.data.answer : null;
    const confAfterAns  = confAfter  && confAfter.data  ? confAfter.data.answer  : null;
    const learned = (confBeforeAns === 'no' && confAfterAns === 'yes');

    const tick = ok => ok ? '<span style="color:#2E7D32;font-weight:700;">✓ Correct</span>'
                          : '<span style="color:#C62828;font-weight:700;">✗ Needed another try</span>';
    const dash = '<span style="color:#90A4AE;">—</span>';

    const buildsList = Object.keys(BUILDS).map(k => {
      const seen = (cardCounts[k] || 0) > 0;
      return '<li>' + BUILDS[k].icon + ' ' + BUILDS[k].label + ' — ' +
             (seen ? '<span style="color:#2E7D32;font-weight:700;">explored ' + cardCounts[k] + '×</span>'
                   : '<span style="color:#90A4AE;">not explored</span>') + '</li>';
    }).join('');
    const skillsList = Object.keys(SKILLS).map(k => {
      const seen = (cardCounts[k] || 0) > 0;
      return '<li>' + SKILLS[k].icon + ' ' + SKILLS[k].label + ' — ' +
             (seen ? '<span style="color:#2E7D32;font-weight:700;">tapped ' + cardCounts[k] + '×</span>'
                   : '<span style="color:#90A4AE;">not tapped</span>') + '</li>';
    }).join('');

    const SKILL_BY_ID = {
      thinking:       SKILLS['wonda-eng-skill-thinking'],
      clever:         SKILLS['wonda-eng-skill-clever'],
      patience:       SKILLS['wonda-eng-skill-patience'],
      creative:       SKILLS['wonda-eng-skill-creative'],
      problemsolvers: SKILLS['wonda-eng-skill-problemsolvers']
    };
    let selfTicked = [];
    try {
      const raw = localStorage.getItem('wlhch_skills_self_assess');
      if (raw) selfTicked = (JSON.parse(raw).ticked) || [];
    } catch (e) { selfTicked = []; }
    const selfList = Object.keys(SKILL_BY_ID).map(id => {
      const meta = SKILL_BY_ID[id];
      const ticked = selfTicked.indexOf(id) !== -1;
      return '<li>' + meta.icon + ' ' + meta.label + ' — ' +
             (ticked ? '<span style="color:#2E7D32;font-weight:700;">✓ I used this!</span>'
                     : '<span style="color:#90A4AE;">not ticked</span>') + '</li>';
    }).join('');
    const storiesList = Object.keys(STORIES).map(k => {
      const seen = (cardCounts[k] || 0) > 0;
      return '<li>' + STORIES[k].icon + ' ' + STORIES[k].label + ' — ' +
             (seen ? '<span style="color:#2E7D32;font-weight:700;">heard</span>'
                   : '<span style="color:#90A4AE;">not heard</span>') + '</li>';
    }).join('');

    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<title>WonderLeap — Engineer Mission Report — ${escapeHTML(name)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Nunito","Avenir Next",system-ui,sans-serif; color: #0D1B2A;
         background: #F5F8FB; padding: 28px 24px; max-width: 820px; margin: 0 auto; }
  .header { text-align: center; padding-bottom: 18px; border-bottom: 3px solid #1565C0; margin-bottom: 22px; }
  .header .logo { font-size: 36px; }
  .header h1 { color: #1565C0; font-size: 30px; font-weight: 800; margin-top: 6px; }
  .header .subtitle { color: #455A64; font-size: 15px; margin-top: 4px; }
  .top-card { background: #FFF; border: 3px solid #1565C0; border-radius: 18px;
              padding: 18px 22px; margin-bottom: 20px; text-align: center; }
  .top-card .name { font-size: 30px; font-weight: 800; color: #5B21B6;
                    border-bottom: 2px solid #7C3AED; display: inline-block;
                    padding: 0 16px 4px; margin-bottom: 10px; }
  .top-card .meta { color: #455A64; font-size: 14px; }
  .stat-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 22px; }
  .stat { flex: 1; min-width: 140px; background: #FFF; border-radius: 14px;
          border-left: 5px solid #2196F3; padding: 12px 14px; }
  .stat .label { font-size: 11px; text-transform: uppercase; color: #607D8B; font-weight: 700; letter-spacing: .5px; }
  .stat .value { font-size: 22px; font-weight: 800; color: #1565C0; margin-top: 4px; }
  .section { background: #FFF; border-radius: 14px; padding: 18px 22px; margin-bottom: 16px;
             border-left: 5px solid #76FF03; }
  .section h2 { color: #1565C0; font-size: 19px; font-weight: 800; margin-bottom: 10px; }
  ul { padding-left: 22px; }
  li { margin: 6px 0; font-size: 15px; }
  .quiz-row { padding: 8px 0; border-bottom: 1px dashed #E5E7EB; font-size: 15px; }
  .quiz-row:last-child { border-bottom: none; }
  .quiz-row .q { color: #5B21B6; font-weight: 700; margin-right: 8px; }
  .footer { text-align: center; color: #607D8B; font-size: 12px; margin-top: 24px;
            padding-top: 16px; border-top: 1px solid #E5E7EB; }
  @media print { body { background: #FFF; padding: 10px; } button { display: none; } }
  .print-btn { display: inline-block; margin: 0 6px; padding: 10px 22px;
               background: #7C3AED; color: #FFF; border: none; border-radius: 999px;
               font-family: inherit; font-size: 14px; font-weight: 700;
               cursor: pointer; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">⚙️🌟</div>
    <h1>Engineer Mission Report</h1>
    <div class="subtitle">A WonderLeap STEM &amp; Future Tech Labs Adventure</div>
  </div>

  <div class="top-card">
    <div class="name">${escapeHTML(name)}</div>
    <div class="meta">${dateLabel}</div>
  </div>

  <div class="stat-row">
    <div class="stat">
      <div class="label">Mission</div>
      <div class="value">${completed ? '✓ Completed' : 'In progress'}</div>
    </div>
    <div class="stat">
      <div class="label">Time taken</div>
      <div class="value">${durLabel}</div>
    </div>
    <div class="stat">
      <div class="label">Reached section</div>
      <div class="value">${lastSection}/8</div>
    </div>
  </div>

  <div class="section">
    <h2>📈 Confidence — does the child know what an engineer is?</h2>
    <ul>
      <li>Before the mission: <strong style="color:${confBeforeAns === 'yes' ? '#2E7D32' : confBeforeAns === 'no' ? '#C62828' : '#90A4AE'};">${confBeforeAns ? confBeforeAns.toUpperCase() : 'not answered'}</strong></li>
      <li>After the mission: <strong style="color:${confAfterAns === 'yes' ? '#2E7D32' : confAfterAns === 'no' ? '#C62828' : '#90A4AE'};">${confAfterAns ? confAfterAns.toUpperCase() : 'not answered'}</strong></li>
      ${learned ? '<li style="color:#2E7D32;font-weight:800;">✨ Confidence shift: NO → YES — this child learned what an engineer is!</li>' : ''}
    </ul>
  </div>

  <div class="section">
    <h2>🎯 Engineer Quiz — first-try answers</h2>
    <div class="quiz-row"><span class="q">Q1.</span> ${escapeHTML(QUIZ_LABELS[1])} — ${quizFirst[1] === null ? dash : tick(quizFirst[1])}</div>
    <div class="quiz-row"><span class="q">Q2.</span> ${escapeHTML(QUIZ_LABELS[2])} — ${quizFirst[2] === null ? dash : tick(quizFirst[2])}</div>
    <div class="quiz-row"><span class="q">Q3.</span> ${escapeHTML(QUIZ_LABELS[3])} — ${quizFirst[3] === null ? dash : tick(quizFirst[3])}</div>
  </div>

  <div class="section">
    <h2>🛠️ What engineers build — explored</h2>
    <ul>${buildsList}</ul>
  </div>

  <div class="section">
    <h2>📖 Stories heard</h2>
    <ul>${storiesList}</ul>
  </div>

  <div class="section">
    <h2>✨ Engineer skills explored</h2>
    <ul>${skillsList}</ul>
  </div>

  <div class="section">
    <h2>💭 Skills ${escapeHTML(name)} said they used</h2>
    <p style="font-size:13px; color:#607D8B; margin-bottom:8px;">Self-recognition — what the child ticked themselves after exploring the skills.</p>
    <ul>${selfList}</ul>
  </div>

  <div class="section">
    <h2>🌉 Build a Bridge mini-game</h2>
    <ul>
      <li>Correct pieces placed: <strong style="color:#2E7D32;">${buildRight}</strong></li>
      <li>Silly pieces tried: <strong style="color:#FF6F00;">${buildWrong}</strong></li>
      <li>Bridge completed: <strong style="color:${buildRight >= 3 ? '#2E7D32' : '#90A4AE'};">${buildRight >= 3 ? '✓ Yes' : 'Not yet'}</strong></li>
    </ul>
  </div>

  <div style="text-align:center; margin-top:12px;">
    <button class="print-btn" onclick="window.print()">🖨️ Print this report</button>
  </div>

  <div class="footer">
    Generated by WonderLeap · wonderleap.co.uk · Health &amp; Care Heroes and STEM &amp; Future Tech Labs zones
  </div>
</body></html>`;
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  document.getElementById('btn-report').addEventListener('click', () => {
    fxClick(); updateHeroName();
    const html = generateEngineerReport();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = ((document.getElementById('hero-name-input').value || '').trim() || 'engineer')
      .replace(/[^a-z0-9]+/gi, '_').toLowerCase();
    a.href = url;
    a.download = 'engineer-mission-report-' + safeName + '-' + new Date().toISOString().slice(0, 10) + '.html';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    Track.event('report_downloaded', { mission: 'engineer' });
  });
  document.getElementById('btn-replay-mission').addEventListener('click', () => {
    fxClick();
    resetBuild();
    quizIdx = 0;
    // Clear previous playthrough's events + force a fresh session so the
    // next submission isn't contaminated by old (wrong) quiz answers.
    try { localStorage.removeItem('wlhch_events'); } catch (e) {}
    try { localStorage.removeItem('wlhch_session'); } catch (e) {}
    // Re-log the mission_open marker so timeSpent calculation has an anchor.
    Track.event('mission_open', { mission: 'engineer' });
    showSection(1);
  });

  function sayByeAndGoHome() {
    Track.event('mission_exit');
    let exited = false;
    const goHome = () => {
      if (exited) return;
      exited = true;
      if (window.WL_BRIDGE) {
        // In iframe — postMessage parent React app to navigate.
        // We must NOT reload the iframe (would drop session params from
        // URL and re-trigger autoplay block — see README pitfalls).
        try { window.parent.postMessage({ type: 'GAME_EXIT' }, '*'); } catch (e) {}
      } else {
        // Standalone — reload the page (acceptable for demos).
        window.location.href = 'index.html';
      }
    };
    WONDA.play('wonda-eng-bye', {
      bubbleText: "Bye-bye for now, Engineer! See you next time!",
      fallbackText: "Bye-bye for now, Engineer! See you next time!",
      onend: goHome
    });
    setTimeout(goHome, 3500);
  }
  document.getElementById('btn-home-2').addEventListener('click', () => { fxClick(); sayByeAndGoHome(); });

  // ===================================================================
  // Top-left 🏠 button — in iframe mode, intercept the <a href="index.html">
  // click so we postMessage the parent instead of reloading the iframe
  // (which would drop session params and re-trigger the autoplay block).
  // In standalone mode the <a> behaves normally.
  // ===================================================================
  const btnHome = document.getElementById('btn-home');
  if (btnHome) {
    btnHome.addEventListener('click', (e) => {
      if (window.WL_BRIDGE) {
        e.preventDefault();
        fxClick();
        Track.event('mission_exit_home');
        try { window.parent.postMessage({ type: 'GAME_EXIT' }, '*'); } catch (err) {}
      }
    });
  }

  // ===================================================================
  // Top-right controls
  // ===================================================================
  const btnSound = document.getElementById('btn-sound');
  const btnMute  = document.getElementById('btn-mute');
  btnSound.addEventListener('click', () => { fxClick(); WONDA.replay(); });
  let mutedState = false;
  btnMute.addEventListener('click', () => {
    mutedState = !mutedState;
    WONDA.setMuted(mutedState);
    btnMute.classList.toggle('off', mutedState);
    btnMute.textContent = mutedState ? '🔇' : '👤';
    btnMute.setAttribute('aria-label', mutedState ? 'Voice muted — tap to unmute' : 'Mute voice (for grown-ups)');
  });
  document.getElementById('wonda-svg-wrap').addEventListener('click', () => WONDA.replay());

  // ===================================================================
  // Grown-up corner toggle
  // ===================================================================
  const guToggle = document.getElementById('grown-up-toggle');
  const guBody   = document.getElementById('grown-up-body');
  guToggle.addEventListener('click', () => {
    const open = guBody.classList.toggle('open');
    guToggle.classList.toggle('open', open);
    guToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // ===================================================================
  // Confidence self-assessment overlay (before + after)
  // ===================================================================
  let confidenceShown = { before: false, after: false };
  function showConfidence(when, onDone) {
    if (confidenceShown[when]) { if (onDone) onDone(); return; }
    confidenceShown[when] = true;
    WONDA.stop();
    const overlay = document.getElementById('confidence-overlay');
    const title = document.getElementById('confidence-title');
    const isBefore = (when === 'before');
    const titleText = isBefore
      ? 'Before we start — do you know what an engineer is and what they do?'
      : 'Now we are finished — do you know what an engineer is and what they do?';
    title.textContent = '';
    title.textContent = titleText;
    overlay.classList.add('show');
    const promptClip = isBefore ? 'wonda-stem-yesorno' : 'wonda-eng-finished-yesorno';
    WONDA.play(promptClip, {
      bubbleText: titleText,
      fallbackText: titleText
    });

    const yesBtn = document.getElementById('confidence-yes');
    const noBtn  = document.getElementById('confidence-no');
    function answer(yes) {
      yesBtn.onclick = noBtn.onclick = null;
      fxClick();
      WONDA.stop();
      Track.event('confidence_' + when, { answer: yes ? 'yes' : 'no', mission: 'engineer' });
      overlay.classList.remove('show');
      if (onDone) setTimeout(onDone, 250);
    }
    yesBtn.onclick = () => answer(true);
    noBtn.onclick  = () => answer(false);
  }

  // ===================================================================
  // BOOT
  // ===================================================================
  let greeted = false;
  function bootMission() {
    if (greeted) return;
    greeted = true;
    showConfidence('before', () => {
      ensureCtx();
      WONDA.play('wonda-eng-mission-start', {
        bubbleText: SECTION_LINES[1],
        fallbackText: SECTION_LINES[1]
      });
    });
  }

})();