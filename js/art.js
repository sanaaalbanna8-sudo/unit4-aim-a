(function () {
  "use strict";

  const C = {
    teal: "#2dd4bf", amber: "#fbbf24", vio: "#a78bfa", vio2: "#8b5cf6", rose: "#fb7185",
    sky: "#38bdf8", lime: "#a3e635", ink: "#e8ecff", mute: "#8e9bc4", bg: "#080c1c", panel: "#121a3a"
  };
  const BG = C.bg;

  function e(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }
  function f(c, o) { return 'fill="' + c + '" fill-opacity="' + (o == null ? 0.16 : o) + '"'; }

  /* أيقونات بمربع 48 */
  const I = {
    phone: function (c) { return '<rect x="14" y="4" width="20" height="40" rx="4" ' + f(c) + '/><path d="M21 38h6"/>'; },
    laptop: function (c) { return '<rect x="9" y="10" width="30" height="21" rx="2" ' + f(c) + '/><path d="M4 36h40l-3 5H7z"/>'; },
    server: function (c) { return '<rect x="8" y="6" width="32" height="15" rx="3" ' + f(c) + '/><rect x="8" y="27" width="32" height="15" rx="3" ' + f(c) + '/><path d="M14 13.5h.1M14 34.5h.1M22 13.5h12M22 34.5h12"/>'; },
    cloud: function (c) { return '<path d="M15 38a9 9 0 0 1-1-18 12 12 0 0 1 23-2 9 9 0 0 1-1 20z" ' + f(c) + '/>'; },
    game: function (c) { return '<rect x="5" y="14" width="38" height="22" rx="11" ' + f(c) + '/><path d="M14 21v8M10 25h8"/><circle cx="31" cy="22" r="1.8" fill="' + c + '"/><circle cx="36" cy="27" r="1.8" fill="' + c + '"/>'; },
    music: function (c) { return '<path d="M18 36V10l20-4v26"/><circle cx="13" cy="36" r="5" ' + f(c, 0.4) + '/><circle cx="33" cy="32" r="5" ' + f(c, 0.4) + '/>'; },
    book: function (c) { return '<path d="M24 12c-5-4-12-4-18-2v28c6-2 13-2 18 2 5-4 12-4 18-2V10c-6-2-13-2-18 2z" ' + f(c) + '/><path d="M24 12v28"/>'; },
    chart: function (c) { return '<path d="M6 42h36"/><rect x="10" y="26" width="6" height="14" ' + f(c, 0.4) + '/><rect x="21" y="16" width="6" height="24" ' + f(c, 0.4) + '/><rect x="32" y="8" width="6" height="32" ' + f(c, 0.4) + '/>'; },
    shield: function (c) { return '<path d="M24 4l16 6v12c0 10-7 17-16 22C15 39 8 32 8 22V10z" ' + f(c) + '/><path d="M17 24l5 5 9-10"/>'; },
    truck: function (c) { return '<rect x="3" y="12" width="25" height="20" rx="2" ' + f(c) + '/><path d="M28 18h8l7 8v6H28z" ' + f(c) + '/><circle cx="12" cy="36" r="4" fill="' + BG + '"/><circle cx="35" cy="36" r="4" fill="' + BG + '"/>'; },
    robot: function (c) { return '<rect x="10" y="14" width="28" height="22" rx="6" ' + f(c) + '/><circle cx="18" cy="25" r="3"/><circle cx="30" cy="25" r="3"/><path d="M24 14V8M19 42h10M5 22v8M43 22v8"/><circle cx="24" cy="6" r="2" fill="' + c + '"/>'; },
    chat: function (c) { return '<path d="M6 9h36v23H20l-9 8v-8H6z" ' + f(c) + '/><path d="M13 18h22M13 24h14"/>'; },
    search: function (c) { return '<circle cx="20" cy="20" r="12" ' + f(c) + '/><path d="M29 29l12 12"/>'; },
    cpu: function (c) { return '<rect x="12" y="12" width="24" height="24" rx="3" ' + f(c) + '/><rect x="19" y="19" width="10" height="10"/><path d="M18 5v7M24 5v7M30 5v7M18 36v7M24 36v7M30 36v7M5 18h7M5 24h7M5 30h7M36 18h7M36 24h7M36 30h7"/>'; },
    file: function (c) { return '<path d="M11 4h17l10 10v30H11z" ' + f(c) + '/><path d="M28 4v10h10M17 24h15M17 31h15M17 38h9"/>'; },
    db: function (c) { return '<ellipse cx="24" cy="10" rx="15" ry="5" ' + f(c, 0.3) + '/><path d="M9 10v28c0 3 7 5 15 5s15-2 15-5V10M9 24c0 3 7 5 15 5s15-2 15-5"/>'; },
    clock: function (c) { return '<circle cx="24" cy="24" r="18" ' + f(c) + '/><path d="M24 13v11l7 5"/>'; },
    lock: function (c) { return '<rect x="10" y="21" width="28" height="21" rx="4" ' + f(c) + '/><path d="M16 21v-6a8 8 0 0 1 16 0v6M24 29v5"/>'; },
    unlock: function (c) { return '<rect x="10" y="21" width="28" height="21" rx="4" ' + f(c) + '/><path d="M16 21v-6a8 8 0 0 1 15-4M24 29v5"/>'; },
    user: function (c) { return '<circle cx="24" cy="15" r="8" ' + f(c) + '/><path d="M8 42c2-9 8-13 16-13s14 4 16 13"/>'; },
    users: function (c) { return '<circle cx="18" cy="16" r="7" ' + f(c) + '/><circle cx="33" cy="18" r="6" ' + f(c) + '/><path d="M4 42c2-8 7-12 14-12s12 4 14 12M30 30c6 0 11 3 14 10"/>'; },
    store: function (c) { return '<path d="M5 18l5-11h28l5 11z" ' + f(c, 0.35) + '/><path d="M8 18v24h32V18M20 42V30h8v12"/>'; },
    car: function (c) { return '<path d="M5 31v-7l6-9h22l8 9h2v7z" ' + f(c, 0.3) + '/><path d="M13 23h24"/><circle cx="14" cy="33" r="4" fill="' + BG + '"/><circle cx="34" cy="33" r="4" fill="' + BG + '"/>'; },
    taxi: function (c) { return I.car(c) + '<rect x="19" y="9" width="10" height="5" rx="1" fill="' + c + '"/>'; },
    bus: function (c) { return '<rect x="5" y="9" width="38" height="25" rx="4" ' + f(c, 0.3) + '/><path d="M5 20h38M15 9v11M24 9v11M33 9v11"/><circle cx="13" cy="36" r="4" fill="' + BG + '"/><circle cx="35" cy="36" r="4" fill="' + BG + '"/>'; },
    plate: function (c) { return '<ellipse cx="24" cy="35" rx="18" ry="5" ' + f(c, 0.3) + '/><ellipse cx="24" cy="27" rx="18" ry="5" ' + f(c, 0.3) + '/><ellipse cx="24" cy="19" rx="18" ry="5" ' + f(c, 0.3) + '/>'; },
    bug: function (c) { return '<ellipse cx="24" cy="27" rx="9" ry="12" ' + f(c, 0.3) + '/><path d="M24 15v24M15 22l-7-4M15 29H7M15 35l-7 4M33 22l7-4M33 29h8M33 35l7 4M20 15l-3-6M28 15l3-6"/>'; },
    gear: function (c) { return '<circle cx="24" cy="24" r="16" stroke-width="6" stroke-dasharray="6.2 6.4"/><circle cx="24" cy="24" r="11" ' + f(c, 0.3) + '/><circle cx="24" cy="24" r="4"/>'; },
    bolt: function (c) { return '<path d="M27 4L10 27h12l-3 17 19-25H26z" ' + f(c, 0.35) + '/>'; },
    globe: function (c) { return '<circle cx="24" cy="24" r="18" ' + f(c) + '/><path d="M6 24h36M24 6c-7 8-7 28 0 36M24 6c7 8 7 28 0 36"/>'; },
    code: function () { return '<path d="M17 14L7 24l10 10M31 14l10 10-10 10M27 10l-6 28"/>'; },
    window: function (c) { return '<rect x="5" y="8" width="38" height="32" rx="4" ' + f(c) + '/><path d="M5 16h38"/><circle cx="10" cy="12" r="1" fill="' + c + '"/><circle cx="14" cy="12" r="1" fill="' + c + '"/><path d="M12 24h12M12 30h20"/>'; },
    terminal: function (c) { return '<rect x="5" y="8" width="38" height="32" rx="4" ' + f(c) + '/><path d="M12 20l6 5-6 5M22 31h12"/>'; },
    key: function (c) { return '<circle cx="15" cy="24" r="8" ' + f(c) + '/><path d="M23 24h20M37 24v6M42 24v5"/>'; },
    warn: function (c) { return '<path d="M24 5l20 36H4z" ' + f(c) + '/><path d="M24 18v11M24 35v.5"/>'; },
    check: function (c) { return '<circle cx="24" cy="24" r="18" ' + f(c) + '/><path d="M15 24l6 6 12-13"/>'; },
    cross: function (c) { return '<circle cx="24" cy="24" r="18" ' + f(c) + '/><path d="M17 17l14 14M31 17L17 31"/>'; },
    money: function (c) { return '<rect x="4" y="13" width="40" height="22" rx="3" ' + f(c) + '/><circle cx="24" cy="24" r="5"/><path d="M10 19v.1M38 29v.1"/>'; },
    box: function (c) { return '<path d="M24 4l18 9v22l-18 9-18-9V13z" ' + f(c) + '/><path d="M6 13l18 9 18-9M24 22v22"/>'; },
    factory: function (c) { return '<path d="M4 42V22l10 6v-6l10 6v-6l10 6V8h8v34z" ' + f(c) + '/><path d="M11 36h4M21 36h4M31 36h4"/>'; },
    pick: function (c) { return '<path d="M8 17Q24 3 40 17" stroke-width="4"/><path d="M24 10l-4 34" stroke-width="4"/>'; },
    eye: function (c) { return '<path d="M3 24c6-10 13-14 21-14s15 4 21 14c-6 10-13 14-21 14S9 34 3 24z" ' + f(c) + '/><circle cx="24" cy="24" r="6"/>'; },
    bulb: function (c) { return '<path d="M24 5a13 13 0 0 0-8 23c2 2 3 4 3 7h10c0-3 1-5 3-7A13 13 0 0 0 24 5z" ' + f(c, 0.3) + '/><path d="M19 40h10M21 44h6"/>'; },
    paint: function (c) { return '<rect x="7" y="6" width="28" height="11" rx="3" ' + f(c, 0.4) + '/><path d="M35 11h6v10H24v7M22 28h4v15h-4z"/>'; },
    pot: function (c) { return '<path d="M8 20h32v13a9 9 0 0 1-9 9H17a9 9 0 0 1-9-9z" ' + f(c) + '/><path d="M3 20h42M18 20v-3h12v3M17 12c0-3 3-3 3-6M25 12c0-3 3-3 3-6M33 12c0-3 3-3 3-6"/>'; },
    receipt: function (c) { return '<path d="M10 4h28v40l-5-4-5 4-4-4-5 4-5-4-4 4z" ' + f(c) + '/><path d="M16 14h16M16 21h16M16 28h10"/>'; },
    printer: function (c) { return '<rect x="5" y="18" width="38" height="16" rx="3" ' + f(c) + '/><path d="M13 18V6h22v12M13 29h22v13H13z"/>'; },
    plane: function (c) { return '<path d="M24 4c2 0 3 3 3 6v10l15 8v4l-15-4v8l5 4v3l-8-2-8 2v-3l5-4v-8L6 32v-4l15-8V10c0-3 1-6 3-6z" ' + f(c) + '/>'; },
    traffic: function (c) { return '<rect x="15" y="3" width="18" height="38" rx="6" ' + f(c) + '/><circle cx="24" cy="12" r="4" fill="' + C.rose + '"/><circle cx="24" cy="22" r="4" fill="' + C.amber + '"/><circle cx="24" cy="32" r="4" fill="' + C.teal + '"/><path d="M24 41v5"/>'; },
    hand: function (c) { return '<path d="M13 5l23 21-10 1 6 12-5 2-6-12-8 7z" ' + f(c, 0.3) + '/>'; },
    wrench: function (c) { return '<path d="M30 5a10 10 0 0 0-9 13L5 34l8 8 16-16a10 10 0 0 0 13-9l-6 6-6-2-2-6z" ' + f(c) + '/>'; },
    moth: function (c) { return '<path d="M24 15v22"/><path d="M24 19c-6-11-19-11-19 0s11 10 19 4c8 6 19 7 19-4s-13-11-19 0z" ' + f(c, 0.3) + '/><path d="M22 13l-4-7M26 13l4-7"/>'; },
    tag: function (c) { return '<path d="M5 5h18l20 20-18 18L5 23z" ' + f(c) + '/><circle cx="14" cy="14" r="3"/>'; },
    star: function (c) { return '<path d="M24 4l6 13 14 2-10 10 2 14-12-7-12 7 2-14L4 19l14-2z" ' + f(c, 0.3) + '/>'; },
    heart: function (c) { return '<path d="M24 42S5 30 5 17a10 10 0 0 1 19-4 10 10 0 0 1 19 4c0 13-19 25-19 25z" ' + f(c, 0.3) + '/>'; },
    blueprint: function (c) { return '<rect x="6" y="6" width="36" height="36" rx="3" ' + f(c) + '/><path d="M6 16h36M13 24h22M13 31h15" stroke-dasharray="3 3"/>'; },
    folder: function (c) { return '<path d="M4 11h15l4 5h21v24H4z" ' + f(c) + '/>'; },
    pin: function (c) { return '<path d="M24 44S8 28 8 18a16 16 0 0 1 32 0c0 10-16 26-16 26z" ' + f(c) + '/><circle cx="24" cy="18" r="6"/>'; },
    bread: function (c) { return '<path d="M5 27c0-10 8-15 19-15s19 5 19 15v11H5z" ' + f(c, 0.3) + '/><path d="M15 19l2 6M24 17v7M33 19l-2 6"/>'; },
    cup: function (c) { return '<path d="M8 16h26v12a10 10 0 0 1-10 10h-6A10 10 0 0 1 8 28z" ' + f(c) + '/><path d="M34 20h4a5 5 0 0 1 0 10h-4M16 10c0-3 3-3 3-6M24 10c0-3 3-3 3-6"/>'; },
    wall: function (c) { return '<rect x="4" y="8" width="40" height="32" ' + f(c) + '/><path d="M4 18h40M4 29h40M16 8v10M32 8v10M24 18v11M10 29v11M38 29v11"/>'; },
    loop: function () { return '<path d="M39 19a16 16 0 1 0 2 11"/><path d="M41 8v11H30"/>'; },
    scale: function (c) { return '<path d="M24 6v34M14 42h20M8 14h32"/><path d="M8 14l-5 12h10zM40 14l-5 12h10z" ' + f(c, 0.35) + '/>'; },
    calc: function (c) { return '<rect x="10" y="4" width="28" height="40" rx="4" ' + f(c) + '/><rect x="15" y="9" width="18" height="8"/><path d="M17 25h.1M24 25h.1M31 25h.1M17 32h.1M24 32h.1M31 32h.1M17 39h.1M24 39h.1M31 39h.1" stroke-width="4"/>'; },
    sun: function (c) { return '<circle cx="24" cy="24" r="9" ' + f(c, 0.4) + '/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M38 10l-4 4M14 34l-4 4"/>'; },
    ticket: function (c) { return '<path d="M4 14h40v7a3 3 0 0 0 0 6v7H4v-7a3 3 0 0 0 0-6z" ' + f(c) + '/><path d="M31 14v20" stroke-dasharray="3 3"/>'; },
    door: function (c) { return '<rect x="11" y="4" width="26" height="40" rx="2" ' + f(c) + '/><circle cx="31" cy="25" r="2" fill="' + c + '"/>'; },
    mail: function (c) { return '<rect x="4" y="10" width="40" height="28" rx="3" ' + f(c) + '/><path d="M4 12l20 14 20-14"/>'; },
    layers: function (c) { return '<path d="M24 6l19 9-19 9-19-9z" ' + f(c, 0.3) + '/><path d="M5 24l19 9 19-9M5 33l19 9 19-9"/>'; },
    brush: function (c) { return '<path d="M38 5L19 26l4 4L43 10z" ' + f(c) + '/><path d="M19 26c-6 0-9 4-9 9 0 3-2 5-5 6 8 2 18 0 18-11"/>'; },
    team: function (c) { return I.users(c); },
    access: function (c) { return '<circle cx="24" cy="8" r="4" ' + f(c, 0.4) + '/><path d="M9 16l15 3 15-3M24 19v10l-7 14M24 29l7 14"/>'; },
    speaker: function (c) { return '<path d="M6 18v12h8l10 8V10L14 18z" ' + f(c, 0.3) + '/><path d="M31 17a9 9 0 0 1 0 14M36 12a16 16 0 0 1 0 24"/>'; },
    target: function (c) { return '<circle cx="24" cy="24" r="18" ' + f(c) + '/><circle cx="24" cy="24" r="11"/><circle cx="24" cy="24" r="4" fill="' + c + '"/>'; },
    filter: function (c) { return '<path d="M5 7h38L28 25v14l-8 5V25z" ' + f(c) + '/>'; },
    trash: function (c) { return '<path d="M10 13h28l-3 30H13z" ' + f(c) + '/><path d="M6 13h36M18 13V7h12v6M20 20v16M28 20v16"/>'; },
    shoe: function (c) { return '<path d="M4 34V20h10l6 6 14 3c6 1 10 3 10 8v3H4z" ' + f(c, 0.3) + '/>'; },
    bag: function (c) { return '<path d="M8 16h32l-3 28H11z" ' + f(c) + '/><path d="M17 16v-4a7 7 0 0 1 14 0v4"/>'; },
    route: function (c) { return '<circle cx="10" cy="38" r="5" ' + f(c, 0.4) + '/><circle cx="38" cy="10" r="5" ' + f(c, 0.4) + '/><path d="M14 35c10-6 2-15 12-18s8-2 8-2" stroke-dasharray="4 4"/>'; },
    plug: function (c) { return '<path d="M16 4v10M32 4v10M10 14h28v8a14 14 0 0 1-28 0z" ' + f(c) + '/><path d="M24 36v8"/>'; },
    chip: function (c) { return I.cpu(c); },
    sparkle: function (c) { return '<path d="M24 4c2 10 6 14 16 16-10 2-14 6-16 16-2-10-6-14-16-16 10-2 14-6 16-16z" ' + f(c, 0.35) + '/>'; },
    question: function (c) { return '<circle cx="24" cy="24" r="18" ' + f(c) + '/><path d="M18 19a6 6 0 1 1 9 5c-2 1-3 2-3 5M24 34v.5"/>'; },
    meat: function (c) { return '<path d="M10 30c-6-8 2-22 14-22s20 9 16 18-14 10-20 8l-6 8-6-4z" ' + f(c, 0.3) + '/>'; },
    sheep: function (c) { return '<ellipse cx="22" cy="24" rx="15" ry="11" ' + f(c, 0.3) + '/><circle cx="38" cy="21" r="5"/><path d="M14 35v7M28 35v7"/>'; }
  };

  function icon(name, x, y, size, color, cls) {
    const draw = I[name] || I.question;
    const s = (size || 48) / 48;
    return '<g class="' + (cls || "") + '"><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g fill="none" stroke="' + (color || C.teal) + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">' + draw(color || C.teal) + '</g></g></g>';
  }

  function text(x, y, str, o) {
    o = o || {};
    const en = !!o.en;
    const anchorMap = en ? { right: "end", left: "start", middle: "middle" } : { right: "start", left: "end", middle: "middle" };
    const anchor = anchorMap[o.anchor || "middle"];
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + anchor + '"' + (en ? ' direction="ltr" class="en ' + (o.cls || "") + '"' : ' direction="rtl" class="' + (o.cls || "") + '"') +
      ' font-size="' + (o.size || 16) + '" font-weight="' + (o.weight || 600) + '" fill="' + (o.color || C.ink) + '"' + (o.opacity ? ' opacity="' + o.opacity + '"' : "") + '>' + e(str) + '</text>';
  }

  function box(x, y, w, h, c, o) {
    o = o || {};
    return '<rect class="' + (o.cls || "") + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.r == null ? 16 : o.r) + '" fill="' + (o.fill || c) + '" fill-opacity="' + (o.fo == null ? 0.12 : o.fo) + '" stroke="' + c + '" stroke-opacity="' + (o.so == null ? 0.6 : o.so) + '" stroke-width="' + (o.sw || 1.6) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : "") + '/>';
  }

  function arrow(x1, y1, x2, y2, c, o) {
    o = o || {};
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const h = o.head || 10;
    const ax = x2 - h * Math.cos(ang - 0.45);
    const ay = y2 - h * Math.sin(ang - 0.45);
    const bx = x2 - h * Math.cos(ang + 0.45);
    const by = y2 - h * Math.sin(ang + 0.45);
    const lx = x2 - h * 0.6 * Math.cos(ang);
    const ly = y2 - h * 0.6 * Math.sin(ang);
    return '<g><line class="' + (o.anim === false ? "" : "flowdash") + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + lx.toFixed(1) + '" y2="' + ly.toFixed(1) + '" stroke="' + c + '" stroke-width="' + (o.w || 2.4) + '" stroke-linecap="round"/>' +
      '<path d="M' + x2 + ' ' + y2 + 'L' + ax.toFixed(1) + ' ' + ay.toFixed(1) + 'L' + bx.toFixed(1) + ' ' + by.toFixed(1) + 'z" fill="' + c + '"/></g>';
  }

  function svg(w, h, inner, label) {
    return '<svg class="art" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + e(label || "رسم توضيحي") + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg>';
  }

  function badge(name, color) {
    const c = color || C.teal;
    return svg(56, 56, '<circle cx="28" cy="28" r="27" fill="' + c + '" fill-opacity=".14" stroke="' + c + '" stroke-opacity=".5"/>' + icon(name, 10, 10, 36, c), "");
  }

  /* مخطط خطوات: أفقي من اليمين إلى اليسار، أو عمودي */
  function flow(steps, o) {
    o = o || {};
    const W = o.w || 560;
    const n = steps.length;
    let inner = "";
    if (o.dir === "v") {
      const bw = o.bw || 380;
      const bh = o.bh || 58;
      const gap = o.gap || 26;
      const x = (W - bw) / 2;
      const H = 20 + n * bh + (n - 1) * gap + 20;
      steps.forEach(function (s, i) {
        const y = 20 + i * (bh + gap);
        const c = s.c || [C.teal, C.amber, C.vio, C.rose, C.sky][i % 5];
        inner += '<g class="rise" style="animation-delay:' + (i * 0.08) + 's">' + box(x, y, bw, bh, c) +
          '<circle cx="' + (x + bw - 30) + '" cy="' + (y + bh / 2) + '" r="17" fill="' + c + '" fill-opacity=".22"/>' +
          (s.icon ? icon(s.icon, x + bw - 44, y + bh / 2 - 14, 28, c) : text(x + bw - 30, y + bh / 2 + 6, s.n || String(i + 1), { size: 16, color: c, en: true })) +
          text(x + bw - 60, y + bh / 2 + (s.sub ? -2 : 6), s.label, { anchor: "right", size: 17 }) +
          (s.sub ? text(x + bw - 60, y + bh / 2 + 18, s.sub, { anchor: "right", size: 13, color: C.mute, weight: 500, en: !!s.subEn }) : "") + "</g>";
        if (i < n - 1) inner += arrow(W / 2, y + bh + 3, W / 2, y + bh + gap - 3, c);
      });
      return svg(W, H, inner, o.label);
    }
    const gap = o.gap || 30;
    const bw = Math.min(o.bw || 150, (W - 20 - (n - 1) * gap) / n);
    const bh = o.bh || 130;
    const H = bh + 40;
    steps.forEach(function (s, i) {
      const x = W - 10 - (i + 1) * bw - i * gap;
      const y = 20;
      const c = s.c || [C.teal, C.amber, C.vio, C.rose, C.sky][i % 5];
      inner += '<g class="rise" style="animation-delay:' + (i * 0.1) + 's">' + box(x, y, bw, bh, c) +
        (s.icon ? icon(s.icon, x + bw / 2 - 22, y + 16, 44, c, "bob") : text(x + bw / 2, y + 52, s.big || String(i + 1), { size: 30, color: c, en: !!s.bigEn })) +
        text(x + bw / 2, y + bh - (s.sub ? 32 : 20), s.label, { size: bw < 110 ? 14 : 16 }) +
        (s.sub ? text(x + bw / 2, y + bh - 12, s.sub, { size: 12, color: C.mute, weight: 500, en: !!s.subEn }) : "") + "</g>";
      if (i < n - 1) inner += arrow(x - 4, y + bh / 2, x - gap + 4, y + bh / 2, c);
    });
    return svg(W, H, inner, o.label);
  }

  /* مركز وحوله عناصر */
  function hub(center, items, o) {
    o = o || {};
    const W = 560, H = o.h || 380, cx = W / 2, cy = H / 2;
    const R = o.r || 140;
    let lines = "", nodes = "";
    items.forEach(function (it, i) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / items.length;
      const x = cx + R * 1.35 * Math.cos(a);
      const y = cy + R * Math.sin(a);
      const c = it.c || [C.teal, C.amber, C.vio, C.rose, C.sky, C.lime][i % 6];
      lines += '<line class="flowdash" x1="' + cx + '" y1="' + cy + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="' + c + '" stroke-opacity=".5" stroke-width="2"/>';
      nodes += '<g class="rise" style="animation-delay:' + (i * 0.07) + 's"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="30" fill="' + BG + '" stroke="' + c + '" stroke-width="2"/>' +
        '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="30" fill="' + c + '" fill-opacity=".14"/>' +
        icon(it.icon, x - 17, y - 17, 34, c) + text(x, y + 50, it.label, { size: 14 }) + "</g>";
    });
    const core = '<circle class="pulse" cx="' + cx + '" cy="' + cy + '" r="52" fill="' + (center.c || C.vio) + '" fill-opacity=".18" stroke="' + (center.c || C.vio) + '" stroke-width="2"/>' +
      icon(center.icon, cx - 22, cy - 34, 44, center.c || C.vio) + text(cx, cy + 30, center.label, { size: 15 });
    return svg(W, H, lines + nodes + core, o.label);
  }

  /* لوحتان متقابلتان */
  function duo(a, b, o) {
    o = o || {};
    const W = 560, H = o.h || 320;
    const pw = 240;
    function panel(p, x) {
      const c = p.c || C.teal;
      let s = box(x, 16, pw, H - 32, c, { fo: 0.08 }) + icon(p.icon, x + pw / 2 - 30, 34, 60, c, "bob") +
        text(x + pw / 2, 126, p.title, { size: 19, weight: 700, color: c });
      (p.lines || []).forEach(function (line, i) {
        s += text(x + pw / 2, 160 + i * 28, line, { size: 15, weight: 500, en: !!p.en });
      });
      return s;
    }
    const mid = o.mid || "⇄";
    return svg(W, H, panel(a, W - 16 - pw) + panel(b, 16) +
      '<circle cx="' + W / 2 + '" cy="' + H / 2 + '" r="22" fill="' + BG + '" stroke="' + C.mute + '" stroke-opacity=".5"/>' + text(W / 2, H / 2 + 7, mid, { size: 18, color: C.amber, en: true }), o.label);
  }

  /* بلاطات */
  function tiles(items, o) {
    o = o || {};
    const W = 560;
    const cols = o.cols || 3;
    const gap = 14;
    const tw = (W - 20 - (cols - 1) * gap) / cols;
    const th = o.th || 110;
    const rows = Math.ceil(items.length / cols);
    const H = 20 + rows * th + (rows - 1) * gap;
    let inner = "";
    items.forEach(function (it, i) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = W - 10 - (col + 1) * tw - col * gap;
      const y = 10 + row * (th + gap);
      const c = it.c || [C.teal, C.amber, C.vio, C.rose, C.sky, C.lime][i % 6];
      inner += '<g class="rise" style="animation-delay:' + (i * 0.06) + 's">' + box(x, y, tw, th, c, { fo: it.dim ? 0.04 : 0.12, so: it.dim ? 0.25 : 0.6, dash: it.dim ? "5 5" : null }) +
        (it.icon ? icon(it.icon, x + tw / 2 - 18, y + 12, 36, c) : "") +
        (it.big ? text(x + tw / 2, y + 44, it.big, { size: 24, color: c, en: !!it.bigEn, weight: 700 }) : "") +
        text(x + tw / 2, y + th - (it.sub ? 34 : 18), it.label, { size: 15, opacity: it.dim ? 0.55 : null }) +
        (it.sub ? text(x + tw / 2, y + th - 14, it.sub, { size: 12, color: C.mute, weight: 500, en: !!it.subEn }) : "") + "</g>";
    });
    return svg(W, H, inner, o.label);
  }

  /* نافذة كود */
  function codeWin(lines, o) {
    o = o || {};
    const W = o.w || 560;
    const lh = 24;
    const H = 52 + lines.length * lh + 16;
    let inner = box(6, 6, W - 12, H - 12, C.sky, { fill: "#060a18", fo: 1, so: 0.35, r: 14 }) +
      '<circle cx="26" cy="26" r="5" fill="' + C.rose + '"/><circle cx="44" cy="26" r="5" fill="' + C.amber + '"/><circle cx="62" cy="26" r="5" fill="' + C.teal + '"/>' +
      (o.title ? text(W - 22, 31, o.title, { anchor: "right", size: 13, color: C.mute, en: true, weight: 500 }) : "");
    lines.forEach(function (ln, i) {
      const y = 62 + i * lh;
      const l = typeof ln === "string" ? { t: ln } : ln;
      if (l.hl) inner += '<rect x="14" y="' + (y - 17) + '" width="' + (W - 28) + '" height="22" rx="5" fill="' + (l.hl === true ? C.amber : l.hl) + '" fill-opacity=".16"/>';
      if (l.dot) inner += '<circle cx="26" cy="' + (y - 6) + '" r="6" fill="' + C.rose + '"/>';
      inner += text(40, y, String(i + 1), { anchor: "left", en: true, size: 12, color: C.mute, weight: 500 }) +
        text(56, y, l.t, { anchor: "left", en: true, size: 14, color: l.c || C.ink, weight: 500, cls: "mono" });
    });
    return svg(W, H, inner, o.label);
  }

  /* رسوم بديلة للقطات الشاشة، تُستبدل حين تتوفر صورة في SHOTS */
  const mock = {
    "ide-debug": function () {
      return codeWin([
        { t: "double total = 0;" },
        { t: "for (int i = 0; i < 3; i++) {" },
        { t: "    total += prices[i];", dot: true, hl: C.amber },
        { t: "}" },
        { t: "Console.WriteLine(total);" }
      ], { title: "Breakpoint · Watch: total = 12.5", label: "بيئة تطوير فيها نقطة توقف ومراقبة" });
    },
    "syntax-colors": function () {
      return codeWin([
        { t: "// greet the user", c: "#7f8db8" },
        { t: "string name = \"Lina\";", c: C.ink },
        { t: "Console.WriteLine(\"Hello \" + name);", c: C.amber },
        { t: "int age = 17; // whole number", c: C.teal }
      ], { title: "Syntax highlighting", label: "تلوين الصياغة: التعليق بلون والسلسلة بلون آخر" });
    },
    "form-designer": function () {
      const W = 560, H = 300;
      let s = box(8, 8, W - 16, H - 16, C.vio, { fo: 0.06 }) + box(24, 40, 140, 240, C.mute, { fo: 0.05, so: 0.3, r: 10 }) +
        text(94, 64, "Toolbox", { en: true, size: 13, color: C.mute }) +
        box(36, 80, 116, 30, C.teal, { r: 8 }) + text(94, 100, "Button", { en: true, size: 13 }) +
        box(36, 120, 116, 30, C.amber, { r: 8 }) + text(94, 140, "TextBox", { en: true, size: 13 }) +
        box(36, 160, 116, 30, C.sky, { r: 8 }) + text(94, 180, "Label", { en: true, size: 13 }) +
        box(190, 40, 350, 240, C.ink, { fo: 0.03, so: 0.3, r: 10 }) + text(365, 64, "Form1", { en: true, size: 13, color: C.mute }) +
        box(240, 120, 150, 40, C.teal, { r: 10, cls: "slidein" }) + text(315, 146, "Button1", { en: true, size: 14, cls: "slidein" }) +
        arrow(150, 95, 236, 136, C.teal) + icon("hand", 380, 150, 34, C.ink, "bob") +
        text(365, 230, "private void Button1_Click(...)", { en: true, size: 12, color: C.amber, cls: "mono" });
      return svg(W, H, s, "مصمم نماذج: سحب زر يولّد كودًا");
    },
    "jtag-board": function () {
      const W = 560, H = 280;
      let s = icon("laptop", 30, 70, 130, C.sky) + box(330, 60, 200, 150, C.lime, { fo: 0.08 }) +
        icon("chip", 395, 100, 70, C.lime) + text(430, 236, "اللوحة باقية في دائرتها", { size: 14 }) +
        '<path class="flowdash" d="M160 150 C 230 150, 260 135, 330 135" stroke="' + C.amber + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        text(245, 120, "USB · JTAG", { en: true, size: 14, color: C.amber });
      return svg(W, H, s, "كبل USB أو JTAG يصل لوحة تبقى في مكانها");
    },
    "gui-login": function () {
      const W = 560, H = 300;
      let s = box(120, 20, 320, 260, C.sky, { fo: 0.07 }) + '<path d="M120 58h320" stroke="' + C.sky + '" stroke-opacity=".5"/>' +
        text(280, 45, "تسجيل الدخول", { size: 15 }) + icon("user", 256, 70, 48, C.sky) +
        box(160, 132, 240, 34, C.mute, { fo: 0.05, so: 0.4, r: 8 }) + text(384, 155, "اسم المستخدم", { anchor: "right", size: 13, color: C.mute }) +
        box(160, 176, 240, 34, C.mute, { fo: 0.05, so: 0.4, r: 8 }) + text(384, 199, "••••••", { anchor: "right", size: 13, color: C.mute, en: true }) +
        box(200, 226, 160, 36, C.teal, { fo: 0.3, r: 18 }) + text(280, 250, "دخول", { size: 15 }) + icon("hand", 330, 236, 30, C.ink, "bob");
      return svg(W, H, s, "نافذة دخول رسومية");
    },
    "cli-clock": function () {
      return codeWin([
        { t: "C:\\> clock.exe", c: C.teal },
        { t: "10:42:07", c: C.amber },
        { t: "10:42:08", c: C.amber },
        { t: "10:42:09", c: C.amber },
        { t: "_", c: C.ink }
      ], { title: "Command line", label: "ساعة نصية في سطر الأوامر" });
    },
    "hex-beside-cpp": function () {
      const W = 560, H = 250;
      let s = box(10, 14, 260, 220, C.sky, { fo: 0.06 }) + text(140, 44, "C++", { en: true, size: 14, color: C.mute }) +
        text(28, 110, "cout << \"BTEC Student\";", { anchor: "left", en: true, size: 14, cls: "mono" }) +
        text(140, 170, "الإنسان يقرأ السطر", { size: 14, color: C.mute }) +
        box(290, 14, 260, 220, C.amber, { fo: 0.06 }) + text(420, 44, "بايتات نصية", { size: 14, color: C.amber }) +
        text(420, 104, "42 54 45 43 20 53", { en: true, size: 18, cls: "mono" }) +
        text(420, 140, "74 75 64 65 6E 74", { en: true, size: 18, cls: "mono" }) +
        text(420, 190, "المعالج يتعامل مع الأعداد", { size: 14, color: C.mute }) + arrow(272, 124, 288, 124, C.amber);
      return svg(W, H, s, "سطر الإخراج وإلى جانبه بايتاته النصية");
    }
  };

  window.ART = {
    C: C, I: I, icon: icon, text: text, box: box, arrow: arrow, svg: svg, badge: badge,
    flow: flow, hub: hub, duo: duo, tiles: tiles, codeWin: codeWin, mock: mock, esc: e
  };
})();
