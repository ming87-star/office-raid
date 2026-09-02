const fs = require("fs");
const path = require("path");

const root = __dirname;
const report = fs.readFileSync(path.join(root, "project-report.js"), "utf8");
const style = fs.readFileSync(path.join(root, "project-report.css"), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(report.includes('class="project-report-avatar"'), "Report portraits must use a clipping frame.");
assert(report.includes('data-portrait-crop="face"'), "Report portraits must use the face crop.");
assert(/\.project-report-avatar\s*\{[^}]*overflow:\s*hidden/s.test(style), "Report portrait frame must clip overflow.");
assert(/\.project-report-avatar\s+:is\(canvas,\s*\.character-svg\)\s*\{[^}]*overflow:\s*hidden/s.test(style), "Mounted SVG portraits must clip overflow.");

console.log("Project report portrait layout checks passed.");
