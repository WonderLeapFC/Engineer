# Integration — Engineer (Maria-embedded shareable)

For the file **`engineer-shareable.html`** — the self-contained version with
Maria's voice **baked in** (40 clips embedded as base64, ~5.9 MB).

This is the standard Engineer integration sheet, corrected for the embedded
build. Everything is the same **except the audio section** (the audio is inside
the file, so there's no folder to host). Mission ID throughout is `engineer`.

> Two versions exist — don't mix them up:
> - `engineer.html` (plain) → needs an external `audio/wonda/` folder. Use the full `docs/INTEGRATION.md`.
> - `engineer-shareable.html` (this one) → audio embedded, self-contained. Use **this** doc.

---

## 1. File contract — what it needs from its host

```
<your hosted folder>/
└── engineer-shareable.html      ← that's it. Nothing else.
```

- **No `audio/wonda/` folder needed.** All 40 Maria clips are embedded.
- Works the same whether emailed, zipped, opened from disk, or hosted.
- Any static host (Cloudflare Pages, Netlify, S3, nginx, Apache). HTTPS if
  embedded in another HTTPS page.
- No build step, no npm, no bundler. Drop and serve.
- The `audio/mpeg` Content-Type rule, the `AUDIO_PATH` constant, and the
  "MP3 404 / cache-bust on re-record" gotchas from `docs/INTEGRATION.md`
  **do not apply** here — there are no external MP3s.

If you ever re-record the Maria clips, you don't edit this file — you
regenerate the clips and rebuild the shareable (the embed sweep re-bakes them).

---

## 2. Integration pattern — pick one

### Option A — Standalone page (recommended for Phase 1)
Host at e.g. `https://wonderleap.co.uk/zones/stem/engineer/`.

Point these outbound links at your real zone URL (search `index.html`):

| Element | ID / selector | Currently goes to |
|---|---|---|
| Top-left 🏠 Home | `#btn-home` / first `a[href="index.html"]` | `index.html` |
| Mission-complete 🏠 Back to Zone | `#btn-home-2` | `index.html` |
| "Play again" | `#btn-replay-mission` | resets state — leave as-is |

### Option B — Iframe inside an SPA
Self-contained, so an iframe works unmodified:

```html
<iframe src="https://your-cdn/engineer-shareable.html"
        width="100%" height="900"
        sandbox="allow-scripts allow-same-origin allow-downloads"
        allow="autoplay"
        style="border:0"></iframe>
```
- `allow-scripts` — runs the mission JS
- `allow-same-origin` — localStorage (events, hero name)
- `allow-downloads` — the "📄 Save my report" download
- autoplay is unlocked by the loader's "tap to start" gesture

### Option C — Inline into your app
Not recommended (CSS/JS coupled to markup + IDs).

---

## 3. Identity — the `child_id` contract

- On first load the mission mints `localStorage.wonderleap_child_id`
  (e.g. `child-7a3b9c10`) — **per-browser**, not per-person.
- If your platform has logins, **overwrite that key with your account-scoped
  ID before the page loads** so reports/events join to a stable identity.
- All backend records key off `child_id`.

---

## 4. Events fired (measurement surface)

Logged to `localStorage.wlhch_events` (capped 500). Joins cleanly with the
Game Developer (and other) missions on `child_id` for cross-mission analytics.

| Event | When | `data` |
|---|---|---|
| `mission_open` | HTML loads | `{ mission: "engineer" }` |
| `confidence_before` | BEFORE popup answered | `{ answer: "yes"\|"no", mission }` |
| `section_enter` | Each section active | `{ section: 1..8 \| "skills" }` |
| `section_replay` | "Hear it again" | `{ section }` |
| `hero_tap` | Tappable hero (Sec 1 & 2) | `{ section }` |
| `card_tap` | Sec 3 pic / Sec 4 story / Sec 5 skill | `{ card, category }` |
| `skills_self_assess` | Sec 5b done | `{ ticked, ticked_count, total_options: 5, correct_count }` |
| `build_drop` | Bridge piece dropped | `{ item, correct }` |
| `build_complete` | All correct pieces placed (bridge built) | `null` |
| `quiz_answer` | Quiz answered | `{ q: 1..3, correct, choice }` |
| `mission_name` | Name typed on cert | `{ name }` |
| `mission_complete` | Reached Sec 8 | `{ mission: "engineer" }` |
| `confidence_after` | AFTER popup answered | `{ answer, mission }` |
| `report_downloaded` | 📄 Save my report | `{ mission: "engineer" }` |
| `mission_exit` | Home from cert | `null` |

Other localStorage keys: `wlhch_hero` (first name on cert),
`wlhch_skills_self_assess` (`{ ticked:[...], ts, mission:"engineer" }`).
Engineer's 5 skills: Thinking / Clever / Patience / Creative / Problem Solver.
Mini-game = **Build-a-Bridge** (drop the correct pieces across the river; a
walking person crosses when complete).

---

## 5. Backend — events + downloadable reports

(See full content in source doc — REST endpoint surface for direct integration.
For the WonderLeap iframe integration this folder ships, scoring goes through
the HMAC bridge in `js/hmac-bridge.js` and POSTs to
`/api/mission-sessions/submit-score`; the REST endpoints below are not used.)

---

## 6. Smoke-test after deploy
- [ ] Page loads, loader completes, BEFORE popup shows.
- [ ] **WONDA speaks in Maria's warm Manchester voice — not robotic TTS.**
      (If robotic, you're hosting the *plain* file, not this embedded one.)
- [ ] Top-left 🏠 goes to your zone hub (not the pack's `index.html`).
- [ ] Build-a-Bridge: correct pieces drop across the river; bridge completes
      and the person walks across → `build_complete`.
- [ ] "📄 Save my report" downloads `engineer-mission-report-<name>-<date>.html`.
- [ ] `wlhch_events` grows in DevTools → Application → Local Storage.
- [ ] If wired: events/report arrive at the backend.
- [ ] Mute toggle (top-right) silences and restores the voice.

---
Created for Finneen — `engineer-shareable.html` (STEM & Future Tech Labs zone).
Audio embedded; same contract as the Game Developer shareable.
