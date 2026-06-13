/**
 * WonderLeap HMAC Bridge — Engineer mission
 * ─────────────────────────────────────────────────────────
 * Provides the same secure score submission used by the
 * Welcome, Unity Electrician and Cocos Cybersecurity games.
 *
 * When loaded inside the platform iFrame, MissionPlayPage.jsx
 * passes ?sessionId=&hmacSecret=&apiUrl=&skills= in the URL.
 * When opened standalone (no params), the bridge stays inert
 * and the game works normally with localStorage only.
 *
 * Match: identical signing pattern to /WonderLeapFC/Welcome's bridge —
 *   - signature lives in the JSON body (NOT in an X-Signature header)
 *   - signed string is `sessionId:score:stars:timeSpent:attempts:accuracy`
 *     joined with ':' (NOT the raw JSON body)
 *   - global exposed as window.WL_BRIDGE (NOT WONDERLEAP_BRIDGE)
 */
(function () {
  'use strict';

  const params    = new URLSearchParams(window.location.search);
  const sessionId = params.get('sessionId');
  const hmacSecret= params.get('hmacSecret');
  const apiUrl    = params.get('apiUrl');
  const skills    = params.get('skills')
    ? params.get('skills').split(',')
    : ['problem-solving', 'critical-thinking', 'creativity', 'planning'];

  // If no HMAC params, game is running standalone — skip bridge
  if (!sessionId || !hmacSecret || !apiUrl) {
    window.WL_BRIDGE = null;
    console.log('🎮 Engineer game running in standalone mode — score will NOT be saved.');
    return;
  }

  console.log('🔐 HMAC bridge active. Session:', sessionId);

  async function signScore(data) {
    const msg = [
      data.sessionId, data.score, data.stars,
      data.timeSpent, data.attempts, data.accuracy
    ].join(':');
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(hmacSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await crypto.subtle.sign(
      'HMAC', key, new TextEncoder().encode(msg)
    );
    return Array.from(new Uint8Array(sig))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async function submitScore(toolScore, totalRounds, timeSpentSec) {
    const score    = Math.round((toolScore / totalRounds) * 100);
    const stars    = score >= 90 ? 3 : score >= 60 ? 2 : score >= 30 ? 1 : 0;
    const accuracy = score;
    const attempts = 1;

    const data = {
      sessionId,
      score,
      stars,
      timeSpent: timeSpentSec,
      attempts,
      accuracy
    };

    try {
      data.signature = await signScore(data);

      const res = await fetch(apiUrl + '/mission-sessions/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log('[WL_BRIDGE] Score submitted:', result);
    } catch (err) {
      console.error('[WL_BRIDGE] Score submission failed:', err);
    }

    // Notify React parent — MissionPlayPage.jsx listens for this
    try {
      window.parent.postMessage({
        type: 'GAME_COMPLETE',
        success: true,
        score,
        stars,
        skillsMeasured: skills
      }, '*');
    } catch (e) {
      console.error('[WL_BRIDGE] postMessage failed:', e);
    }
  }

  window.WL_BRIDGE = { submitScore };
})();