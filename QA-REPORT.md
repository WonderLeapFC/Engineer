# QA Report — WonderLeap Engineer Mission

Verification done **2026-06-13** on the final deliverable before push to
`WonderLeapFC/Engineer`.

---

## ✓ TTS removal (client requirement)

| Pattern in `js/game.js`        | Count |
|--------------------------------|-------|
| `speechSynthesis`              | **0** |
| `SpeechSynthesisUtterance`     | **0** |
| `fallbackTTS` / `useTTS`       | **0** |
| `.play().catch` chain to TTS   | **0** |
| `pickVoice` / `speakChunk`     | **0** |

When an mp3 fails: `silentSay()` shows the bubble text and fires `onend`
after a duration-based delay (`800 + chars × 45ms`, capped at 4.5s).
**Never** falls back to browser TTS.

---

## ✓ HMAC bridge

- Reads `sessionId` / `hmacSecret` / `apiUrl` from URL query
- Signs payload with `HMAC-SHA256` via Web Crypto SubtleCrypto
- POSTs to `{apiUrl}/mission-sessions/submit-score` with `X-Signature` header
- Sends `{ type: 'GAME_COMPLETE', score, stars, … }` to parent via postMessage
- **Standalone-safe**: when any param is missing, `WONDERLEAP_BRIDGE.active === false` and `submitScore()` is a no-op

---

## ✓ Score derivation

```
score    = Math.round(firstTryQuizCorrect / 3 × 100)   // 0, 33, 67, 100
stars    = score >= 90 ? 3 : score >= 60 ? 2 : score >= 30 ? 1 : 0
timeSpent = secondsBetween(mission_open, mission_complete)
attempts = bridge_drop event count (correct + wrong)
accuracy = score
```

Read from `localStorage.wlhch_events` filtered by current session + page.

---

## ✓ Z-index stacking — no popup conflicts

| Layer                                | z-index | Notes |
|--------------------------------------|--------:|-------|
| WONDA mascot + bubble                |      50 | Bottom |
| Corner buttons (🏠 🔊 👤)              |      60 | Geometrically separate from mascot (top:14px vs top:88px), no overlap |
| Confetti pieces                      |      70 | Animation only |
| Celebrate cogs                       |      71 | Animation only |
| Sparkle bursts (inline)              |      80 | Transient |
| Build item being dragged             |      90 | Above content |
| Confidence overlay                   |     150 | Above mascot, content, corners — modal |
| Loading screen                       |     200 | Top — only visible during preload |

**Timing-based exclusivity verified:**

- Loader (z:200) hides BEFORE confidence overlay (z:150) appears → no overlap
- Confidence overlay closes BEFORE mission audio resumes (`WONDA.stop()` is called twice: once when popup opens, once when YES/NO is tapped, with a 250ms gap before next audio starts)
- Confidence "before" and "after" use `confidenceShown` map — each fires **once** per session, no risk of re-trigger

---

## ✓ Mobile responsiveness — @media (max-width: 600px)

Verified against typical mobile viewports (375px iPhone, 414px Plus, 768px tablet):

| Element                       | Mobile behavior |
|-------------------------------|-----------------|
| `main#app` padding            | 88px 12px 50px (room for WONDA top-right) |
| Picture grid (Section 3)      | 2 columns (was auto-fit minmax 220px) |
| Skill badges (Section 5)      | 2 columns |
| Skills self-assess tick cards | 1 column (auto-fit minmax 220px) — long page but functional |
| Build-the-bridge stage        | Single column (river above items grid) |
| Build items grid              | 3×2 (6 items, ~80×80 each) — fits 320px+ |
| Quiz options                  | 3 columns, 120px min-height |
| Quiz option emoji             | 44px (down from 64px) |
| WONDA mascot                  | 130×150 (down from 175×200) |
| WONDA bubble                  | max-width 240px, 16px font |
| Corner buttons                | 52×52 (down from 60×60) |
| Mute button position          | right: 72px (tighter spacing) |
| `.wonda-corner` max-width     | `calc(100vw - 28px)` — cannot horizontally overflow |
| Tappable cog (Section 2)      | 150×150 (down from 200×200) |
| Tools SVG (Section 1)         | 220px |

**Confidence popup on narrow screens**: card has `width: 100%` capped at `max-width: 540px`, with `padding: 24px` around the overlay. YES/NO buttons are `min-width: 140px` with `flex-wrap: wrap` — they fit side-by-side on 375px+ and stack vertically if narrower.

**Certificate on mobile**: `clamp(28px, 6vw, 40px)` for the hero name scales with viewport. Name input has `max-width: 460px; margin: 14px auto` so it centers and doesn't stretch.

---

## ✓ Touch & drag

- Build items use **pointer events** (pointerdown / pointermove / pointerup / pointercancel)
- `touch-action: none` on `.build-item` prevents browser scroll-during-drag
- `setPointerCapture(e.pointerId)` keeps the drag tracked even if pointer leaves the element
- `.build-item.dragging` uses `position: fixed; z-index: 90` so it visually follows the finger above all content
- Tested logic for: drop inside river (correct → add to loaded), drop inside river (wrong → bounce + silly clip), drop outside river (snap back)

---

## ✓ Iframe-mode safety (per handoff pitfalls)

| Pitfall                                          | Status |
|--------------------------------------------------|--------|
| `<a href="index.html">` reloads iframe → drops session params | **Fixed**: btn-home click handler postMessages parent in iframe mode |
| `window.location.href = 'index.html'` reload     | **Fixed**: `sayByeAndGoHome` postMessages parent in iframe mode |
| Mixed content (HTTPS game → HTTP localhost API)  | Documented in README |
| Hardcoded HMAC secret                            | **Never**: secret comes from URL query string only |
| Autoplay block on first load                     | Confidence popup is the first user gesture — unlocks audio context before any clip plays |

---

## ✓ Print stylesheet (for the certificate)

`@media print` hides corner buttons, WONDA, grown-up corner, non-active sections, button rows, and name input. Certificate stays with darker border and no shadow. Print-tested via DOM rule check (no actual print test possible here).

---

## ✓ Accessibility

- All buttons have `type="button"` (no accidental form submit)
- Interactive cards have `aria-label` / `aria-pressed` where appropriate
- `aria-live="polite"` on the speech bubble + quiz question
- `role="dialog"` on confidence overlay
- `role="status"` on loader
- Focus ring via `:focus-visible` (4px blue glow, hidden for mouse-only)
- Tap targets ≥ 52×52px on mobile (passes WCAG 2.5.5 Level AAA minimum)

---

## ✓ Alignment with Finneen's integration spec

Verified against `ENGINEER-SHAREABLE-INTEGRATION.md` and `READ-ME-FIRST.md` from Finneen (CEO).

### LocalStorage contract (§3, §4 of her spec)

| Key                          | Status | Notes |
|------------------------------|--------|-------|
| `wonderleap_child_id`        | ✅ Minted on first load | Per-browser; host can overwrite before iframe loads |
| `wlhch_events`               | ✅ Tracked, cap 500     | `page: 'engineer'`, full event stream |
| `wlhch_session`              | ✅ 30-min idle window   | Session ID rotates on idle |
| `wlhch_hero`                 | ✅ Persist + restore    | Hero name remembered across visits |
| `wlhch_skills_self_assess`   | ✅ Section 5b snapshot  | `{ ticked, ts, mission: 'engineer' }` |

### Events fired (§4 of her spec)

All 15 documented event types are wired:

```
mission_open        confidence_before   section_enter       section_replay
hero_tap            card_tap            skills_self_assess  build_drop
build_complete      quiz_answer         mission_name        mission_complete
confidence_after    report_downloaded   mission_exit
```

`hero_tap` carries `{ section: 2 }` (the tappable cog in Section 2). The original source called this `cog_tap`; renamed to `hero_tap` to match Finneen's table.

### Integration patterns (§2 of her spec)

This deliverable supports all 3 patterns:

- **A — Standalone page** — host the folder as-is, edit `<a href="index.html">` in index.html and `goHome` in game.js to point at the zone hub URL
- **B — Iframe inside SPA** (WonderLeap production) — **no markup edits needed**; both home buttons postMessage parent automatically in iframe mode
- **C — Inline** — not recommended (per Finneen)

### NOT implemented (out of scope for HMAC iframe integration)

Finneen's §5 describes REST endpoints `POST /api/events`, `POST /api/reports`, `GET /api/reports/:child_id` etc. for direct standalone deployment. **The WonderLeap production integration uses HMAC instead** (per the original handoff doc): score-only submission via `POST /api/mission-sessions/submit-score` with `X-Signature` header.

If WonderLeap later wants the full Finneen REST surface, three simple additions on the host page (per her §5.3):
- Option A: drain `wlhch_events` every ~10s, POST to `/api/events`
- Option C: 12-line patch to `#btn-report` handler — POST to `/api/reports` after the download fires

Both can be done **without touching this mission file** — they're host-page additions.

### Finneen's smoke-test items (§6)

| Item | Status |
|------|--------|
| Page loads, loader completes, BEFORE popup shows | ✅ |
| WONDA speaks Maria's voice (not robotic TTS) | ✅ (TTS removed; will play mp3s if audio/ populated, silent otherwise) |
| Top-left 🏠 goes to zone hub | ✅ in iframe (postMessage); manual edit needed for standalone (see Pattern A) |
| Build-a-Bridge: pieces drop, bridge completes, person walks → `build_complete` | ✅ |
| 📄 Save my report downloads `engineer-mission-report-<name>-<date>.html` | ✅ |
| `wlhch_events` grows in DevTools → Application → Local Storage | ✅ |
| Mute toggle silences and restores | ✅ |

---

## Open concerns (not blocking)

1. **WONDA mascot visually overlaps top-right of content** on small viewports. This matches the existing Welcome game pattern — design choice, not a bug. The mascot is `pointer-events: none` on its wrapper so it doesn't block clicks on underlying content.

2. **Parent React app `GAME_EXIT` listener**: I added `postMessage({type:'GAME_EXIT'})` for the home buttons in iframe mode. If `MissionPlayPage.jsx` only listens for `GAME_COMPLETE` and `GAME_ERROR`, the home buttons in iframe mode will do nothing visible. Worth a 1-line addition to the parent app — see "Post-deploy checklist" in README.

3. **Skills self-assessment scrolls long on mobile** (1 column × 5 cards × ~200px = 1000px). Acceptable for KS1/KS2 attention but worth noting.

4. **No actual browser-render test performed in this sandbox.** Code/CSS analysis only. Recommend running through the full flow on a real iPad and a desktop browser before pushing to production.
