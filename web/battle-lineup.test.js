const fs = require("fs");
const path = require("path");

const root = __dirname;
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const game = fs.readFileSync(path.join(root, "game.js"), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const teamRule = css.match(/\.battle-team\s*\{([\s\S]*?)\n\}/)?.[1] || "";
assert(teamRule.includes("left: 50%"), "Battle team must be anchored to the arena center.");
assert(teamRule.includes("transform: translateX(-50%)"), "Battle team must be centered around its anchor.");
assert(teamRule.includes("repeat(var(--team-count), minmax(0, 1fr))"), "Battle team must use a single row with one column per member.");

for (let count = 1; count <= 6; count += 1) {
  const rule = css.match(new RegExp(`\\.battle-team\\.team-size-${count}\\s*\\{([^}]*)\\}`))?.[1] || "";
  assert(rule.includes(`--team-count: ${count}`), `Team size ${count} must set its own column count.`);
  assert(rule.includes("--team-width:"), `Team size ${count} must set a centered formation width.`);
}

assert(!/team-size-5[^}]*repeat\(3|team-size-6[^}]*repeat\(3/.test(css), "Five- and six-person teams must not wrap into three columns.");
assert(game.includes("battle-team team-size-${team.length}"), "Battle renderer must expose the live team size to CSS.");

console.log("Battle lineup regression checks passed.");
