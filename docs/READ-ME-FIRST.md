# READ ME FIRST — WonderLeap "embedded shareable" missions

This is the plain-English overview. It explains what these files are, how to
use them, and which document your developer needs. Two minutes, no tech needed.

---

## What an "embedded shareable" is

A mission named `…-shareable.html` (for example `engineer-shareable.html` or
`game-developer-shareable.html`) is **one single file with everything baked
inside it** — the game, the pictures, and **Maria's voice**.

Because the voice is built in, the file keeps Maria's warm Manchester accent
**even when it's emailed, zipped, or opened with no internet**. The older
versions kept the voice in a separate `audio/wonda` folder, and the voice was
lost (it went robotic) if that folder didn't travel with the file. The
shareable fixes that for good.

---

## How to use it — two situations

**1. You just want someone to PLAY it** (a parent, teacher, colleague, investor)
- Send them the single `…-shareable.html` file. That's it.
- They double-click it (or open it in any web browser). Maria's voice plays.
- No folders, no setup, no internet needed. Nothing else to send.

**2. You're handing it to a DEVELOPER to put on the WonderLeap website**
- Give them the matching **integration document** (see below).
- That document tells them exactly how to host it, link it into the platform,
  and connect the reporting/backend. Everything technical is in there.

---

## Which document does my developer need?

Each embedded mission has its own integration sheet. Hand over the one that
matches the file you're giving them:

| Mission file | Integration doc | Where it lives |
|---|---|---|
| `engineer-shareable.html` | `ENGINEER-SHAREABLE-INTEGRATION.md` | next to each Engineer shareable |
| `game-developer-shareable.html` | `GAME-DEVELOPER-SHAREABLE-INTEGRATION.md` | on the Desktop, next to the file |

Each integration doc already includes the **backend/reporting spec** (how the
mission sends events and downloadable child reports to a database), so it's the
only thing the developer needs.

---

## Do I also need a README for each one?

No. For playing the file, no instructions are needed at all — it just opens.
For a developer, the **integration doc is all that's required**. This page
exists only as a friendly cover sheet so anyone opening the folder understands
what they're looking at.

---

## The one thing to double-check

When the mission plays, **WONDA should speak in Maria's warm voice — not a
robotic computer voice.** If you ever hear the robotic voice, you're using the
plain version (the one that needs the separate audio folder), not the
`-shareable` file. Always send the `-shareable` one.

---
Questions: finneen@wonderleap.co.uk
