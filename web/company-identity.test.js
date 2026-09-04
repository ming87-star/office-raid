"use strict";
const assert = require("node:assert/strict");
const identity = require("./company-identity.js");

assert.ok(identity.PALETTES.length >= 6);
identity.PALETTES.forEach(palette => {
  for (const key of ["background", "frame", "symbol", "accent"]) assert.match(palette[key], /^#[0-9a-f]{6}$/i);
  assert.equal(new Set([palette.background, palette.frame, palette.symbol]).size, 3, "logo layers must stay visually distinct");
});

const drawingContext = new Proxy({}, {
  get(target, key) {
    if (key in target) return target[key];
    if (typeof key === "symbol") return undefined;
    return () => {};
  },
  set(target, key, value) { target[key] = value; return true; }
});
const canvas = { width: 96, height: 96, getContext: () => drawingContext };

for (const industry of ["manufacturing", "commerce", "it"]) {
  assert.equal(identity.symbolList(industry).length, 10);
  assert.equal(new Set(identity.symbolList(industry).map(([id]) => id)).size, 10);
  const logo = identity.normalize(null, industry, "크레텍");
  assert.ok(logo.palette >= 0 && logo.palette < identity.PALETTES.length);
  assert.ok(logo.frame >= 0 && logo.frame < identity.FRAMES.length);
  assert.ok(logo.symbol >= 0 && logo.symbol < 10);
  assert.notDeepEqual(identity.cycle(logo, "symbol", 1, industry), logo);
  identity.symbolList(industry).forEach((_, symbol) => assert.doesNotThrow(() => identity.draw(canvas, { palette: 0, frame: symbol % identity.FRAMES.length, symbol }, industry)));
}
console.log("company identity tests passed");
