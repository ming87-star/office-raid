(function (root) {
  "use strict";

  const DEFAULTS = Object.freeze({
    resetAfterMs: 30000,
    normalTaps: 3,
    complaintTaps: 2,
    finalTaps: 1
  });

  function nextTap(previous, now = Date.now(), options = {}) {
    const config = { ...DEFAULTS, ...options };
    const prior = previous && now - previous.lastTapAt < config.resetAfterMs
      ? previous
      : { count: 0, lastTapAt: 0 };
    const count = prior.count + 1;
    const complaintEnd = config.normalTaps + config.complaintTaps;
    const finalEnd = complaintEnd + config.finalTaps;
    const stage = count <= config.normalTaps
      ? "normal"
      : count <= complaintEnd
        ? "complaint"
        : count <= finalEnd
          ? "final"
          : "silent";
    return { count, lastTapAt: now, stage };
  }

  function pickFresh(lines, recent = [], randomValue = Math.random()) {
    const source = Array.isArray(lines) ? lines.filter(Boolean) : [];
    if (!source.length) return "";
    const recentSet = new Set(recent);
    const fresh = source.filter(line => !recentSet.has(line));
    const pool = fresh.length ? fresh : source;
    const index = Math.min(pool.length - 1, Math.floor(Math.max(0, randomValue) * pool.length));
    return pool[index];
  }

  const api = { DEFAULTS, nextTap, pickFresh };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.OfficeDialogueSystem = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
