# WonderLeap — Engineer Mission ("Build the Bridge")

Self-contained static site for the **Engineer** mission on
[wonderleap.co.uk](https://wonderleap.co.uk). Renders inside an iframe
on the WonderLeap platform and submits scores to the backend via an
HMAC-signed POST. Falls back to fully-playable standalone mode when
opened without session parameters.

**Zone:** STEM & Future Tech Labs
**Skills measured:** Problem Solving, Critical Thinking, Creativity, Planning
**Careers:** Engineer, Civil Engineer

---

## ⚠️ Add your audio files before deploying

This bundle does NOT include the 40 mp3 files (they're 4.3 MB and live
on your machine from the `extract.js` step). Before pushing to GitHub:

```
engineer/
└── audio/
    ├── audio_000.mp3
    ├── audio_001.mp3
    ├── …
    └── audio_039.mp3
```

Copy the `audio/` folder from `extracted/audio/` into this folder.
The mapping from clip names to file paths is hard-coded in
`window.__WONDA_EMBED` at the top of `js/game.js`.

---

## Folder layout

```
engineer/
├── index.html              # Game entry point
├── css/
│   └── styles.css          # GAME styles only (report CSS lives in game.js)
├── js/
│   ├── hmac-bridge.js      # Loaded FIRST — wires window.WONDERLEAP_BRIDGE
│   └── game.js             # Mission logic, no TTS, with inlined report CSS
├── audio/                  # ← copy from extracted/audio/ before deploying
│   └── audio_000.mp3 .. audio_039.mp3
├── package.json
├── render.yaml
├── .gitignore
└── README.md
```

`hmac-bridge.js` MUST load before `game.js` (already wired this way in
`index.html`). The game's `celebrate()` function calls
`window.WONDERLEAP_BRIDGE.submitScore(...)` when the certificate
appears.

---

## Bug fixed in this version: styles.css split

The original `extract.js` regex for `<style>` blocks was greedy and
matched the `<style>` tag that lived **inside the JS template literal**
for `generateEngineerReport()`. As a result:

- `css/styles.css` ended up with TWO CSS blocks separated by
  `/* === next block === */`
- The second block was report-page CSS, not game CSS
- That block's `.section` rule overrode the game's `.section { display: none; }`
  rule — sections would render incorrectly
- The downloaded report HTML had no `<style>` tag at all — looked unstyled

This bundle fixes that:

- `css/styles.css` contains **only the game CSS** (first block)
- The report CSS is **inlined back into `generateEngineerReport()`**
  in `js/game.js` (search for `<title>WonderLeap — Engineer Mission Report`
  to find it)
- Downloaded reports now render with their intended styling

If you ever re-run `extract.js`, fix the `<style>` regex first to
ignore matches inside `<script>` blocks, or run the script-extraction
step before the style-extraction step.

---

## Local dev

```bash
npm start   # serves on http://localhost:5173
```

To test the HMAC flow end-to-end against the local backend:

```
http://localhost:5173/?sessionId=test123&hmacSecret=devsecret&apiUrl=http://localhost:5000/api
```

Without query params the game runs standalone — no score submission,
everything else works.

---

## Score formula

```
score   = round(firstTryCorrectQuizAnswers / 3 * 100)   // 0, 33, 67, 100
stars   = score >= 90 ? 3 : score >= 60 ? 2 : score >= 30 ? 1 : 0
attempts = bridgeCorrectDrops + bridgeWrongDrops
timeSpent = secondsBetween(mission_open, mission_complete)
accuracy = score
badgesEarned = []  // no per-mission badges defined yet
```

Bridge completion isn't weighted — Section 8 is unreachable without
it, so completing the bridge is implicit in any submission.

The 3 quiz questions:
1. What does an engineer build over a river? *(bridge / pizza / balloon)*
2. Which one is an engineer's tool? *(spanner / banana / hat)*
3. Do engineers solve problems and build things? *(YES / NO)*

First-try answers are captured from the per-session event stream in
`localStorage` under `wlhch_events`.

---

## TTS removal

Per client requirement, **all browser TTS code has been stripped**:

- `window.speechSynthesis` — removed
- `SpeechSynthesisUtterance` — removed
- `pickVoice()`, `speakChunk()`, `speakOnly()` — removed
- `VOICE_BLACKLIST`, voice loader — removed
- `voiceschanged` event listener — removed

When an mp3 fails to load or `audio.play()` is blocked, the game shows
the speech bubble text silently and continues the chain via a
duration-based timeout. **It never falls back to browser TTS.**

Verify with:

```bash
grep -c "speechSynthesis\|SpeechSynthesisUtterance" js/game.js
# → 0
```

---

## Deploy to Render

1. Drop the audio files into `engineer/audio/` (see top of this file)
2. Push the folder to `github.com/WonderLeapFC/Engineer`
3. On Render: **New → Static Site → Connect repo**
4. Render reads `render.yaml` automatically — no extra config needed
5. Note the deployed URL (e.g. `https://wonderleap-engineer-xxxx.onrender.com`)

---

## Post-deploy checklist

1. **Backend CORS** — append the Render URL to `CORS_ORIGINS` env on
   the `wonderleap-main-cb3w` service:

   ```
   …,https://wonderleap-engineer-xxxx.onrender.com
   ```

   Save → wait for redeploy.

2. **MongoDB** — update the Engineer mission document:

   ```js
   db.missions.updateOne(
     { slug: "build-the-bridge" },
     { $set: { gameUrl: "https://wonderleap-engineer-xxxx.onrender.com" } }
   )
   ```

3. **End-to-end test** — log in as a student → STEM & Future Tech Labs
   → Build the Bridge → play through → confirm:
   - Score submits (backend logs)
   - Results page shows correct skill level
   - Dashboard updates
   - **No robotic TTS voice anywhere**

---

## Tracking events (localStorage `wlhch_events`)

| Event                  | Data                                |
|------------------------|-------------------------------------|
| `mission_open`         | `{ mission: 'engineer' }`           |
| `section_enter`        | `{ section: 1..8 \| 'skills' }`     |
| `confidence_before`    | `{ answer: 'yes' \| 'no' }`         |
| `confidence_after`     | `{ answer: 'yes' \| 'no' }`         |
| `cog_tap`              | `null`                              |
| `card_tap`             | `{ card, category }`                |
| `skills_self_assess`   | `{ ticked, ticked_count, … }`       |
| `build_drop`           | `{ item, correct }`                 |
| `build_complete`       | `null`                              |
| `quiz_answer`          | `{ q: 1..3, correct, choice }`      |
| `mission_complete`     | `{ mission: 'engineer' }`           |
| `section_replay`       | `{ section }`                       |
| `report_downloaded`    | `{ mission: 'engineer' }`           |
| `mission_exit`         | `null`                              |

---

## Authorship

- Game design + recordings: **Finneen Bradley** (CEO, WonderLeap)
- Integration build: GoExalt System LLP, June 2026
