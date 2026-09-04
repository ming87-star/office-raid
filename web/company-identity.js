"use strict";

(function attachCompanyIdentity(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.OfficeRaidCompanyIdentity = api;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  const PALETTES = [
    { name: "네이비 골드", background: "#17364a", frame: "#d6a12c", symbol: "#fff6df", accent: "#168c8b" },
    { name: "틸 크림", background: "#168c8b", frame: "#fff0c2", symbol: "#17364a", accent: "#d6a12c" },
    { name: "코랄 잉크", background: "#c84b3c", frame: "#ffd9ae", symbol: "#fffaf0", accent: "#17364a" },
    { name: "블루 머스터드", background: "#4a70a8", frame: "#d6a12c", symbol: "#fffaf0", accent: "#17364a" },
    { name: "플럼 민트", background: "#805b87", frame: "#9ed4c5", symbol: "#fffaf0", accent: "#17364a" },
    { name: "포레스트 페이퍼", background: "#356a4a", frame: "#e7c76c", symbol: "#fffaf0", accent: "#17364a" }
  ];

  const FRAMES = [
    { id: "square", name: "사각" }, { id: "round", name: "라운드" },
    { id: "circle", name: "원형" }, { id: "ticket", name: "티켓" },
    { id: "double", name: "이중선" }, { id: "stamp", name: "도장" }
  ];

  const SYMBOLS = {
    manufacturing: [
      ["gear", "기어"], ["factory", "공장"], ["bolt", "볼트"], ["caliper", "측정"], ["wrench", "공구"],
      ["cube", "부품"], ["shield-check", "품질"], ["conveyor", "라인"], ["spark", "정밀"], ["layers", "공정"]
    ],
    commerce: [
      ["box", "상품"], ["cart", "카트"], ["tag", "태그"], ["truck", "배송"], ["store", "매장"],
      ["handshake", "계약"], ["bars", "매출"], ["megaphone", "홍보"], ["coins", "거래"], ["route", "유통"]
    ],
    it: [
      ["code", "코드"], ["cloud", "클라우드"], ["nodes", "네트워크"], ["chip", "칩"], ["window", "서비스"],
      ["cursor", "커서"], ["database", "데이터"], ["signal", "연결"], ["brackets", "개발"], ["loop", "자동화"]
    ]
  };

  function symbolList(industry) {
    return SYMBOLS[industry] || SYMBOLS.commerce;
  }

  function hash(value) {
    let result = 2166136261;
    for (const character of String(value || "")) {
      result ^= character.charCodeAt(0);
      result = Math.imul(result, 16777619);
    }
    return Math.abs(result >>> 0);
  }

  function normalize(logo, industry = "commerce", seed = "") {
    const source = logo && typeof logo === "object" ? logo : {};
    const seeded = hash(`${industry}|${seed}`);
    return {
      palette: Math.abs(Number.isInteger(source.palette) ? source.palette : seeded) % PALETTES.length,
      frame: Math.abs(Number.isInteger(source.frame) ? source.frame : Math.floor(seeded / 7)) % FRAMES.length,
      symbol: Math.abs(Number.isInteger(source.symbol) ? source.symbol : Math.floor(seeded / 31)) % symbolList(industry).length
    };
  }

  function random(industry = "commerce", randomValue = Math.random()) {
    const value = Math.max(0, Math.min(.999999, Number(randomValue) || 0));
    const salt = Math.floor(value * 1000000) + Date.now();
    return normalize(null, industry, salt);
  }

  function cycle(logo, part, delta, industry) {
    const next = normalize(logo, industry);
    const counts = { palette: PALETTES.length, frame: FRAMES.length, symbol: symbolList(industry).length };
    if (!counts[part]) return next;
    next[part] = (next[part] + Number(delta || 0) + counts[part]) % counts[part];
    return next;
  }

  function symbolName(logo, industry) {
    const value = normalize(logo, industry);
    return symbolList(industry)[value.symbol][1];
  }

  function roundedRect(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.roundRect(x, y, width, height, r);
  }

  function line(context, points, width, color, close = false) {
    context.beginPath();
    points.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
    if (close) context.closePath();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
  }

  function drawFrame(context, frame, palette, size) {
    const pad = size * .09;
    context.strokeStyle = palette.frame;
    context.lineWidth = Math.max(3, size * .055);
    if (frame === "circle" || frame === "stamp") {
      context.beginPath(); context.arc(size / 2, size / 2, size * .405, 0, Math.PI * 2); context.stroke();
      if (frame === "stamp") { context.setLineDash([size * .055, size * .035]); context.beginPath(); context.arc(size / 2, size / 2, size * .33, 0, Math.PI * 2); context.stroke(); context.setLineDash([]); }
      return;
    }
    const radius = frame === "round" ? size * .2 : frame === "ticket" ? size * .06 : size * .025;
    roundedRect(context, pad, pad, size - pad * 2, size - pad * 2, radius); context.stroke();
    if (frame === "double") { roundedRect(context, pad * 1.55, pad * 1.55, size - pad * 3.1, size - pad * 3.1, size * .02); context.stroke(); }
    if (frame === "ticket") {
      [[pad, size / 2], [size - pad, size / 2]].forEach(([x, y]) => { context.fillStyle = palette.background; context.beginPath(); context.arc(x, y, size * .06, 0, Math.PI * 2); context.fill(); });
    }
  }

  function drawSymbol(context, id, palette, size) {
    const c = size / 2, u = size / 10, color = palette.symbol, accent = palette.accent;
    context.fillStyle = color; context.strokeStyle = color; context.lineWidth = Math.max(3, size * .065); context.lineCap = "round"; context.lineJoin = "round";
    const stroke = points => line(context, points, context.lineWidth, color);
    if (["gear", "bolt", "spark"].includes(id)) {
      const points = Array.from({ length: id === "bolt" ? 6 : 12 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / (id === "bolt" ? 6 : 12); const r = (i % 2 || id === "bolt") ? u * 2.6 : u * 3.5; return [c + Math.cos(a) * r, c + Math.sin(a) * r]; });
      line(context, points, context.lineWidth, color, true); context.fillStyle = color; context.fill(); context.fillStyle = palette.background; context.beginPath(); context.arc(c, c, u * .8, 0, Math.PI * 2); context.fill();
    } else if (["factory", "store"].includes(id)) {
      context.fillRect(c - 3.2*u, c, 6.4*u, 2.7*u); context.beginPath(); context.moveTo(c-3.2*u,c); context.lineTo(c-3.2*u,c-2.7*u); context.lineTo(c-1.2*u,c-1.4*u); context.lineTo(c+.5*u,c-2.7*u); context.lineTo(c+2.2*u,c-1.4*u); context.lineTo(c+3.2*u,c-2.1*u); context.lineTo(c+3.2*u,c); context.fill(); context.fillStyle = accent; [-1.7,0,1.7].forEach(x=>context.fillRect(c+x*u,c+.7*u,.7*u,1.2*u));
    } else if (["caliper", "wrench"].includes(id)) {
      stroke([[c-2.8*u,c-2.4*u],[c+2.6*u,c+2.4*u]]); context.beginPath(); context.arc(c-2.6*u,c-2.5*u,1.25*u,.15*Math.PI,1.35*Math.PI); context.stroke(); context.fillStyle=color; context.beginPath(); context.arc(c+2.7*u,c+2.5*u,.9*u,0,Math.PI*2); context.fill(); context.fillStyle=palette.background; context.beginPath(); context.arc(c+2.7*u,c+2.5*u,.35*u,0,Math.PI*2); context.fill();
    } else if (["cube", "box", "layers"].includes(id)) {
      stroke([[c,c-3.2*u],[c+3*u,c-1.5*u],[c+3*u,c+2*u],[c,c+3.4*u],[c-3*u,c+2*u],[c-3*u,c-1.5*u],[c,c-3.2*u],[c,c+3.4*u],[c-3*u,c-1.5*u],[c,c],[c+3*u,c-1.5*u]]);
    } else if (id === "shield-check") {
      context.beginPath(); context.moveTo(c,c-3.5*u); context.lineTo(c+3*u,c-2.2*u); context.lineTo(c+2.4*u,c+1.7*u); context.quadraticCurveTo(c,c+3.7*u,c-2.4*u,c+1.7*u); context.lineTo(c-3*u,c-2.2*u); context.closePath(); context.fill(); line(context,[[c-1.4*u,c],[c-.3*u,c+1.1*u],[c+1.7*u,c-1.1*u]],u*.55,palette.background);
    } else if (["conveyor", "route", "nodes", "signal"].includes(id)) {
      stroke([[c-3*u,c+1.5*u],[c-1*u,c-.8*u],[c+1*u,c+.6*u],[c+3*u,c-2*u]]); [[-3,1.5],[-1,-.8],[1,.6],[3,-2]].forEach(([x,y],i)=>{context.fillStyle=i===3?accent:color;context.beginPath();context.arc(c+x*u,c+y*u,.75*u,0,Math.PI*2);context.fill();});
    } else if (id === "cart") {
      stroke([[c-3.2*u,c-2*u],[c-2.4*u,c-2*u],[c-1.7*u,c+1.2*u],[c+2.6*u,c+1.2*u],[c+3*u,c-1*u],[c-2.1*u,c-1*u]]); [-1.1,1.8].forEach(x=>{context.beginPath();context.arc(c+x*u,c+2.5*u,.65*u,0,Math.PI*2);context.fill();});
    } else if (id === "tag") {
      context.beginPath(); context.moveTo(c-3.3*u,c-2.5*u); context.lineTo(c+.8*u,c-2.5*u); context.lineTo(c+3.2*u,c); context.lineTo(c+.2*u,c+3*u); context.lineTo(c-3.3*u,c-.7*u); context.closePath(); context.fill(); context.fillStyle=palette.background; context.beginPath();context.arc(c-1.6*u,c-1.2*u,.5*u,0,Math.PI*2);context.fill();
    } else if (id === "truck") {
      context.fillRect(c-3.4*u,c-1.5*u,4.2*u,3*u); context.fillRect(c+.8*u,c-.4*u,2.1*u,1.9*u); stroke([[c+.8*u,c-.4*u],[c+1.5*u,c-1.5*u],[c+2.9*u,c-1.5*u]]); [-2,1.8].forEach(x=>{context.fillStyle=accent;context.beginPath();context.arc(c+x*u,c+2*u,.75*u,0,Math.PI*2);context.fill();});
    } else if (["handshake", "loop"].includes(id)) {
      context.beginPath();context.arc(c,c,2.8*u,.2*Math.PI,1.25*Math.PI);context.stroke();context.beginPath();context.arc(c,c,2.8*u,1.2*Math.PI,2.25*Math.PI);context.stroke(); stroke([[c-3.1*u,c-.1*u],[c-2.2*u,c-1*u]]); stroke([[c+3.1*u,c+.1*u],[c+2.2*u,c+1*u]]);
    } else if (["bars", "database"].includes(id)) {
      [-2.4,-.6,1.2].forEach((x,i)=>{context.fillStyle=i===2?accent:color;context.fillRect(c+x*u,c+(1-i)*u,1.2*u,(i+2)*u);});
    } else if (id === "megaphone") {
      context.beginPath();context.moveTo(c-3*u,c-1.1*u);context.lineTo(c+2.5*u,c-3*u);context.lineTo(c+2.5*u,c+2.4*u);context.lineTo(c-3*u,c+.8*u);context.closePath();context.fill();stroke([[c-1.4*u,c+1.2*u],[c-.8*u,c+3*u]]);
    } else if (["coins", "cloud"].includes(id)) {
      [-1.8,0,1.8].forEach((x,i)=>{context.beginPath();context.arc(c+x*u,c+(i%2?-.8:.5)*u,1.6*u,0,Math.PI*2);context.fill();}); context.fillRect(c-3*u,c,6*u,2*u);
    } else if (["code", "brackets"].includes(id)) {
      stroke([[c-1.3*u,c-2.7*u],[c-3.2*u,c],[c-1.3*u,c+2.7*u]]); stroke([[c+1.3*u,c-2.7*u],[c+3.2*u,c],[c+1.3*u,c+2.7*u]]); stroke([[c+.7*u,c-3*u],[c-.7*u,c+3*u]]);
    } else if (id === "chip") {
      context.fillRect(c-2.7*u,c-2.7*u,5.4*u,5.4*u); context.fillStyle=palette.background;context.fillRect(c-1.2*u,c-1.2*u,2.4*u,2.4*u); [-3.5,3.5].forEach(x=>[-1.8,0,1.8].forEach(y=>context.fillRect(c+x*u,c+(y-.25)*u,.8*u,.5*u)));
    } else if (id === "window") {
      context.fillRect(c-3.3*u,c-2.8*u,6.6*u,5.6*u); context.fillStyle=palette.background;context.fillRect(c-2.4*u,c-1.1*u,4.8*u,3.1*u);context.fillStyle=accent;[-2,-.8,.4].forEach(x=>{context.beginPath();context.arc(c+x*u,c-2*u,.28*u,0,Math.PI*2);context.fill();});
    } else if (id === "cursor") {
      context.beginPath();context.moveTo(c-2.5*u,c-3.2*u);context.lineTo(c+3*u,c+.4*u);context.lineTo(c+.5*u,c+1*u);context.lineTo(c+1.8*u,c+3.2*u);context.lineTo(c+.4*u,c+3.8*u);context.lineTo(c-.9*u,c+1.6*u);context.lineTo(c-2.5*u,c+3*u);context.closePath();context.fill();
    } else {
      context.beginPath(); context.arc(c,c,2.8*u,0,Math.PI*2); context.fill(); context.fillStyle=palette.background;context.beginPath();context.arc(c,c,1.2*u,0,Math.PI*2);context.fill();
    }
  }

  function draw(canvas, logo, industry = "commerce") {
    if (!canvas?.getContext) return;
    const value = normalize(logo, industry);
    const size = Math.max(32, Math.min(canvas.width || 96, canvas.height || 96));
    const context = canvas.getContext("2d");
    const palette = PALETTES[value.palette];
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = palette.background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawFrame(context, FRAMES[value.frame].id, palette, size);
    drawSymbol(context, symbolList(industry)[value.symbol][0], palette, size);
  }

  return { PALETTES, FRAMES, SYMBOLS, symbolList, normalize, random, cycle, symbolName, draw };
});
