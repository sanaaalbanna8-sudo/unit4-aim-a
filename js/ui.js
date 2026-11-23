(function () {
  "use strict";

  const stations = [];
  const KEY = "unit4-aim-a";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const OK = "إجابتك صحيحة";
  const NO = "ليس تمامًا، فكّر مرة أخرى";
  const SHOW = "👁 أظهر الإجابة والسبب";
  const LETTERS = ["أ", "ب", "ج", "د", "هـ", "و", "ز", "ح", "ط", "ي"];
  const SPEAKER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 9v6h4l5 4V5L8 9H4z"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16.5 8.5a4.5 4.5 0 010 7M18.8 6a8 8 0 010 12"/></svg>';

  const state = { index: 0, screen: 0, max: 0, scores: {} };
  let tipAnchor = null;
  let voiceReady = false;

  /* ---------- أدوات صغيرة ---------- */

  function ar(n) {
    return String(n).replace(/\d/g, function (d) { return "0123456789"[d]; });
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function el(tag, attrs) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        const value = attrs[key];
        if (value == null || value === false) return;
        if (key === "text") node.textContent = value;
        else if (key === "html") node.innerHTML = value;
        else node.setAttribute(key, value === true ? "" : value);
      });
    }
    for (let i = 2; i < arguments.length; i++) {
      const child = arguments[i];
      if (child == null) continue;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    }
    return node;
  }

  function fromMarkup(markup) {
    const holder = document.createElement("div");
    holder.innerHTML = markup.trim();
    return holder.firstElementChild;
  }

  function shuffleFixed(n, seed) {
    const order = [];
    for (let i = 0; i < n; i++) order.push(i);
    const s = seed || 7;
    order.sort(function (a, b) { return ((a * s + 3) % (n + 2)) - ((b * s + 3) % (n + 2)); });
    if (order.every(function (v, i) { return v === i; })) order.reverse();
    return order;
  }

  /* ---------- الحفظ ---------- */

  function loadStore() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (err) { return {}; }
  }

  function saveStore(extra) {
    const current = loadStore();
    const next = Object.assign({}, current, {
      station: stations[state.index] ? stations[state.index].id : "s0",
      screen: state.screen,
      maxId: stations[state.max] ? stations[state.max].id : "s0",
      scores: state.scores
    });
    if (extra) Object.keys(extra).forEach(function (key) { next[key] = extra[key]; });
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (err) { /* يبقى التقدم في الذاكرة */ }
  }

  function scoreCount() {
    return Object.keys(state.scores).filter(function (id) { return state.scores[id] === "ok"; }).length;
  }

  function paintScore() {
    const node = document.getElementById("score");
    if (node) node.textContent = "الصحيح قبل الكشف: " + ar(scoreCount());
  }

  function markOk(id) {
    if (state.scores[id] !== "shown") state.scores[id] = "ok";
    saveStore();
    paintScore();
  }

  function markShown(id) {
    if (state.scores[id] !== "ok") state.scores[id] = "shown";
    saveStore();
    paintScore();
  }

  function previewOn() {
    return /(?:\?|&)preview(?:=|&|$)/.test(location.search);
  }

  /* ---------- الصوت والتلميح ---------- */

  function showVoice(message) {
    const node = document.getElementById("voice");
    if (!node) return;
    node.hidden = false;
    node.textContent = message;
    clearTimeout(showVoice.t);
    showVoice.t = setTimeout(function () { node.hidden = true; }, 4000);
  }

  function englishVoice() {
    if (!window.speechSynthesis) return null;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return undefined;
    return voices.find(function (voice) { return /^en/i.test(voice.lang); }) || null;
  }

  function speakWord(text) {
    if (!window.speechSynthesis) { showVoice("لا يتوفر صوت إنجليزي على هذا الجهاز"); return; }
    const voice = englishVoice();
    if (voice === null && voiceReady) { showVoice("لا يتوفر صوت إنجليزي على هذا الجهاز"); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.9;
    if (voice) utter.voice = voice;
    utter.onerror = function () { showVoice("لا يتوفر صوت إنجليزي على هذا الجهاز"); };
    window.speechSynthesis.speak(utter);
  }

  function hideTip() {
    const tip = document.getElementById("tip");
    if (!tip) return;
    tip.hidden = true;
    if (tipAnchor) tipAnchor.removeAttribute("aria-describedby");
    tipAnchor = null;
  }

  function placeTip(anchor) {
    const tip = document.getElementById("tip");
    const rect = anchor.getBoundingClientRect();
    const width = tip.offsetWidth;
    const height = tip.offsetHeight;
    let top = rect.bottom + 10;
    if (top + height > window.innerHeight - 90) top = Math.max(8, rect.top - height - 10);
    let left = rect.right - width;
    if (left < 8) left = 8;
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
    tip.style.top = top + "px";
    tip.style.left = left + "px";
  }

  function showTip(anchor) {
    const tip = document.getElementById("tip");
    const tipEn = document.getElementById("tipEn");
    const tipAr = document.getElementById("tipAr");
    if (anchor.dataset.hint) {
      tipEn.hidden = true;
      tipEn.textContent = "";
      tipAr.textContent = anchor.dataset.hint;
    } else {
      const term = (window.DICT || {})[anchor.getAttribute("data-term")];
      if (!term) return;
      tipEn.hidden = false;
      tipEn.textContent = term.sentenceEn;
      tipAr.textContent = term.meaningAr;
    }
    tipAnchor = anchor;
    tip.hidden = false;
    placeTip(anchor);
    anchor.setAttribute("aria-describedby", "tip");
  }

  function termNode(id, arLabel) {
    const term = (window.DICT || {})[id];
    if (!term) return document.createTextNode("");
    const speak = el("button", { type: "button", class: "speak", "data-speak": id, "aria-label": "انطق " + term.label, html: SPEAKER });
    return el("span", { class: "term", "data-term": id, tabindex: "0" },
      arLabel ? el("span", { class: "term-ar", text: arLabel }) : null,
      el("span", { class: "term-en", lang: "en", dir: "ltr", text: term.label }),
      speak
    );
  }

  /* ---------- السحب والإفلات ---------- */

  function dragify(root, onDrop) {
    let drag = null;
    root.addEventListener("pointerdown", function (event) {
      const tok = event.target.closest(".tok");
      if (!tok || !root.contains(tok) || event.button !== 0 || root.dataset.locked === "1") return;
      drag = { tok: tok, x: event.clientX, y: event.clientY, moving: false, ghost: null, id: event.pointerId };
    });
    root.addEventListener("pointermove", function (event) {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moving) {
        if (Math.abs(dx) + Math.abs(dy) < 8) return;
        drag.moving = true;
        try { drag.tok.setPointerCapture(event.pointerId); } catch (err) {}
        const rect = drag.tok.getBoundingClientRect();
        drag.ox = event.clientX - rect.left;
        drag.oy = event.clientY - rect.top;
        drag.ghost = drag.tok.cloneNode(true);
        drag.ghost.classList.add("drag-ghost");
        drag.ghost.style.width = rect.width + "px";
        document.body.appendChild(drag.ghost);
        drag.tok.classList.add("lifting");
      }
      event.preventDefault();
      drag.ghost.style.left = (event.clientX - drag.ox) + "px";
      drag.ghost.style.top = (event.clientY - drag.oy) + "px";
      root.querySelectorAll("[data-zone].over").forEach(function (z) { z.classList.remove("over"); });
      const under = document.elementFromPoint(event.clientX, event.clientY);
      const zone = under && under.closest("[data-zone]");
      if (zone && root.contains(zone)) zone.classList.add("over");
    });
    function finish(event) {
      if (!drag || event.pointerId !== drag.id) return;
      const was = drag;
      drag = null;
      if (!was.moving) return;
      was.ghost.remove();
      was.tok.classList.remove("lifting");
      root.querySelectorAll("[data-zone].over").forEach(function (z) { z.classList.remove("over"); });
      root.dataset.suppress = "1";
      setTimeout(function () { root.dataset.suppress = ""; }, 60);
      const under = document.elementFromPoint(event.clientX, event.clientY);
      const zone = under && under.closest("[data-zone]");
      if (!zone || !root.contains(zone)) return;
      const toks = Array.from(zone.querySelectorAll(".tok")).filter(function (t) { return t !== was.tok; });
      let index = toks.length;
      for (let i = 0; i < toks.length; i++) {
        const r = toks[i].getBoundingClientRect();
        const before = zone.dataset.axis === "x" ? event.clientX > r.left + r.width / 2 : event.clientY < r.top + r.height / 2;
        if (before) { index = i; break; }
      }
      onDrop(was.tok.dataset.key, zone.dataset.zone, index);
    }
    root.addEventListener("pointerup", finish);
    root.addEventListener("pointercancel", function (event) {
      if (drag && drag.ghost) { drag.ghost.remove(); drag.tok.classList.remove("lifting"); }
      drag = null;
    });
  }

  /* ---------- إطار السؤال والألعاب ---------- */

  function frame(spec, kind) {
    const box = el("div", { class: "game " + kind, "data-quiz": spec.id, "data-cov": spec.cov || null });
    const head = el("div", { class: "game-head" });
    head.appendChild(el("span", { class: "game-tag", text: kind === "quiz" ? "سؤال" : "لعبة" }));
    head.appendChild(el("p", { class: "q", text: spec.prompt || spec.title || "" }));
    box.appendChild(head);
    if (spec.line) box.appendChild(el("p", { class: "game-line", text: spec.line }));
    const body = el("div", { class: "game-body" });
    box.appendChild(body);
    const foot = el("div", { class: "game-foot" });
    const check = el("button", { type: "button", class: "btn", text: "تحقق" });
    const again = kind === "quiz" ? null : el("button", { type: "button", class: "btn ghost", text: "↺ أعد" });
    const reveal = el("button", { type: "button", class: "reveal", text: SHOW });
    foot.appendChild(check);
    if (again) foot.appendChild(again);
    foot.appendChild(reveal);
    box.appendChild(foot);
    const mark = el("p", { class: "mark", role: "status", "aria-live": "polite" });
    box.appendChild(mark);
    const why = el("div", { class: "why", hidden: true });
    box.appendChild(why);

    function setMark(text, tone) {
      mark.textContent = text;
      mark.className = "mark" + (tone ? " " + tone : "");
      if (text) {
        mark.classList.remove("pop");
        void mark.offsetWidth;
        mark.classList.add("pop");
      }
    }
    function showWhy(answerText) {
      why.replaceChildren();
      if (answerText) why.appendChild(el("p", { class: "why-ans" }, el("strong", { text: "الإجابة: " }), answerText));
      if (spec.why) why.appendChild(el("p", { text: spec.why }));
      why.hidden = false;
      box.dataset.revealed = "1";
    }
    return { box: box, body: body, check: check, again: again, reveal: reveal, setMark: setMark, showWhy: showWhy, why: why };
  }

  function buildQuiz(spec) {
    const f = frame(spec, "quiz");
    const multi = spec.mode === "multi";
    if (multi) f.body.appendChild(el("p", { class: "game-line", text: "قد تكون أكثر من إجابة صحيحة." }));
    const list = el("div", { class: "choices" + ((spec.choices || []).length > 4 ? " many" : "") });
    (spec.choices || []).forEach(function (choice, i) {
      list.appendChild(el("button", {
        type: "button", class: "choice", "data-choice": choice.id, "data-ok": choice.ok ? "1" : "0", "aria-pressed": "false"
      }, el("span", { class: "letter", text: LETTERS[i] || String(i + 1) }), el("span", { class: "ctext", text: choice.text })));
    });
    f.body.appendChild(list);

    function answerText() {
      return (spec.choices || []).filter(function (c) { return c.ok; }).map(function (c) { return c.text; }).join("، ");
    }
    function picked() {
      return Array.from(list.querySelectorAll(".choice")).filter(function (b) { return b.getAttribute("aria-pressed") === "true"; });
    }
    list.addEventListener("click", function (event) {
      const button = event.target.closest(".choice");
      if (!button || f.box.dataset.revealed === "1") return;
      if (!multi) list.querySelectorAll(".choice").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      button.setAttribute("aria-pressed", multi && button.getAttribute("aria-pressed") === "true" ? "false" : "true");
      list.querySelectorAll(".choice").forEach(function (b) { b.classList.remove("is-right", "is-wrong"); });
      f.setMark("", "");
    });
    f.check.addEventListener("click", function () {
      const chosen = picked();
      if (!chosen.length) { f.setMark("اختر إجابة أولًا.", "info"); return; }
      const wanted = Array.from(list.querySelectorAll("[data-ok='1']"));
      const same = chosen.length === wanted.length && wanted.every(function (b) { return b.getAttribute("aria-pressed") === "true"; });
      if (same) {
        f.setMark(OK, "right");
        chosen.forEach(function (b) { b.classList.add("is-right"); });
        markOk(spec.id);
      } else {
        f.setMark(NO, "wrong");
      }
    });
    f.reveal.addEventListener("click", function () {
      list.querySelectorAll("[data-ok='1']").forEach(function (b) { b.classList.add("is-answer"); });
      f.showWhy(answerText());
      markShown(spec.id);
    });

    const prior = state.scores[spec.id];
    if (prior === "ok") {
      list.querySelectorAll("[data-ok='1']").forEach(function (b) { b.setAttribute("aria-pressed", "true"); b.classList.add("is-right"); });
      f.setMark(OK, "right");
    } else if (prior === "shown") {
      list.querySelectorAll("[data-ok='1']").forEach(function (b) { b.classList.add("is-answer"); });
      f.showWhy(answerText());
    }
    return f.box;
  }

  function buildOrder(spec) {
    const f = frame(spec, "order");
    const n = spec.items.length;
    const start = spec.start || shuffleFixed(n, 5);
    let pool = [];
    let track = [];
    const poolEl = el("div", { class: "pool", "data-zone": "pool", "data-axis": "x" });
    const trackEl = el("ol", { class: "track-list", "data-zone": "track" });
    f.body.appendChild(el("p", { class: "zone-label", text: "البطاقات" }));
    f.body.appendChild(poolEl);
    f.body.appendChild(el("p", { class: "zone-label", text: "الترتيب" }));
    f.body.appendChild(trackEl);

    function tok(i) {
      return el("button", { type: "button", class: "tok", "data-key": String(i), text: spec.items[i] });
    }
    function draw() {
      poolEl.replaceChildren();
      pool.forEach(function (i) { poolEl.appendChild(tok(i)); });
      if (!pool.length) poolEl.appendChild(el("span", { class: "empty", text: "كل البطاقات في الترتيب." }));
      trackEl.replaceChildren();
      track.forEach(function (i) { trackEl.appendChild(el("li", null, tok(i))); });
      if (track.length < n) trackEl.appendChild(el("li", { class: "slot", text: "اسحب بطاقة إلى هنا أو اضغطها" }));
    }
    function move(key, zone, index) {
      const i = Number(key);
      pool = pool.filter(function (v) { return v !== i; });
      track = track.filter(function (v) { return v !== i; });
      const target = zone === "track" ? track : pool;
      target.splice(Math.min(index, target.length), 0, i);
      f.setMark("", "");
      draw();
    }
    function init() {
      pool = start.slice();
      track = [];
      f.box.dataset.revealed = "";
      f.box.dataset.locked = "";
      f.why.hidden = true;
      f.setMark("", "");
      draw();
    }
    f.body.addEventListener("click", function (event) {
      if (f.box.dataset.suppress === "1" || f.box.dataset.locked === "1") return;
      const t = event.target.closest(".tok");
      if (!t) return;
      const inTrack = !!t.closest("[data-zone='track']");
      move(t.dataset.key, inTrack ? "pool" : "track", 999);
    });
    dragify(f.box, function (key, zone, index) { if (f.box.dataset.locked !== "1") move(key, zone, index); });
    f.check.addEventListener("click", function () {
      if (track.length < n) { f.setMark("ضع كل البطاقات في الترتيب أولًا.", "info"); return; }
      const good = track.every(function (v, i) { return v === i; });
      if (good) { f.setMark(OK, "right"); markOk(spec.id); trackEl.classList.add("solved"); }
      else f.setMark(NO, "wrong");
    });
    f.again.addEventListener("click", function () { trackEl.classList.remove("solved"); init(); });
    f.reveal.addEventListener("click", function () {
      pool = [];
      track = spec.items.map(function (_, i) { return i; });
      draw();
      f.box.dataset.locked = "1";
      trackEl.classList.add("solved");
      f.showWhy(spec.answer || "");
      markShown(spec.id);
    });
    init();
    if (state.scores[spec.id] === "ok") {
      pool = []; track = spec.items.map(function (_, i) { return i; }); draw();
      trackEl.classList.add("solved"); f.setMark(OK, "right");
    }
    return f.box;
  }

  function buildBins(spec) {
    const f = frame(spec, "bins");
    let place = [];
    let selected = null;
    const poolEl = el("div", { class: "pool", "data-zone": "pool", "data-axis": "x" });
    const binsEl = el("div", { class: "bins cols-" + Math.min(spec.bins.length, 3) });
    f.body.appendChild(el("p", { class: "zone-label", text: "اسحب كل بطاقة إلى مكانها، أو اضغطها ثم اضغط الصندوق." }));
    f.body.appendChild(poolEl);
    f.body.appendChild(binsEl);
    const binNodes = {};
    spec.bins.forEach(function (bin) {
      const zone = el("div", { class: "bin", "data-zone": bin.id, "data-axis": "x" });
      const headBtn = el("button", { type: "button", class: "bin-head", "data-bin": bin.id }, bin.icon ? el("span", { class: "bin-ico", text: bin.icon }) : null, el("span", { class: "bin-ar", text: bin.label }), bin.en ? el("span", { class: "bin-en", lang: "en", dir: "ltr", text: bin.en }) : null);
      const inner = el("div", { class: "bin-items" });
      zone.appendChild(headBtn);
      zone.appendChild(inner);
      binsEl.appendChild(zone);
      binNodes[bin.id] = inner;
    });
    function tok(i) {
      return el("button", { type: "button", class: "tok" + (selected === i ? " picked" : ""), "data-key": String(i), "aria-pressed": selected === i ? "true" : "false" }, el("span", { class: "tok-ar", text: spec.items[i].text }), spec.items[i].en ? el("span", { class: "tok-en", lang: "en", dir: "ltr", text: spec.items[i].en }) : null);
    }
    function draw() {
      poolEl.replaceChildren();
      Object.keys(binNodes).forEach(function (k) { binNodes[k].replaceChildren(); });
      spec.items.forEach(function (item, i) {
        if (place[i] == null) poolEl.appendChild(tok(i));
        else binNodes[place[i]].appendChild(tok(i));
      });
      if (!poolEl.children.length) poolEl.appendChild(el("span", { class: "empty", text: "كل البطاقات في الصناديق." }));
    }
    function put(i, zone) {
      place[i] = zone === "pool" ? null : zone;
      selected = null;
      f.setMark("", "");
      draw();
    }
    function init() {
      place = spec.items.map(function () { return null; });
      selected = null;
      f.box.dataset.revealed = "";
      f.box.dataset.locked = "";
      f.why.hidden = true;
      f.setMark("", "");
      binsEl.classList.remove("solved");
      draw();
    }
    f.body.addEventListener("click", function (event) {
      if (f.box.dataset.suppress === "1" || f.box.dataset.locked === "1") return;
      const t = event.target.closest(".tok");
      if (t) {
        const i = Number(t.dataset.key);
        selected = selected === i ? null : i;
        draw();
        const again = f.body.querySelector(".tok[data-key='" + i + "']");
        if (again && selected === i) again.focus();
        return;
      }
      const zone = event.target.closest("[data-zone]");
      if (zone && selected != null) put(selected, zone.dataset.zone);
    });
    dragify(f.box, function (key, zone) { if (f.box.dataset.locked !== "1") put(Number(key), zone); });
    f.check.addEventListener("click", function () {
      if (place.some(function (p) { return p == null; })) { f.setMark("ضع كل البطاقات في الصناديق أولًا.", "info"); return; }
      const good = spec.items.every(function (item, i) { return place[i] === item.bin; });
      if (good) { f.setMark(OK, "right"); binsEl.classList.add("solved"); markOk(spec.id); }
      else f.setMark(NO, "wrong");
    });
    f.again.addEventListener("click", init);
    f.reveal.addEventListener("click", function () {
      place = spec.items.map(function (item) { return item.bin; });
      selected = null;
      draw();
      f.box.dataset.locked = "1";
      binsEl.classList.add("solved");
      f.showWhy(spec.answer || "");
      markShown(spec.id);
    });
    init();
    if (state.scores[spec.id] === "ok") {
      place = spec.items.map(function (item) { return item.bin; }); draw();
      binsEl.classList.add("solved"); f.setMark(OK, "right");
    }
    return f.box;
  }

  /* ---------- واجهة الشاشة ---------- */

  function apiFor(textCol, visCol) {
    let terms = null;
    let hints = null;
    function col(where) { return where === "text" ? textCol : where === "vis" ? visCol : null; }
    const api = {
      el: el,
      ar: ar,
      text: textCol,
      vis: visCol,
      add: function (node, where) { (col(where) || textCol).appendChild(node); return node; },
      p: function (text, cov) {
        return textCol.appendChild(el("p", { class: "lead", "data-cov": cov || null, text: text }));
      },
      story: function (o) {
        const box = el("div", { class: "story", "data-cov": o.cov || null });
        const ico = el("div", { class: "story-ico", html: window.ART ? ART.badge(o.icon || "user", o.color) : "" });
        const body = el("div", { class: "story-body" });
        if (o.who) body.appendChild(el("p", { class: "story-who", text: o.who }));
        body.appendChild(el("p", { text: o.text }));
        box.appendChild(ico);
        box.appendChild(body);
        return textCol.appendChild(box);
      },
      points: function (list, cov) {
        const ul = el("ul", { class: "points", "data-cov": cov || null });
        list.forEach(function (item) { ul.appendChild(el("li", { text: item })); });
        return textCol.appendChild(ul);
      },
      example: function (text, cov, title) {
        return textCol.appendChild(el("div", { class: "example", "data-cov": cov || null },
          el("span", { class: "ex-tag", text: title || "مثال" }), el("p", { text: text })));
      },
      term: function (id, arLabel) {
        if (!terms) terms = textCol.appendChild(el("div", { class: "terms" }));
        terms.appendChild(termNode(id, arLabel));
      },
      hint: function (cov, label, text, where) {
        const target = col(where) || textCol;
        if (!hints || hints.parentNode !== target) hints = target.appendChild(el("div", { class: "hints" }));
        hints.appendChild(el("button", { type: "button", class: "hint", "data-cov": cov, "data-hint": text, text: label }));
      },
      code: function (text, cov, where, label) {
        const pre = el("pre", { class: "code", dir: "ltr", lang: "en", "data-cov": cov || null, "data-label": label || null });
        pre.appendChild(el("code", { text: text }));
        return (col(where) || textCol).appendChild(pre);
      },
      link: function (text, cov) {
        return textCol.appendChild(el("p", { class: "linkline", "data-cov": cov || null }, el("strong", { text: "الخلاصة: " }), text));
      },
      art: function (markup, caption, cov, where) {
        const fig = el("figure", { class: "art-fig", "data-cov": cov || null });
        fig.appendChild(typeof markup === "string" ? fromMarkup(markup) : markup);
        if (caption) fig.appendChild(el("figcaption", { text: caption }));
        return (col(where) || visCol).appendChild(fig);
      },
      shot: function (key, caption, where) {
        const src = (window.SHOTS || {})[key];
        const fig = el("figure", { class: "art-fig shot", "data-shot": key });
        if (src) fig.appendChild(el("img", { alt: caption, src: src, loading: "lazy" }));
        else if (window.ART && ART.mock[key]) fig.appendChild(fromMarkup(ART.mock[key]()));
        fig.appendChild(el("figcaption", { text: caption }));
        return (col(where) || visCol).appendChild(fig);
      },
      lab: function (o) {
        const card = el("div", { class: "lab-card", "data-cov": o.cov || null });
        const head = el("div", { class: "lab-head" });
        head.appendChild(el("span", { class: "lab-tag", text: o.tag || "مختبر" }));
        head.appendChild(el("h3", { text: o.title }));
        const again = el("button", { type: "button", class: "btn ghost small", text: "↺ أعد" });
        head.appendChild(again);
        card.appendChild(head);
        if (o.line) card.appendChild(el("p", { class: "lab-line", text: o.line }));
        const body = el("div", { class: "lab-body" });
        card.appendChild(body);
        function build() { body.replaceChildren(); o.build(body, api); }
        again.addEventListener("click", build);
        (col(o.where) || visCol).appendChild(card);
        build();
        return card;
      },
      quiz: function (spec, where) { return (col(where) || textCol).appendChild(buildQuiz(spec)); },
      order: function (spec, where) { return (col(where) || visCol).appendChild(buildOrder(spec)); },
      bins: function (spec, where) { return (col(where) || visCol).appendChild(buildBins(spec)); }
    };
    return api;
  }

  /* ---------- الشريط والتنقل ---------- */

  function canOpen(index) {
    return index >= 0 && index < stations.length; // التنقل حر بين كل المحطات
  }

  function openAt(index, screen) {
    state.index = index;
    state.screen = screen;
    state.max = Math.max(state.max, index);
  }

  function renderRail() {
    const rail = document.getElementById("rail");
    rail.replaceChildren();
    stations.forEach(function (station, index) {
      const open = canOpen(index);
      const button = el("button", {
        type: "button",
        class: "rail-btn tone-" + station.tone + (index < state.max ? " done" : ""),
        "aria-disabled": open ? "false" : "true",
        "aria-label": station.titleAr + (open ? "" : "، تُفتح بعد إنهاء المحطة السابقة")
      }, el("span", { class: "rail-badge", dir: "ltr", text: station.badge }), el("span", { class: "rail-name", text: station.short || station.titleAr }), open ? null : el("span", { class: "rail-lock", "aria-hidden": "true", text: "🔒" }));
      if (index === state.index) button.setAttribute("aria-current", "step");
      button.addEventListener("click", function () {
        if (!canOpen(index)) { showVoice("أنهِ المحطة الحالية لتُفتح هذه المحطة."); return; }
        const dir = index > state.index ? 1 : -1;
        openAt(index, 0);
        render(dir);
      });
      rail.appendChild(button);
    });
    const current = rail.querySelector("[aria-current]");
    if (current && current.scrollIntoView) current.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function renderPager() {
    const station = stations[state.index];
    const total = station.screens.length;
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");
    const nextName = document.getElementById("nextName");
    const count = document.getElementById("count");
    const dots = document.getElementById("dots");
    prev.disabled = state.index === 0 && state.screen === 0;
    count.textContent = ar(state.screen + 1) + " / " + ar(total);
    dots.replaceChildren();
    station.screens.forEach(function (screen, i) {
      const dot = el("button", { type: "button", class: "pdot" + (i === state.screen ? " on" : i < state.screen ? " seen" : ""), "aria-label": "الشاشة " + ar(i + 1) + ": " + screen.titleAr });
      if (i === state.screen) dot.setAttribute("aria-current", "step");
      dot.addEventListener("click", function () {
        const dir = i > state.screen ? 1 : -1;
        state.screen = i;
        render(dir);
      });
      dots.appendChild(dot);
    });
    if (state.screen < total - 1) {
      next.disabled = false;
      next.querySelector(".nlabel").textContent = "التالي";
      nextName.textContent = station.screens[state.screen + 1].titleAr;
    } else if (state.index < stations.length - 1) {
      next.disabled = false;
      next.querySelector(".nlabel").textContent = "المحطة التالية";
      nextName.textContent = stations[state.index + 1].titleAr;
    } else {
      next.disabled = true;
      next.querySelector(".nlabel").textContent = "النهاية";
      nextName.textContent = "أنهيت المسار";
    }
  }

  /* العبارات الحسابية بأرقام إنجليزية تُعرض من اليسار إلى اليمين داخل النص العربي */
  const MATH = /\d[\d.,]*(?:\s*[+\-−×÷=<>≤≥*\/]\s*\(?\d[\d.,]*\)?)+/g;
  const SHARP = /\b(?:C\+\+|[A-Z]#)(?![\w#+])/g;
  function fixMath(s) {
    function wrap(m, offset, all) {
      return all.charAt(offset - 1) === "⁦" ? m : "⁦" + m + "⁩";
    }
    return s.replace(MATH, wrap).replace(SHARP, wrap);
  }
  function isolateMath(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      const p = n.parentNode;
      if (!p || !p.closest || p.closest("pre, code, [dir='ltr'], textarea, script, style")) return;
      const next = fixMath(n.nodeValue);
      if (next !== n.nodeValue) n.nodeValue = next;
    });
  }
  let mathObserver = null;
  function watchMath() {
    if (mathObserver || !window.MutationObserver) return;
    const main = document.getElementById("main");
    mathObserver = new MutationObserver(function () { isolateMath(main); });
    mathObserver.observe(main, { childList: true, subtree: true, characterData: true });
  }

  function render(dir) {
    hideTip();
    const station = stations[state.index];
    const screen = station.screens[state.screen];
    const total = station.screens.length;
    const overall = (state.index + (state.screen + 1) / total) / stations.length;
    const percent = Math.round(overall * 100);
    const bar = document.getElementById("progress");
    document.getElementById("progressBar").style.width = percent + "%";
    bar.setAttribute("aria-valuenow", String(percent));
    bar.setAttribute("aria-valuetext", station.titleAr + "، " + ar(state.screen + 1) + " من " + ar(total));
    document.getElementById("brandAr").textContent = station.titleAr;
    document.getElementById("brandEn").textContent = station.titleEn;
    document.title = screen.titleAr + " · " + station.titleAr;

    const slide = el("section", { class: "slide tone-" + station.tone + (dir > 0 ? " from-next" : dir < 0 ? " from-prev" : ""), "data-cov": (screen.cov || []).join(" "), "aria-labelledby": "slideTitle" });
    const head = el("header", { class: "slide-head" });
    const meta = el("p", { class: "slide-meta" });
    meta.appendChild(el("span", { class: "slide-badge", dir: "ltr", text: station.badge }));
    if (screen.part) meta.appendChild(el("span", { class: "slide-part", text: screen.part }));
    meta.appendChild(el("span", { class: "slide-count", text: "الشاشة " + ar(state.screen + 1) + " من " + ar(total) }));
    head.appendChild(meta);
    const crumb = el("p", { class: "crumb", lang: "en", dir: "ltr" });
    crumb.appendChild(el("span", { class: "crumb-st", text: (station.badge.length < 3 ? station.badge + " · " : "") + station.titleEn }));
    if (screen.titleEn && screen.titleEn !== station.titleEn) {
      crumb.appendChild(el("span", { class: "crumb-sep", text: " › " }));
      crumb.appendChild(el("span", { class: "crumb-now", text: screen.titleEn }));
    }
    head.appendChild(el("h1", { id: "slideTitle", tabindex: "-1", text: screen.titleAr }));
    head.appendChild(crumb);
    if (station.outline && !screen.outline) head.appendChild(outlineTrack(station, screen));
    slide.appendChild(head);
    const grid = el("div", { class: "slide-grid" });
    const textCol = el("div", { class: "col-text" });
    const visCol = el("div", { class: "col-vis" });
    grid.appendChild(textCol);
    grid.appendChild(visCol);
    slide.appendChild(grid);
    screen.render(apiFor(textCol, visCol));
    if (!visCol.children.length) grid.classList.add("solo");

    isolateMath(slide);
    const main = document.getElementById("main");
    main.replaceChildren(slide);
    watchMath();
    renderRail();
    renderPager();
    paintScore();
    saveStore();
    if (dir) {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      document.getElementById("slideTitle").focus({ preventScroll: true });
    }
  }

  function go(delta) {
    const station = stations[state.index];
    const next = state.screen + delta;
    if (next >= 0 && next < station.screens.length) {
      state.screen = next;
      render(delta);
      return;
    }
    if (delta > 0 && state.index < stations.length - 1) {
      openAt(state.index + 1, 0);
      render(1);
    } else if (delta < 0 && state.index > 0) {
      state.index -= 1;
      state.screen = stations[state.index].screens.length - 1;
      render(-1);
    }
  }

  function wire() {
    document.getElementById("prev").addEventListener("click", function () { go(-1); });
    document.getElementById("next").addEventListener("click", function () { go(1); });

    document.addEventListener("click", function (event) {
      const speakBtn = event.target.closest("[data-speak]");
      if (speakBtn) {
        event.stopPropagation();
        const holder = speakBtn.closest("[data-term]");
        if (holder) showTip(holder);
        const term = (window.DICT || {})[speakBtn.dataset.speak];
        if (term) speakWord(term.speech);
        return;
      }
      const hint = event.target.closest("[data-hint]");
      if (hint) {
        if (tipAnchor === hint && !document.getElementById("tip").hidden) hideTip();
        else showTip(hint);
        return;
      }
      const term = event.target.closest("[data-term]");
      if (term) { showTip(term); return; }
      if (!event.target.closest("#tip")) hideTip();
    });
    document.addEventListener("mouseover", function (event) {
      const anchor = event.target.closest("[data-term], [data-hint]");
      if (anchor && anchor !== tipAnchor) showTip(anchor);
    });
    document.addEventListener("mouseout", function (event) {
      const anchor = event.target.closest("[data-term], [data-hint]");
      if (!anchor) return;
      const next = event.relatedTarget;
      if (next && anchor.contains(next)) return;
      if (anchor.contains(document.activeElement)) return;
      hideTip();
    });
    document.addEventListener("focusin", function (event) {
      const anchor = event.target.closest("[data-term], [data-hint]");
      if (anchor) showTip(anchor);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") { hideTip(); return; }
      const t = event.target;
      if (t.closest && t.closest("input, textarea, select, [contenteditable]")) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); go(1); }
      else if (event.key === "ArrowRight") { event.preventDefault(); go(-1); }
    });
    window.addEventListener("scroll", hideTip, { passive: true });
    window.addEventListener("resize", function () { if (tipAnchor) placeTip(tipAnchor); });

    document.getElementById("reset").addEventListener("click", function () {
      if (!window.confirm("سيُمسح تقدّمك وإجاباتك المحفوظة. هل تريد البدء من جديد؟")) return;
      state.index = 0;
      state.screen = 0;
      state.max = 0;
      state.scores = {};
      try { localStorage.removeItem(KEY); } catch (err) {}
      render(-1);
    });
  }

  /* ---------- العناوين الرئيسة وفروعها ---------- */

  function itemsOf(map) {
    if (!map || map[1] == null) return [];
    return Array.isArray(map[1]) ? map[1] : [map[1]];
  }

  function findScreen(station, b, i) {
    let first = -1;
    for (let k = 0; k < station.screens.length; k++) {
      const m = station.screens[k].map;
      if (!m || m[0] !== b) continue;
      if (i == null) return k;
      if (itemsOf(m).indexOf(i) >= 0) return k;
      if (first < 0) first = k;
    }
    return first;
  }

  function jumpTo(station, k) {
    if (k < 0) return;
    const dir = k > state.screen ? 1 : -1;
    state.screen = k;
    render(dir);
  }

  function outlineScreen(station) {
    const o = station.outline;
    return {
      cov: [],
      outline: true,
      titleAr: "العناوين الرئيسة وفروعها",
      titleEn: "Main headings and their branches",
      render: function (api) {
        api.p(o.leadAr);
        api.add(el("p", { class: "lead-en", lang: "en", dir: "ltr", text: o.lead }));
        api.p("تقوم هذه المحطة على " + o.branches.length + " عناوين رئيسة. تحت كل عنوان فروعه، ومعه مثال من حياتك. اضغط أي فرع لتنتقل إلى شاشته.");
        const tree = el("div", { class: "otree" });
        o.branches.forEach(function (branch, b) {
          const card = el("section", { class: "ot-card" });
          const head = el("button", { type: "button", class: "ot-head" },
            el("span", { class: "ot-num", dir: "ltr", text: String(b + 1) }),
            el("span", { class: "ot-titles" },
              el("span", { class: "ot-ar", text: branch.ar }),
              el("span", { class: "ot-en", lang: "en", dir: "ltr", text: branch.en })));
          head.addEventListener("click", function () { jumpTo(station, findScreen(station, b)); });
          card.appendChild(head);
          if (branch.items && branch.items.length) {
            const list = el("ol", { class: "ot-items" });
            branch.items.forEach(function (item, i) {
              const btn = el("button", { type: "button", class: "ot-item" },
                el("span", { class: "ot-item-ar", text: item.ar }),
                el("span", { class: "ot-item-en", lang: "en", dir: "ltr", text: item.en }));
              btn.addEventListener("click", function () { jumpTo(station, findScreen(station, b, i)); });
              list.appendChild(el("li", null, btn));
            });
            card.appendChild(list);
          }
          card.appendChild(el("p", { class: "ot-life" }, el("strong", { text: "من حياتك: " }), branch.life));
          tree.appendChild(card);
        });
        api.add(tree);
      }
    };
  }

  function outlineTrack(station, screen) {
    const o = station.outline;
    const map = screen.map;
    const nav = el("nav", { class: "outline-track", "aria-label": "العناوين الرئيسة في هذه المحطة" });
    const row = el("ol", { class: "ot-branches" });
    o.branches.forEach(function (branch, b) {
      const on = map && map[0] === b;
      const btn = el("button", { type: "button", class: "ot-b" + (on ? " on" : ""), title: branch.en },
        el("span", { class: "ot-n", dir: "ltr", text: String(b + 1) }),
        el("span", { class: "ot-bn", text: branch.ar }),
        el("span", { class: "ot-bn-en", lang: "en", dir: "ltr", text: branch.en }));
      if (on) btn.setAttribute("aria-current", "true");
      btn.addEventListener("click", function () { jumpTo(station, findScreen(station, b)); });
      row.appendChild(el("li", null, btn));
    });
    const mapBtn = el("button", { type: "button", class: "ot-b ot-map", text: "☰ كل الفروع" });
    mapBtn.addEventListener("click", function () { jumpTo(station, 0); });
    row.appendChild(el("li", null, mapBtn));
    nav.appendChild(row);
    if (map) {
      const branch = o.branches[map[0]];
      const items = itemsOf(map).map(function (i) { return branch.items[i]; }).filter(Boolean);
      const now = el("div", { class: "ot-now" });
      now.appendChild(el("span", { class: "ot-now-tag", text: "أنت في: " + branch.ar }));
      items.forEach(function (item) {
        now.appendChild(el("span", { class: "ot-now-item" },
          el("span", { class: "ot-item-ar", text: item.ar }),
          el("span", { class: "ot-item-en", lang: "en", dir: "ltr", text: item.en })));
      });
      nav.appendChild(now);
      nav.appendChild(el("p", { class: "ot-life" }, el("strong", { text: "من حياتك: " }), (items[0] || branch).life));
    }
    return nav;
  }

  /* ---------- شاشة مختصرة ---------- */

  function lesson(o) {
    return {
      cov: o.cov || [],
      titleAr: o.titleAr,
      titleEn: o.titleEn,
      part: o.part || "",
      render: function (api) {
        if (o.tag) api.add(el("span", { class: "tag", text: o.tag }));
        if (o.story) api.story(o.story);
        (o.lines || []).forEach(function (line) {
          if (typeof line === "string") api.p(line);
          else api.p(line.text, line.cov);
        });
        if (o.points) api.points(o.points);
        if (o.example) api.example(o.example, o.exampleCov);
        (o.codes || []).forEach(function (c) { api.code(c.code, c.cov, c.where, c.label); });
        (o.terms || []).forEach(function (t) { api.term(t[0], t[1]); });
        (o.hints || []).forEach(function (h) { api.hint(h.cov, h.label, h.text, o.hintsWhere); });
        if (typeof o.art === "function") o.art(api);
        else if (o.art) api.art(o.art, o.caption);
        if (o.game) {
          if (o.game.kind === "order") api.order(o.game);
          else api.bins(o.game);
        }
        if (o.link) api.link(o.link);
        if (o.quiz) api.quiz(o.quiz);
      }
    };
  }

  window.UI = {
    stations: stations,
    register: function (station) {
      const o = (window.OUTLINE || {})[station.id];
      if (o) {
        station.outline = o;
        if (o.map.length !== station.screens.length) console.error("outline map length mismatch: " + station.id);
        station.screens.forEach(function (screen, i) { screen.map = o.map[i] || null; });
        station.screens.unshift(outlineScreen(station));
      }
      stations.push(station);
    },
    goTo: function (id, screen) {
      const index = stations.findIndex(function (s) { return s.id === id; });
      if (index < 0) return;
      const dir = index > state.index || (index === state.index && screen > state.screen) ? 1 : -1;
      openAt(index, screen || 0);
      render(dir);
    },
    lesson: lesson,
    el: el,
    ar: ar,
    esc: esc,
    fromMarkup: fromMarkup,
    termNode: termNode,
    store: function (key, value) { const o = {}; o[key] = value; saveStore(o); },
    recall: function (key) { return loadStore()[key]; },
    saveDraft: function (text) { saveStore({ draft: text }); },
    loadDraft: function () { return loadStore().draft || ""; },
    current: function () { return stations[state.index] ? stations[state.index].id : ""; },
    start: function () {
      const saved = loadStore();
      state.scores = saved.scores || {};
      const found = stations.findIndex(function (station) { return station.id === saved.station; });
      const maxFound = stations.findIndex(function (station) { return station.id === saved.maxId; });
      if (found >= 0) {
        state.index = found;
        state.screen = Math.min(saved.screen || 0, stations[found].screens.length - 1);
      }
      state.max = Math.max(found, maxFound, 0);
      const tools = document.getElementById("tools");
      tools.appendChild(el("a", { id: "previewLink", href: previewOn() ? location.pathname : location.pathname + "?preview", text: previewOn() ? "إغلاق وضع المعلمة" : "وضع المعلمة" }));
      if (previewOn()) document.body.classList.add("preview");
      wire();
      if (window.speechSynthesis) {
        speechSynthesis.onvoiceschanged = function () { voiceReady = true; };
        if (speechSynthesis.getVoices().length) voiceReady = true;
      } else voiceReady = true;
      render(0);
    }
  };
})();
