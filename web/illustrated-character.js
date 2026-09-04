(function (global) {
  "use strict";

  const COUNTS = { face: 8, skin: 6, hair: 16, eyes: 10, eyebrows: 8, nose: 8, mouth: 10, top: 12, bottom: 8, accessory: 9 };
  const COSMETICS = ["없음", "둥근 안경", "각진 안경", "작은 귀걸이", "머리핀", "주근깨", "점", "눈썹 포인트", "볼터치"];
  const SKINS = [
    { base: "#f0b777", light: "#ffd19a", shade: "#c77b4f" },
    { base: "#dfa066", light: "#f2bd82", shade: "#b56a47" },
    { base: "#c88355", light: "#e3a36d", shade: "#96533c" },
    { base: "#ad6b49", light: "#ce895d", shade: "#814333" },
    { base: "#88513c", light: "#aa6a4b", shade: "#61352e" },
    { base: "#694132", light: "#895841", shade: "#472b27" }
  ];
  const HAIRS = ["#102634", "#4b332e", "#7a4a31", "#b67732", "#642d45", "#203f50"];
  const TOPS = ["#17364a", "#187f7d", "#c89127", "#805b87", "#b94b3b", "#5e6e79", "#356a4a", "#be684d", "#4b5f91", "#8f4d67", "#3d5d68", "#685842"];
  const BOTTOMS = ["#30383e", "#6c5848", "#354f4d", "#4f485d", "#56626b", "#67483e", "#354f69", "#66535c"];
  const INK = "#122d3d";
  const PAPER = "#fff6df";
  let renderId = 0;

  function shade(hex, amount) {
    const value = parseInt(hex.slice(1), 16);
    const channel = function (shift) { return Math.max(0, Math.min(255, ((value >> shift) & 255) + amount)).toString(16).padStart(2, "0"); };
    return "#" + channel(16) + channel(8) + channel(0);
  }

  function normalize(member) {
    const source = member && member.appearance ? member.appearance : {};
    const legacy = Number.isFinite(source.outfit) ? source.outfit : 0;
    const result = {};
    Object.keys(COUNTS).forEach(function (key) {
      let value = source[key];
      if (key === "top" && !Number.isFinite(value)) value = legacy;
      if (key === "bottom" && !Number.isFinite(value)) value = Math.floor(legacy / 2);
      result[key] = Math.abs(Number(value) || 0) % COUNTS[key];
    });
    return result;
  }

  function facePath(index) {
    return [
      "M48 45 C47 68 49 85 61 96 C70 104 90 104 99 96 C111 85 113 68 112 45 C103 31 57 31 48 45Z",
      "M49 43 C46 63 49 84 61 98 C70 108 90 108 99 98 C111 84 114 63 111 43 C101 30 59 30 49 43Z",
      "M46 46 C46 68 50 86 63 96 C72 102 88 102 97 96 C110 86 114 68 114 46 C104 32 56 32 46 46Z",
      "M50 42 C45 65 51 86 65 99 C74 108 87 108 96 99 C109 86 115 65 110 42 C99 30 61 30 50 42Z",
      "M47 45 C47 69 52 88 68 99 C75 104 85 104 92 99 C108 88 113 69 113 45 C102 31 58 31 47 45Z",
      "M49 44 C45 61 47 83 59 96 C69 108 91 108 101 96 C113 83 115 61 111 44 C101 30 59 30 49 44Z",
      "M45 47 C44 68 48 84 60 94 C70 103 90 103 100 94 C112 84 116 68 115 47 C105 31 55 31 45 47Z",
      "M51 42 C47 62 50 83 62 97 C70 106 90 106 98 97 C110 83 113 62 109 42 C99 31 61 31 51 42Z"
    ][index % 8];
  }

  function hairBack(look, hair) {
    const style = look.hair % 8;
    const paths = [
      "M44 58 C37 31 55 17 80 17 C108 17 124 34 116 64 C112 81 101 91 95 96 L64 96 C52 85 46 72 44 58Z",
      "M43 58 C37 36 47 20 73 17 C103 13 123 29 118 61 C115 78 105 89 96 96 L63 94 C50 84 45 71 43 58Z",
      "M42 60 C35 44 42 29 55 22 C64 12 79 16 85 20 C99 13 119 27 120 45 C126 60 115 83 99 96 L61 95 C50 86 44 74 42 60Z",
      "M45 55 C42 27 62 16 83 18 C106 20 120 34 114 62 C111 78 103 90 94 97 L66 97 C55 87 48 72 45 55Z"
    ];
    return '<g data-layer="hair-back"><path d="' + paths[Math.floor(style / 2) % 4] + '" fill="' + hair + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><path d="M54 41 C65 24 94 21 108 40" fill="none" stroke="' + shade(hair, 38) + '" stroke-width="4" stroke-linecap="round" opacity=".62"/><path d="M59 33 Q71 24 81 25 M91 26 Q101 30 108 40" fill="none" stroke="' + shade(hair, 62) + '" stroke-width="2" stroke-linecap="round" opacity=".42"/></g>';
  }

  function hairFront(look, hair) {
    const paths = [
      "M45 53 C40 30 58 16 80 18 C104 18 120 31 116 54 C109 46 103 39 98 37 C94 49 89 56 83 60 C83 49 79 43 76 39 C69 51 61 57 50 59Z",
      "M44 54 C39 31 56 18 78 18 C101 17 120 31 116 53 C101 48 91 39 84 31 C79 45 67 56 49 60Z",
      "M43 56 C36 42 43 27 58 22 C63 14 79 18 84 23 C94 14 113 25 118 40 C123 51 117 59 113 63 C105 48 96 43 90 40 C88 50 83 58 78 63 C73 50 65 43 58 42 C56 51 51 57 46 61Z",
      "M45 52 C45 28 63 18 81 18 C101 18 116 29 116 51 C107 45 99 42 91 39 C88 51 78 58 67 61 C68 49 64 42 58 37 C55 48 51 54 45 58Z",
      "M43 55 C39 35 51 20 76 18 C103 16 119 31 117 53 C108 44 99 38 89 36 C82 47 72 55 55 60Z",
      "M44 55 C36 39 48 21 64 21 C73 14 84 18 88 24 C102 17 118 29 119 45 C120 56 115 61 111 64 C104 50 96 44 88 41 C83 54 75 60 68 62 C65 50 59 44 53 43 C52 51 49 57 44 61Z",
      "M46 52 C44 31 58 17 82 18 C104 18 118 31 115 54 C105 49 96 43 90 36 C85 46 78 54 69 59 C67 48 62 42 56 38 C54 46 51 52 46 57Z",
      "M43 55 C40 32 55 18 78 18 C104 16 120 30 117 54 C108 47 99 42 90 38 C84 51 74 58 62 61 C61 49 56 43 49 40 C48 47 46 53 43 58Z"
    ];
    return '<g data-layer="hair-front"><path d="' + paths[look.hair % 8] + '" fill="' + hair + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><path d="M58 33 Q70 23 82 24 M91 26 Q102 30 108 38" fill="none" stroke="' + shade(hair, 44) + '" stroke-width="3" stroke-linecap="round" opacity=".7"/><path d="M62 28 Q70 22 78 23 M88 24 Q98 27 104 34" fill="none" stroke="' + shade(hair, 68) + '" stroke-width="1.7" stroke-linecap="round" opacity=".4"/></g>';
  }

  function femaleHairBack(look, hair) {
    const style = look.hair % 8;
    const shapes = [
      "M42 57 C36 31 53 15 79 15 C107 15 124 33 118 63 L115 104 Q102 115 93 104 L63 104 Q48 111 44 96Z",
      "M42 57 C36 30 53 15 79 15 C107 15 124 32 118 62 Q115 83 104 99 Q98 108 91 99 L66 99 Q55 108 47 94Z",
      "M43 58 C36 33 52 16 78 16 C106 15 122 32 118 60 Q126 71 119 88 Q111 98 100 91 L62 99 Q47 92 44 76Z",
      "M43 56 C38 31 54 16 80 16 C108 16 122 34 117 61 L113 91 Q103 107 93 98 L65 98 Q51 105 45 91Z"
    ];
    let extra = "";
    if (style === 2 || style === 6) extra = '<path d="M111 47 Q133 59 121 91 Q116 104 105 96 Q113 76 103 56Z" fill="' + hair + '" stroke="' + INK + '" stroke-width="4"/>';
    if (style === 3 || style === 7) extra = '<circle cx="109" cy="31" r="15" fill="' + hair + '" stroke="' + INK + '" stroke-width="4"/><path d="M101 28 Q110 20 118 29" fill="none" stroke="' + shade(hair, 42) + '" stroke-width="3"/>';
    return '<g data-layer="hair-back">' + extra + '<path d="' + shapes[Math.floor(style / 2) % 4] + '" fill="' + hair + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><path d="M53 39 Q70 20 105 36" fill="none" stroke="' + shade(hair, 44) + '" stroke-width="3" stroke-linecap="round" opacity=".62"/></g>';
  }

  function femaleHairFront(look, hair) {
    const paths = [
      "M43 55 C38 31 55 16 79 16 C104 16 121 31 117 54 C105 47 97 39 92 31 C87 46 78 57 67 62 C66 49 61 41 54 37 C52 47 49 54 43 60Z",
      "M43 55 C38 31 55 16 80 16 C106 16 122 31 117 55 C105 51 95 42 87 31 C82 46 69 58 48 62Z",
      "M43 56 C37 35 51 18 77 16 C104 14 121 30 118 54 C108 45 98 39 88 35 C82 49 72 58 58 62Z",
      "M44 54 C41 30 57 16 81 17 C105 17 120 31 116 54 C105 48 96 42 89 34 C84 48 75 57 64 61 C63 49 57 42 50 40Z"
    ];
    const fringe = paths[Math.floor((look.hair % 8) / 2) % 4];
    return '<g data-layer="hair-front"><path d="' + fringe + '" fill="' + hair + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><path d="M57 32 Q70 21 83 23 M91 25 Q101 29 108 37" fill="none" stroke="' + shade(hair, 48) + '" stroke-width="3" stroke-linecap="round" opacity=".68"/></g>';
  }

  function eyebrows(look, hair) {
    const color = shade(hair, -20);
    const variants = [
      "M61 63 Q66 60 72 63 M88 63 Q94 60 99 63",
      "M60 63 Q66 59 72 62 M88 62 Q94 59 100 63",
      "M61 61 L72 63 M88 63 L99 61",
      "M61 63 L72 61 M88 61 L99 63",
      "M62 63 Q67 61 71 63 M89 63 Q94 61 98 63",
      "M59 63 Q66 58 73 62 M87 62 Q94 58 101 63",
      "M61 62 Q66 59 72 61 M88 61 Q94 59 99 62",
      "M61 62 L66 60 L72 62 M88 62 L94 60 L99 62"
    ];
    return '<path d="' + variants[look.eyebrows % 8] + '" fill="none" stroke="' + color + '" stroke-width="' + (look.eyebrows % 2 ? 3.2 : 2.6) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function eyes(look) {
    const i = look.eyes % 10;
    if (i === 2) return '<path d="M61 70 Q67 64 73 70 M87 70 Q93 64 99 70" fill="none" stroke="' + INK + '" stroke-width="3.6" stroke-linecap="round"/>';
    if (i === 3) return '<path d="M61 68 L72 70 M88 70 L99 68" fill="none" stroke="' + INK + '" stroke-width="3.3" stroke-linecap="round"/><circle cx="68" cy="69" r="2.7" fill="' + INK + '"/><circle cx="92" cy="69" r="2.7" fill="' + INK + '"/>';
    if (i === 4) return '<path d="M61 69 Q67 73 73 69 M87 69 Q93 73 99 69" fill="none" stroke="' + INK + '" stroke-width="3.3" stroke-linecap="round"/>';
    if (i === 6) return '<path d="M61 69 Q67 66 73 69 M87 69 Q93 66 99 69" fill="none" stroke="' + INK + '" stroke-width="3.2" stroke-linecap="round"/>';
    if (i === 7) return '<path d="M61 68 Q67 63 73 68 M87 68 Q93 63 99 68" fill="none" stroke="' + INK + '" stroke-width="3.2" stroke-linecap="round"/><circle cx="68" cy="69" r="2.4" fill="' + INK + '"/><circle cx="92" cy="69" r="2.4" fill="' + INK + '"/>';
    const rx = i === 1 || i === 5 ? 5.6 : i === 8 ? 3.5 : i === 9 ? 6 : 4.4;
    const ry = i === 1 || i === 9 ? 6.2 : i === 5 ? 5.2 : 4.5;
    return '<ellipse cx="67" cy="69" rx="' + rx + '" ry="' + ry + '" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.6"/><ellipse cx="93" cy="69" rx="' + rx + '" ry="' + ry + '" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.6"/><circle cx="68" cy="70" r="2.8" fill="' + INK + '"/><circle cx="94" cy="70" r="2.8" fill="' + INK + '"/><circle cx="69" cy="68.5" r="1" fill="#fff"/><circle cx="95" cy="68.5" r="1" fill="#fff"/>';
  }

  function nose(look, skin) {
    const paths = ["M80 73 Q77 79 81 80", "M79 73 Q83 78 79 81", "M80 72 V80", "M77 80 Q80 82 83 80", "M78 76 Q76 81 82 81", "M82 76 Q84 81 78 81", "M78 80 L80 76 L83 80", "M77 80 Q80 78 84 80"];
    return '<path d="' + paths[look.nose % 8] + '" fill="none" stroke="' + skin.shade + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".78"/>';
  }

  function mouth(look) {
    const paths = [
      "M73 86 Q80 91 87 86", "M75 87 Q80 88 85 87", "M71 85 Q80 94 89 85",
      "M72 87 Q80 83 88 87", "M74 85 Q80 89 86 85", "M72 85 Q80 93 88 85 Q80 88 72 85Z",
      "M74 85 Q80 92 86 85", "M76 87 H84", "M72 86 Q80 90 88 86", "M75 84 Q80 93 85 84"
    ];
    const closed = look.mouth % 10 === 5;
    return '<path d="' + paths[look.mouth % 10] + '" fill="' + (closed ? PAPER : "none") + '" stroke="#783f32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function cosmetic(look, skin, back) {
    const i = look.accessory % 9;
    if (i === 0) return "";
    if (i === 1 && !back) return '<g data-layer="cosmetic"><circle cx="67" cy="69" r="9" fill="none" stroke="#315a72" stroke-width="2.5"/><circle cx="93" cy="69" r="9" fill="none" stroke="#315a72" stroke-width="2.5"/><path d="M76 69 H84 M58 68 L49 66 M102 68 L111 66" stroke="#315a72" stroke-width="2.5"/></g>';
    if (i === 2 && !back) return '<g data-layer="cosmetic"><rect x="58" y="61" width="18" height="15" rx="3" fill="none" stroke="' + INK + '" stroke-width="2.5"/><rect x="84" y="61" width="18" height="15" rx="3" fill="none" stroke="' + INK + '" stroke-width="2.5"/><path d="M76 68 H84" stroke="' + INK + '" stroke-width="2.5"/></g>';
    if (i === 3) return '<g data-layer="cosmetic"><circle cx="47" cy="78" r="3" fill="#d6a12c" stroke="' + INK + '" stroke-width="1.5"/><circle cx="113" cy="78" r="3" fill="#d6a12c" stroke="' + INK + '" stroke-width="1.5"/></g>';
    if (i === 4) return '<g data-layer="cosmetic"><path d="M103 36 L115 31" stroke="#c95743" stroke-width="4" stroke-linecap="round"/><circle cx="110" cy="33" r="2" fill="#fff3b4"/></g>';
    if (i === 5 && !back) return '<g data-layer="cosmetic" fill="#a96049" opacity=".72"><circle cx="59" cy="80" r="1.2"/><circle cx="64" cy="82" r="1.2"/><circle cx="101" cy="80" r="1.2"/><circle cx="96" cy="82" r="1.2"/></g>';
    if (i === 6 && !back) return '<circle data-layer="cosmetic" cx="101" cy="80" r="1.8" fill="#704033"/>';
    if (i === 7 && !back) return '<path data-layer="cosmetic" d="M66 59 L69 64" stroke="' + skin.base + '" stroke-width="2.6" stroke-linecap="round"/>';
    if (i === 8 && !back) return '<g data-layer="cosmetic" fill="#dc6f65" opacity=".28"><ellipse cx="57" cy="80" rx="8" ry="4"/><ellipse cx="103" cy="80" rx="8" ry="4"/></g>';
    return "";
  }

  function frontBody(look, skin) {
    const top = TOPS[look.top % TOPS.length];
    const dark = shade(top, -32);
    const light = shade(top, 34);
    const bottom = BOTTOMS[look.bottom % BOTTOMS.length];
    const style = look.top % 4;
    let detail = "";
    if (style === 0) detail = '<path d="M61 109 L77 126 L68 147 L53 112 M99 109 L83 126 L92 147 L107 112" fill="' + dark + '" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round"/><path d="M69 108 L80 122 L91 108" fill="none" stroke="#e3c797" stroke-width="2"/>';
    if (style === 1) detail = '<path d="M64 109 Q80 125 96 109 M80 124 V179" fill="none" stroke="' + light + '" stroke-width="3"/><circle cx="84" cy="143" r="2" fill="#e5c66c"/><circle cx="84" cy="160" r="2" fill="#e5c66c"/>';
    if (style === 2) detail = '<path d="M61 111 Q80 124 99 111" fill="none" stroke="' + light + '" stroke-width="5"/><path d="M57 132 H103" stroke="' + dark + '" stroke-width="3" opacity=".55"/>';
    if (style === 3) detail = '<path d="M67 108 L80 123 L93 108 M80 123 V178" fill="none" stroke="#e3c797" stroke-width="2.4"/><circle cx="84" cy="141" r="1.7" fill="' + dark + '"/><circle cx="84" cy="157" r="1.7" fill="' + dark + '"/>';
    return '<g data-layer="body"><path d="M58 174 L76 174 L74 222 L51 222 Q50 214 55 207Z" fill="' + bottom + '" stroke="' + INK + '" stroke-width="4"/><path d="M84 174 L102 174 L109 207 Q112 215 109 222 L86 222Z" fill="' + bottom + '" stroke="' + INK + '" stroke-width="4"/><path d="M48 220 Q60 214 75 219 L74 231 L46 231 Q43 226 48 220Z" fill="#18242b" stroke="' + INK + '" stroke-width="4"/><path d="M86 219 Q101 214 112 220 Q117 227 112 231 L86 231Z" fill="#18242b" stroke="' + INK + '" stroke-width="4"/><path d="M49 226 Q61 222 71 225 M89 225 Q101 222 111 226" fill="none" stroke="#526a77" stroke-width="2" opacity=".7"/><path d="M61 103 Q46 107 42 127 L36 170 Q39 178 49 176 L57 143 L59 180 Q80 187 101 180 L103 143 L111 176 Q121 178 124 170 L118 127 Q114 107 99 103Z" fill="' + top + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' + detail + '<path d="M52 126 Q48 145 48 163 M108 126 Q112 145 112 163 M62 176 Q80 181 98 176" fill="none" stroke="' + light + '" stroke-width="2.2" stroke-linecap="round" opacity=".58"/><path d="M37 166 Q42 163 50 167 L49 181 Q40 186 34 177Z M110 167 Q118 163 123 168 L126 177 Q120 186 111 181Z" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="3"/><path d="M38 174 Q42 177 47 175 M113 175 Q118 177 122 173" fill="none" stroke="' + skin.shade + '" stroke-width="1.7" opacity=".75"/><path d="M69 96 L70 110 Q80 118 90 110 L91 96Z" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="4"/></g>';
  }

  function femaleFrontBody(look, skin) {
    const top = TOPS[look.top % TOPS.length];
    const dark = shade(top, -32), light = shade(top, 36), bottom = BOTTOMS[look.bottom % BOTTOMS.length];
    const skirt = look.bottom % 3 === 1;
    const legs = skirt
      ? '<path d="M58 167 Q80 177 102 167 L108 194 L52 194Z" fill="' + bottom + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><path d="M64 191 V220 M96 191 V220" fill="none" stroke="' + INK + '" stroke-width="14" stroke-linecap="round"/><path d="M64 191 V220 M96 191 V220" fill="none" stroke="' + skin.base + '" stroke-width="10" stroke-linecap="round"/><path d="M48 219 Q61 214 74 219 L73 231 L46 231 Q43 226 48 219Z M86 219 Q99 214 112 220 Q116 226 112 231 L87 231Z" fill="#18242b" stroke="' + INK + '" stroke-width="4"/>'
      : '<path d="M59 171 L77 171 L75 220 L51 220 Q49 211 55 204Z M83 171 L101 171 L107 204 Q112 213 108 220 L85 220Z" fill="' + bottom + '" stroke="' + INK + '" stroke-width="4"/><path d="M47 219 Q61 214 75 219 L74 231 L45 231Z M85 219 Q101 214 113 221 L111 231 L86 231Z" fill="#18242b" stroke="' + INK + '" stroke-width="4"/>';
    return '<g data-layer="body">' + legs + '<path d="M62 103 Q49 107 45 126 L39 167 Q42 176 51 173 L59 143 L61 175 Q80 182 99 175 L101 143 L109 173 Q118 176 121 167 L115 126 Q111 107 98 103Z" fill="' + top + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/><path d="M67 106 Q80 121 93 106 M80 121 V171" fill="none" stroke="' + light + '" stroke-width="3"/><path d="M72 107 L80 120 L88 107" fill="' + (look.top % 2 ? dark : "#fff2d5") + '" stroke="' + INK + '" stroke-width="2"/><path d="M40 165 Q45 162 52 166 L50 180 Q42 185 36 176Z M108 166 Q116 162 122 167 L125 176 Q119 185 110 180Z" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="3"/><path d="M70 96 L71 109 Q80 116 89 109 L90 96Z" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="4"/></g>';
  }

  function backBody(look, skin) {
    const top = TOPS[look.top % TOPS.length];
    const light = shade(top, 34);
    const bottom = BOTTOMS[look.bottom % BOTTOMS.length];
    return '<g data-layer="body"><path d="M58 174 L76 174 L74 222 L51 222 Q50 214 55 207Z M84 174 L102 174 L109 207 Q112 215 109 222 L86 222Z" fill="' + bottom + '" stroke="' + INK + '" stroke-width="4"/><path d="M48 220 Q60 214 75 219 L74 231 L46 231 Q43 226 48 220Z M86 219 Q101 214 112 220 Q117 227 112 231 L86 231Z" fill="#18242b" stroke="' + INK + '" stroke-width="4"/><path d="M61 103 Q46 107 42 127 L36 170 Q39 178 49 176 L57 143 L59 180 Q80 187 101 180 L103 143 L111 176 Q121 178 124 170 L118 127 Q114 107 99 103Z" fill="' + top + '" stroke="' + INK + '" stroke-width="4"/><path d="M60 108 Q80 118 100 108 M57 126 Q51 146 50 164 M103 126 Q109 146 110 164 M60 174 Q80 181 100 174" fill="none" stroke="' + light + '" stroke-width="2.3" stroke-linecap="round" opacity=".62"/><path d="M37 166 Q42 163 50 167 L49 181 Q40 186 34 177Z M110 167 Q118 163 123 168 L126 177 Q120 186 111 181Z" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="3"/><path d="M69 94 L70 110 Q80 117 90 110 L91 94Z" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="4"/></g>';
  }

  function femaleBackBody(look, skin) {
    const top = TOPS[look.top % TOPS.length], light = shade(top, 34), bottom = BOTTOMS[look.bottom % BOTTOMS.length];
    const skirt = look.bottom % 3 === 1;
    const legs = skirt
      ? '<path d="M58 168 Q80 177 102 168 L108 194 L52 194Z" fill="' + bottom + '" stroke="' + INK + '" stroke-width="4"/><path d="M64 191 V220 M96 191 V220" fill="none" stroke="' + INK + '" stroke-width="14" stroke-linecap="round"/><path d="M64 191 V220 M96 191 V220" fill="none" stroke="' + skin.base + '" stroke-width="10" stroke-linecap="round"/><path d="M48 219 Q61 214 74 219 L73 231 L46 231 Q43 226 48 219Z M86 219 Q99 214 112 220 Q116 226 112 231 L87 231Z" fill="#18242b" stroke="' + INK + '" stroke-width="4"/>'
      : '<path d="M59 171 L77 171 L75 220 L51 220 Q49 211 55 204Z M83 171 L101 171 L107 204 Q112 213 108 220 L85 220Z" fill="' + bottom + '" stroke="' + INK + '" stroke-width="4"/><path d="M47 219 Q61 214 75 219 L74 231 L45 231Z M85 219 Q101 214 113 221 L111 231 L86 231Z" fill="#18242b" stroke="' + INK + '" stroke-width="4"/>';
    return '<g data-layer="body">' + legs + '<path d="M62 103 Q49 107 45 126 L39 167 Q42 176 51 173 L59 143 L61 175 Q80 182 99 175 L101 143 L109 173 Q118 176 121 167 L115 126 Q111 107 98 103Z" fill="' + top + '" stroke="' + INK + '" stroke-width="4"/><path d="M62 110 Q80 119 98 110 M61 171 Q80 178 99 171" fill="none" stroke="' + light + '" stroke-width="2.5" opacity=".62"/><path d="M40 165 Q45 162 52 166 L50 180 Q42 185 36 176Z M108 166 Q116 162 122 167 L125 176 Q119 185 110 180Z" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="3"/><path d="M70 95 L71 109 Q80 116 89 109 L90 95Z" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="4"/></g>';
  }

  function frontHead(look, skin, hair, female) {
    const backHair = female ? femaleHairBack(look, hair) : hairBack(look, hair);
    const frontHair = female ? femaleHairFront(look, hair) : hairFront(look, hair);
    return backHair + '<g data-layer="face"><ellipse cx="47" cy="67" rx="8" ry="12" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="3.5"/><ellipse cx="113" cy="67" rx="8" ry="12" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="3.5"/><path d="' + facePath(look.face) + '" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="4"/><path d="M53 49 Q59 36 79 34 Q99 35 107 50" fill="none" stroke="' + skin.light + '" stroke-width="8" stroke-linecap="round" opacity=".5"/><path d="M104 47 Q112 67 104 84 Q98 95 86 99 Q105 99 111 83 Q116 64 110 48Z" fill="' + skin.shade + '" opacity=".16"/>' + eyebrows(look, hair) + eyes(look) + nose(look, skin) + mouth(look) + '</g>' + frontHair + cosmetic(look, skin, false);
  }

  function backHead(look, skin, hair, female) {
    return '<g data-layer="face-back"><ellipse cx="47" cy="67" rx="8" ry="12" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="3.5"/><ellipse cx="113" cy="67" rx="8" ry="12" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="3.5"/><path d="' + facePath(look.face) + '" fill="' + skin.base + '" stroke="' + INK + '" stroke-width="4"/></g>' + (female ? femaleHairBack(look, hair) : hairBack(look, hair)) + cosmetic(look, skin, true);
  }

  function render(member, direction, faceCrop) {
    const look = normalize(member);
    const skin = SKINS[look.skin];
    const hair = HAIRS[Math.floor(look.hair / 3) % HAIRS.length];
    const back = direction === "back";
    const female = member?.gender === "female";
    const contents = back
      ? (female ? femaleBackBody(look, skin) : backBody(look, skin)) + backHead(look, skin, hair, female)
      : (female ? femaleFrontBody(look, skin) : frontBody(look, skin)) + frontHead(look, skin, hair, female);
    const viewBox = faceCrop ? "34 18 92 104" : "22 10 116 228";
    renderId += 1;
    return '<svg class="character-svg" width="48" height="48" viewBox="' + viewBox + '" preserveAspectRatio="xMidYMid meet" role="img" data-render-id="' + renderId + '">' + contents + '</svg>';
  }

  function mount(target, member, direction, faceCrop) {
    if (!target || !target.parentNode) return null;
    const template = document.createElement("template");
    template.innerHTML = render(member, direction || "front", Boolean(faceCrop)).trim();
    const replacement = template.content.firstElementChild;
    Array.from(target.attributes).forEach(function (attribute) {
      if (attribute.name === "width" || attribute.name === "height") return;
      if (attribute.name === "class") attribute.value.split(/\s+/).filter(Boolean).forEach(function (name) { replacement.classList.add(name); });
      else replacement.setAttribute(attribute.name, attribute.value);
    });
    replacement.setAttribute("width", "48");
    replacement.setAttribute("height", "48");
    target.replaceWith(replacement);
    return replacement;
  }

  global.OfficeRaidCharacter = { counts: COUNTS, cosmetics: COSMETICS, normalize: normalize, render: render, mount: mount };
})(window);
