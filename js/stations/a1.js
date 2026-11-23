(function () {
  const L = UI.lesson;
  const A = window.ART;
  const C = A.C;

  /* ---------- رسم متحرك: معنى التفكيك ---------- */
  function decMotion(body) {
    const W = 560, H = 330;
    const big = { x: 160, y: 22, w: 240, h: 78 };
    const phases = [
      { t: "المتطلبات", s: "مقابلات واستبيان", c: C.sky },
      { t: "تجربة المستخدم", s: "رسومات أولية", c: C.vio },
      { t: "البرمجة", s: "أجزاء صغيرة", c: C.teal },
      { t: "الاختبار", s: "طلاب يجرّبون", c: C.amber }
    ];
    const px = [425, 290, 155, 20];
    const parts = ["البداية", "الأسئلة", "النقاط", "المؤقت"];
    const sx = [440, 310, 180, 50];
    const pw = 115, ph = 62, sw = 80, sh = 40, py = 150, sy = 262;
    const mid = { x: 280, y: 185 };
    let s = "";
    s += '<g data-k="big" class="mg">' + A.box(big.x, big.y, big.w, big.h, C.rose, { fo: 0.16, sw: 2 }) +
      A.text(280, 56, "لعبة أسئلة الرياضيات", { size: 18, weight: 700 }) +
      A.text(280, 82, "مسألة كبيرة: من أين أبدأ؟", { size: 13, color: C.mute }) + "</g>";
    phases.forEach(function (p, i) {
      const cx = px[i] + pw / 2;
      s += '<line data-k="l' + i + '" class="mg" x1="280" y1="100" x2="' + cx + '" y2="' + py + '" stroke="' + p.c + '" stroke-width="2" stroke-dasharray="5 5"/>';
      s += '<g data-k="p' + i + '" class="mg">' + A.box(px[i], py, pw, ph, p.c, { fo: 0.16, sw: 2 }) +
        A.text(cx, py + 27, p.t, { size: 15, weight: 700 }) + A.text(cx, py + 47, p.s, { size: 11, color: C.mute }) +
        '<g data-k="k' + i + '" class="mg"><circle cx="' + (px[i] + pw - 4) + '" cy="' + (py + 4) + '" r="11" fill="' + C.teal + '"/>' +
        '<path d="M' + (px[i] + pw - 9) + " " + (py + 4) + ' l4 4 l7 -8" fill="none" stroke="' + C.bg + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g></g>';
    });
    parts.forEach(function (t, i) {
      const cx = sx[i] + sw / 2;
      s += '<line data-k="m' + i + '" class="mg" x1="' + (px[2] + pw / 2) + '" y1="' + (py + ph) + '" x2="' + cx + '" y2="' + sy + '" stroke="' + C.teal + '" stroke-width="1.6" stroke-dasharray="4 4"/>';
      s += '<g data-k="s' + i + '" class="mg">' + A.box(sx[i], sy, sw, sh, C.teal, { fo: 0.12, r: 10 }) +
        A.text(cx, sy + 25, t, { size: 13, weight: 700 }) +
        '<g data-k="q' + i + '" class="mg"><circle cx="' + (sx[i] + sw - 2) + '" cy="' + (sy + 2) + '" r="9" fill="' + C.teal + '"/>' +
        '<path d="M' + (sx[i] + sw - 6) + " " + (sy + 2) + ' l3 3 l6 -6" fill="none" stroke="' + C.bg + '" stroke-width="2.2" stroke-linecap="round"/></g></g>';
    });
    s += '<g data-k="done" class="mg">' + A.box(150, 120, 260, 130, C.teal, { fo: 0.18, sw: 2.5 }) +
      A.text(280, 170, "اللعبة جاهزة", { size: 22, weight: 700, color: C.teal }) +
      A.text(280, 200, "أجزاء صغيرة سليمة = حل كامل", { size: 14 }) +
      A.text(280, 226, "كل جزء اختُبر وحده قبل التجميع", { size: 12, color: C.mute }) + "</g>";
    const holder = UI.el("div", { class: "motion" });
    holder.innerHTML = A.svg(W, H, s, "رسم متحرك يوضح تقسيم مسألة كبيرة إلى أجزاء ثم تجميعها");
    body.appendChild(holder);
    const row = UI.el("div", { class: "row" });
    const play = UI.el("button", { type: "button", class: "btn small", text: "▶ شغّل" });
    row.appendChild(play);
    const cap = UI.el("p", { class: "readout motion-cap" });
    body.appendChild(row);
    body.appendChild(cap);
    const svg = holder.querySelector("svg");
    function g(k) { return svg.querySelector('[data-k="' + k + '"]'); }
    function set(k, op, tf) { const n = g(k); if (!n) return; n.style.opacity = op; n.style.transform = tf || "none"; }
    function toward(x, y, cx, cy) { return "translate(" + (x - cx) + "px," + (y - cy) + "px) scale(.35)"; }
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timers = [];
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function at(ms, fn) { timers.push(setTimeout(fn, reduce ? 0 : ms)); }
    function start() {
      set("big", 1, "none");
      set("done", 0, "scale(.6)");
      phases.forEach(function (p, i) {
        set("p" + i, 0, toward(280, 61, px[i] + pw / 2, py + ph / 2));
        set("l" + i, 0); set("k" + i, 0, "scale(0)");
      });
      parts.forEach(function (t, i) {
        set("s" + i, 0, toward(px[2] + pw / 2, py + ph / 2, sx[i] + sw / 2, sy + sh / 2));
        set("m" + i, 0); set("q" + i, 0, "scale(0)");
      });
      cap.textContent = "مسألة كبيرة واحدة. صعب أن تحلها دفعة واحدة.";
    }
    function run() {
      clear();
      svg.classList.add("no-anim");
      start();
      void svg.getBoundingClientRect();
      svg.classList.remove("no-anim");
      play.disabled = true;
      at(900, function () {
        set("big", 0.45, "scale(.94)");
        phases.forEach(function (p, i) { set("p" + i, 1, "none"); set("l" + i, 1); });
        cap.textContent = "1. تنقسم إلى أربع مراحل: المتطلبات، وتجربة المستخدم، والبرمجة، والاختبار.";
      });
      at(3000, function () {
        parts.forEach(function (t, i) { set("s" + i, 1, "none"); set("m" + i, 1); });
        cap.textContent = "2. البرمجة نفسها كبيرة، فتنقسم مرة أخرى إلى أجزاء أصغر.";
      });
      parts.forEach(function (t, i) {
        at(4900 + i * 500, function () { set("q" + i, 1, "scale(1)"); cap.textContent = "3. كل جزء صغير يُبنى ويُختبر وحده: " + t + " ✓"; });
      });
      phases.forEach(function (p, i) {
        at(7100 + i * 400, function () { set("k" + i, 1, "scale(1)"); cap.textContent = "4. اكتملت مرحلة " + p.t + " ✓"; });
      });
      at(9100, function () {
        phases.forEach(function (p, i) { set("p" + i, 0, toward(mid.x, mid.y, px[i] + pw / 2, py + ph / 2)); set("l" + i, 0); });
        parts.forEach(function (t, i) { set("s" + i, 0, toward(mid.x, mid.y, sx[i] + sw / 2, sy + sh / 2)); set("m" + i, 0); });
        set("big", 0, "scale(.8)");
        cap.textContent = "5. تعود الأجزاء وتلتقي في حل واحد…";
      });
      at(10000, function () {
        set("done", 1, "none");
        cap.textContent = "هذا هو التفكيك: قسّم، وحُلّ كل جزء وحده، ثم اجمع.";
        play.disabled = false;
        play.textContent = "↺ شغّل مرة أخرى";
      });
    }
    play.addEventListener("click", run);
    start();
    const main = document.getElementById("main");
    const obs = new MutationObserver(function () { if (!document.body.contains(holder)) { clear(); obs.disconnect(); } });
    if (main) obs.observe(main, { childList: true });
  }

  /* ---------- التفكيك: الوجبة ---------- */
  function meal(api) {
    api.story({
      icon: "pot", color: C.amber, who: "يوم الجمعة، مطبخ البيت",
      text: "تحضّر أمّ سامي مقلوبة لثمانية أشخاص. هي لا تطبخ كل شيء دفعة واحدة. تنهي خطوة صغيرة، وتتأكد منها، ثم تنتقل إلى التي بعدها."
    });
    api.p("التفكيك تقسيم الفكرة المعقدة إلى أجزاء أصغر حتى يسهل فهمها وحلها. إن أمكن أن تختبر جزءًا وحده ثم تعيده إلى الحل الكامل، فهذا تفكيك.", "A1-DEC");
    api.example("الجزء الصغير أسهل في الكتابة والقراءة والتصحيح، ويمكن لأكثر من شخص أن يعمل عليه في الوقت نفسه.", null, "فائدته في البرنامج");
    api.term("decomposition", "التفكيك");
    api.hint("A1-H-LIMIT", "هل للتفكيك حد؟", "لا حد لعدد الخطوات ولا لعمق التفكيك. تتوقف حين تصل إلى مستوى فهم مقبول.");
    api.lab({
      title: "التفكيك بالحركة",
      tag: "حركة",
      line: "اضغط «شغّل» وراقب المسألة الكبيرة تنقسم، ثم تُحل أجزاؤها، ثم تعود حلًّا واحدًا.",
      build: function (body) { decMotion(body); }
    });
    const steps = [
      { s: "قبل البرمجة", t: "جمع المتطلبات", d: "مقابلة مع معلم الرياضيات، واستبيان قصير لطلاب الصف السابع: ماذا يحبون؟ وكم دقيقة يلعبون؟", o: "قائمة احتياجات واضحة." },
      { s: "قبل البرمجة", t: "فهم المستخدم", d: "تصف رنا طالبًا نموذجيًا: «عمر، 12 سنة، يلعب على هاتف أهله بعد الواجب».", o: "شخصية مستخدم تعود إليها في كل قرار." },
      { s: "قبل البرمجة", t: "تجربة المستخدم UX", d: "ترسم الشاشات على ورق: البداية، والسؤال، والنتيجة، وتجرّبها مع ثلاثة طلاب قبل أي كود.", o: "رسومات أولية مُجرَّبة." },
      { s: "قبل البرمجة", t: "التصميم البصري UI", d: "تختار الألوان والخط، وتجعل الأزرار كبيرة تناسب إصبع طفل.", o: "نموذج تصميم يوافق عليه المعلم." },
      { s: "قبل البرمجة", t: "وثيقة المتطلبات والخطة", d: "تدوّن ما ستفعله اللعبة وما لن تفعله، وتوزّع العمل على أسبوعين.", o: "وثيقة يوقّع عليها المعلم." },
      { s: "البرمجة", t: "تفكيك البرمجة إلى أجزاء", d: "شاشة البداية، وبنك الأسئلة، وحساب النقاط، والمؤقت، وشاشة النتيجة.", o: "قائمة مهام، كل مهمة صغيرة." },
      { s: "البرمجة", t: "بناء كل جزء واختباره وحده", d: "تختبر بنك الأسئلة قبل ربطه بالشاشة: هل تُقرأ الأسئلة العشرة كلها؟", o: "أجزاء سليمة كلٌّ على حدة." },
      { s: "بعد البرمجة", t: "التجميع واختبار المستخدمين", d: "تربط الأجزاء، ثم يلعب 20 طالبًا، وتسجّل رنا الأخطاء والملاحظات.", o: "قائمة إصلاحات قصيرة." },
      { s: "بعد البرمجة", t: "الإطلاق والصيانة", d: "تُنشر اللعبة للمدرسة، وتُضاف أسئلة جديدة كل فصل.", o: "لعبة تعيش وتتحسن." }
    ];
    api.lab({
      title: "مثال حقيقي: مبرمجة تبني لعبة",
      tag: "مثال",
      cov: "A1-MEAL",
      line: "طلبت مدرسة في الزرقاء من المبرمجة رنا لعبة أسئلة رياضيات. لم تبدأ بالكود، بل فكّكت المشروع كله أولًا.",
      build: function (body) {
        const list = UI.el("ol", { class: "dec-steps" });
        steps.forEach(function (s, i) {
          const stage = s.s === "البرمجة" ? "code" : s.s === "بعد البرمجة" ? "after" : "before";
          const li = UI.el("li", { class: "dec-step st-" + stage },
            UI.el("span", { class: "dec-n", dir: "ltr", text: String(i + 1) }),
            UI.el("div", null,
              UI.el("span", { class: "dec-stage", text: s.s }),
              UI.el("strong", { text: s.t }),
              UI.el("p", { text: s.d }),
              UI.el("p", { class: "dec-check", text: "الناتج: " + s.o })));
          if (i > 0) li.hidden = true;
          list.appendChild(li);
        });
        body.appendChild(list);
        const row = UI.el("div", { class: "row" });
        const next = UI.el("button", { type: "button", class: "btn small", text: "اعرض الخطوة التالية" });
        const all = UI.el("button", { type: "button", class: "btn ghost small", text: "اعرض كل الخطوات" });
        const note = UI.el("p", { class: "readout" });
        function update() {
          const shown = list.querySelectorAll(".dec-step:not([hidden])").length;
          note.textContent = shown < steps.length ? "الخطوة " + shown + " من " + steps.length : "خمس خطوات قبل أول سطر كود. التفكيك يبدأ من فهم المشكلة، لا من البرمجة.";
          next.disabled = shown >= steps.length;
          all.disabled = shown >= steps.length;
        }
        next.addEventListener("click", function () {
          const h = list.querySelector(".dec-step[hidden]");
          if (h) h.hidden = false;
          update();
        });
        all.addEventListener("click", function () {
          list.querySelectorAll(".dec-step").forEach(function (li) { li.hidden = false; });
          update();
        });
        row.appendChild(next);
        row.appendChild(all);
        body.appendChild(row);
        body.appendChild(note);
        update();
      }
    });
    api.quiz({
      id: "a1-dec",
      cov: "A1-DEC-Q",
      prompt: "أي جملة تصف التفكيك هنا؟",
      choices: [
        { id: "a", text: "حل المسألة كلها في خطوة واحدة.", ok: false },
        { id: "b", text: "تقسيمها إلى خطوات تُختبر ثم تُعاد إلى الحل.", ok: true }
      ],
      why: "التفكيك ينتج خطوات منفصلة. في الأجر مثلًا: الإجمالي، ثم الخصومات، ثم الصافي. وحين تكثر الخطوات يصبح الرسم أوضح من الفقرة."
    });
  }

  /* ---------- التفكيك: صافي الأجر ---------- */
  function pay(api) {
    api.story({
      icon: "store", color: C.teal, who: "محل حلويات في وسط البلد",
      text: "يعمل يزن بالساعة في محل حلويات. في آخر الشهر يسأل: كم سأقبض فعلًا؟ الجواب لا يأتي دفعة واحدة، بل في ثلاث خطوات."
    });
    api.p("حساب صافي الأجر مسألة مفككة: تحسب الإجمالي أولًا، ثم الخصومات، ثم الصافي. كل خطوة لها مدخلاتها وناتجها، ويمكن فحصها وحدها.");
    api.points(["الإجمالي = الساعات × أجر الساعة", "الخصومات = الضريبة + خصم آخر", "الصافي = الإجمالي − الخصومات"]);
    api.lab({
      title: "حاسبة صافي الأجر",
      line: "غيّر الأرقام وراقب الخطوات الثلاث تتغير كلٌّ وحدها.",
      cov: "A1-PAY",
      build: function (body) {
        const vals = { hours: 40, rate: 5, tax: 5, other: 15 };
        const grid = UI.el("div", { class: "grid2" });
        const holder = UI.el("div");
        const out = UI.el("p", { class: "readout" });
        [["hours", "الساعات", 1], ["rate", "أجر الساعة (دينار)", 0.5], ["tax", "نسبة الضريبة %", 1], ["other", "خصم آخر (دينار)", 1]].forEach(function (f) {
          const input = UI.el("input", { type: "number", min: "0", step: String(f[2]), value: String(vals[f[0]]) });
          input.addEventListener("input", function () { vals[f[0]] = Math.max(0, Number(input.value) || 0); draw(); });
          grid.appendChild(UI.el("label", { class: "field" }, UI.el("span", { text: f[1] }), input));
        });
        function draw() {
          const gross = vals.hours * vals.rate;
          const ded = gross * vals.tax / 100 + vals.other;
          const net = gross - ded;
          const max = Math.max(gross, 1);
          const bar = function (y, value, c, label) {
            const w = Math.max(4, Math.min(1, Math.abs(value) / max) * 330);
            return A.text(540, y + 22, label, { anchor: "right", size: 15 }) +
              '<rect x="' + (440 - w) + '" y="' + y + '" width="' + w.toFixed(1) + '" height="32" rx="10" fill="' + c + '" fill-opacity=".75" style="transition:all .35s"/>' +
              A.text(440 - w - 10, y + 22, value.toFixed(2), { anchor: "right", en: true, size: 15, color: c });
          };
          holder.innerHTML = A.svg(560, 170, bar(10, gross, C.teal, "1 الإجمالي") + bar(65, ded, C.rose, "2 الخصومات") + bar(120, net, net < 0 ? C.rose : C.amber, "3 الصافي"), "ثلاث خطوات لحساب الأجر");
          out.textContent = "الإجمالي " + gross.toFixed(2) + "، والخصومات " + ded.toFixed(2) + "، والصافي " + net.toFixed(2) + ".";
          out.classList.toggle("bad", net < 0);
        }
        body.appendChild(grid);
        body.appendChild(holder);
        body.appendChild(out);
        draw();
      }
    });
    api.link("لأن الأجر قُسّم إلى خطوات يمكن اختبارها، فإنك تفهم كل جزء وحده، لذلك يسهل إعادة التركيب واكتشاف الخطأ.");
  }

  /* ---------- الأنماط: المركبات ---------- */
  function patterns(api) {
    api.story({
      icon: "bus", color: C.sky, who: "دوار الداخلية، ساعة الذروة",
      text: "تمرّ سيارة أجرة صفراء، ثم حافلة، ثم شاحنة. تبدو مختلفة، لكن تحت اللون والحجم بنية واحدة تتكرر."
    });
    api.p("تعرّف النمط أن تجد ما يتكرر داخل المسألة وبين المسائل، وأن تميّز الفروق. ثم تصف النمط، وتتوقع به حالة جديدة.", "A1-PAT");
    api.example("أربع عجلات ومحوران وهيكل وآلية توجيه: هذا مشترك. اللون والحجم: هذا اختلاف.");
    api.term("pattern-recognition", "تعرّف الأنماط");
    api.art(A.tiles([
      { icon: "taxi", label: "سيارة أجرة", c: C.amber },
      { icon: "bus", label: "حافلة", c: C.sky },
      { icon: "truck", label: "شاحنة", c: C.rose }
    ], { cols: 3, th: 100, label: "ثلاث مركبات مختلفة الشكل" }), "ما الذي يتكرر تحت اللون والحجم؟");
    api.bins({
      id: "g-a1-veh",
      cov: "A1-VEH",
      title: "صنّف كل صفة: مشتركة أم مختلفة؟",
      bins: [{ id: "same", label: "مشترك", icon: "≡" }, { id: "diff", label: "اختلاف", icon: "≠" }],
      items: [
        { text: "أربع عجلات", bin: "same" }, { text: "محوران", bin: "same" }, { text: "هيكل", bin: "same" },
        { text: "آلية توجيه", bin: "same" }, { text: "لون الهيكل", bin: "diff" }, { text: "حجم المركبة", bin: "diff" }
      ],
      why: "العجلات والمحاور والهيكل والتوجيه تتكرر في المركبات الثلاث، فهي نمط. اللون والحجم يختلفان من مركبة إلى أخرى."
    });
    api.quiz({
      id: "a1-pat",
      cov: "A1-PAT-Q",
      prompt: "ما الذي يبقى بعد أن تتجاوز اللون والحجم؟",
      choices: [
        { id: "a", text: "لا شيء مشترك.", ok: false },
        { id: "b", text: "عجلات ومحاور وهيكل وتوجيه.", ok: true }
      ],
      why: "المشترك نمط، واللون اختلاف. لذلك تستطيع أن تتوقع أن أي مركبة جديدة لها عجلات وهيكل وتوجيه."
    });
  }

  /* ---------- التعميم والتجريد: الطبقات ---------- */
  function layers(api) {
    api.story({
      icon: "phone", color: C.vio, who: "طلب توصيل من تطبيق",
      text: "تضغط «اطلب» في تطبيق التوصيل. لا ترى الخادم ولا قاعدة البيانات ولا الشبكة. كل طبقة تخفي تعقيد ما تحتها."
    });
    api.p("التعميم أن تستخلص من الأنماط قاعدة بسيطة تصلح لحالات كثيرة. والتجريد أن تخفي التفصيل الذي لا يلزمك الآن، فتبقى الطبقة العليا بسيطة.");
    api.example("الحل السابق يصبح نقطة انطلاق. والطبقة العليا تستخدم ما تحتها دون أن تعرف كل تفصيل.");
    api.term("pattern-generalisation", "تعميم النمط");
    api.term("abstraction", "التجريد");
    api.lab({
      title: "طبقات التطبيق",
      line: "اضغط طبقة لتخفيها. الطبقة التي فوقها تبقى تعمل دون أن تكشف ما تحتها.",
      cov: "A1-LAYER",
      build: function (body) {
        const names = [["الواجهة", "Interface", "#fb7185"], ["المنطق", "Logic", "#fbbf24"], ["واجهة برمجية", "API", "#a78bfa"], ["قاعدة البيانات", "Database", "#2dd4bf"], ["العتاد", "Hardware", "#38bdf8"]];
        const out = UI.el("p", { class: "readout", text: "كل الطبقات ظاهرة. أنت تتعامل مع الواجهة فقط." });
        const stack = UI.el("div", { class: "row", style: "flex-direction:column;align-items:stretch;gap:.4rem" });
        names.forEach(function (n, i) {
          const b = UI.el("button", { type: "button", class: "layer-btn", style: "background:" + n[2] + ";width:" + (100 - i * 6) + "%;align-self:center" }, UI.el("span", { text: n[0] }), UI.el("small", { lang: "en", text: n[1] }));
          b.addEventListener("click", function () {
            b.classList.toggle("off");
            const hidden = stack.querySelectorAll(".off").length;
            out.textContent = hidden ? "أخفيت " + UI.ar(hidden) + " من الطبقات، والطلب ما زال يصل. هذا هو التجريد." : "كل الطبقات ظاهرة. أنت تتعامل مع الواجهة فقط.";
          });
          stack.appendChild(b);
        });
        body.appendChild(stack);
        body.appendChild(out);
      }
    });
    api.link("لأن المركبات تشترك في البنية رغم اختلاف المظهر، فإن القاعدة العامة تصلح لمركبة جديدة، لذلك يبدأ الحل من المشترك لا من اللون.");
  }

  /* ---------- التصفية: أجرة التوصيل ---------- */
  function filter(api) {
    api.story({
      icon: "truck", color: C.teal, who: "مطعم في إربد",
      text: "يريد صاحب المطعم برنامجًا يحسب أجرة التوصيل. الزبون كتب في الطلب أشياء كثيرة. أيها يحتاجه البرنامج فعلًا؟"
    });
    api.p("المعلومة التي لا تغير القرار تُستبعد، مع ذكر سبب الاستبعاد. الاستبعاد يحمي الحل من التشتت.", "A1-FILTER");
    api.example("في حساب أجرة التوصيل لا يلزمك لون الحذاء. يلزمك قيمة الطلب والمسافة.");
    api.term("filtering", "التصفية");
    api.bins({
      id: "g-a1-filter",
      title: "ماذا يحتاج حساب أجرة التوصيل؟",
      bins: [{ id: "keep", label: "أُبقيه", icon: "✓" }, { id: "drop", label: "أستبعده", icon: "✗" }],
      items: [
        { text: "قيمة الطلب", bin: "keep" }, { text: "المسافة", bin: "keep" }, { text: "لون الحذاء", bin: "drop" },
        { text: "اسم القطة", bin: "drop" }, { text: "طقس الأمس", bin: "drop" }
      ],
      why: "قيمة الطلب والمسافة تغيران الأجرة. أما لون الحذاء واسم القطة وطقس الأمس فلا تغير القرار، لذلك تُستبعد."
    });
    api.quiz({
      id: "a1-filter",
      cov: "A1-FILTER-Q",
      prompt: "لماذا يُستبعد لون الحذاء من حساب الأجرة؟",
      choices: [
        { id: "a", text: "لأنه لا يغير قرار الأجرة.", ok: true },
        { id: "b", text: "لأن كل معلومة يجب أن تدخل الحساب.", ok: false }
      ],
      why: "التصفية تُبقي ما يؤثر في الناتج. لون الحذاء لا يغير الأجرة، لذلك يُستبعد مع ذكر السبب."
    });
  }

  /* ---------- المتغير والثابت ---------- */
  function variables(api) {
    api.story({
      icon: "receipt", color: C.amber, who: "دكان الحي",
      text: "يبيع أبو خالد عشرات السلع كل يوم. سعر كل سلعة يختلف، أما معدل الضريبة فيبقى نفسه طوال اليوم."
    });
    api.p("المتغير قيمة قد تتغير أثناء التشغيل. والثابت قيمة تبقى كما أُعلنت. إن اختلفت القيمة من عملية إلى أخرى فهي متغير، وإن استقرت مدة معقولة فهي ثابت.");
    api.example("سعر السلعة متغير. معدل الضريبة عشرون في المئة ثابت في هذا اليوم. الاسم الواضح يربط القيمة بمعناها.");
    api.term("variable", "المتغير");
    api.term("constant", "الثابت");
    api.term("input", "المدخل");
    api.term("output", "المخرج");
    api.hint("A1-H-GENDER", "نطاق الجنس", "مدخل الجنس يقبل M أو F فقط. القيمة خارج هذا النطاق تُرفض.");
    api.hint("A1-H-HOUSE", "نطاق السعر", "سعر المنزل في هذا المثال بين 20000 و 2000000. أي قيمة خارج النطاق غير مقبولة.");
    api.bins({
      id: "g-a1-var",
      cov: "A1-VAR",
      title: "ما دور كل عنصر في فاتورة الدكان؟",
      bins: [
        { id: "var", label: "متغير" }, { id: "const", label: "ثابت" }, { id: "in", label: "مدخل" },
        { id: "proc", label: "عملية" }, { id: "out", label: "مخرج" }
      ],
      items: [
        { text: "سعر السلعة", bin: "var" }, { text: "معدل الضريبة", bin: "const" }, { text: "الرقم الذي يكتبه البائع", bin: "in" },
        { text: "ضرب السعر في المعدل", bin: "proc" }, { text: "السعر شامل الضريبة", bin: "out" }
      ],
      why: "السعر يتغير مع كل سلعة فهو متغير. المعدل ثابت طوال اليوم. ما يكتبه البائع مدخل. الضرب عملية. والسعر النهائي على الفاتورة مخرج."
    });
    api.quiz({
      id: "a1-var",
      cov: "A1-VAR-Q",
      prompt: "أي عنصر ثابت في حساب الضريبة لهذا اليوم؟",
      choices: [
        { id: "a", text: "سعر السلعة.", ok: false },
        { id: "b", text: "معدل الضريبة.", ok: true }
      ],
      why: "السعر يتغير مع السلعة فهو متغير ومدخل. المعدل لا يتغير عند كل بيع فهو ثابت. الناتج سعر شامل للضريبة وهو مخرج."
    });
  }

  /* ---------- العمليات الرئيسة والمتكررة: الدهان ---------- */
  function paint(api) {
    api.story({
      icon: "paint", color: C.rose, who: "غرفة جديدة في البيت",
      text: "يريد عمر دهان جدران غرفته. يقيس كل جدار، ويحسب مساحته، ثم يعيد الحساب نفسه للجدار التالي."
    });
    api.p("تمرين الدهان: مساحة الجدار متغير، وتغطية علبة الدهان ثابت، وعدد العلب عملية، والكلفة مخرج.", "A1-PAINT");
    api.p("العملية الرئيسة لا تُفهم المسألة من دونها. والعملية المتكررة تحدث أكثر من مرة، مثل حساب مساحة كل جدار.");
    api.term("key-process", "العملية الرئيسة");
    api.term("repeated-process", "العملية المتكررة");
    api.lab({
      title: "حاسبة الدهان",
      line: "غيّر عدد الجدران ومقاساتها، وراقب ما يتكرر وما يثبت.",
      build: function (body) {
        const v = { walls: 4, w: 4, h: 3 };
        const COVER = 10;
        const PRICE = 8;
        const grid = UI.el("div", { class: "grid3" });
        [["walls", "عدد الجدران", 1, 8], ["w", "العرض (م)", 1, 10], ["h", "الارتفاع (م)", 1, 6]].forEach(function (f) {
          const input = UI.el("input", { type: "range", min: "1", max: String(f[3]), value: String(v[f[0]]) });
          const o = UI.el("output", { text: UI.ar(v[f[0]]) });
          input.addEventListener("input", function () { v[f[0]] = Number(input.value); o.textContent = UI.ar(input.value); draw(); });
          grid.appendChild(UI.el("label", { class: "field" }, UI.el("span", { text: f[1] }), input, o));
        });
        const pic = UI.el("div");
        const out = UI.el("div", { class: "points" });
        function draw() {
          const area = v.w * v.h;
          const total = area * v.walls;
          const cans = Math.ceil(total / COVER);
          let s = "";
          for (let i = 0; i < v.walls; i++) {
            const x = 540 - (i + 1) * 64;
            s += '<g class="rise" style="animation-delay:' + (i * 0.05) + 's"><rect x="' + x + '" y="' + (120 - v.h * 14) + '" width="54" height="' + (v.h * 14) + '" rx="4" fill="' + C.rose + '" fill-opacity=".3" stroke="' + C.rose + '"/>' +
              A.text(x + 27, 140, "×" + area, { en: true, size: 12, color: C.mute }) + "</g>";
          }
          for (let j = 0; j < Math.min(cans, 12); j++) s += A.icon("paint", 520 - j * 42, 160, 36, C.amber);
          pic.innerHTML = A.svg(560, 205, s, "الجدران وعلب الدهان");
          out.innerHTML = "";
          [["عملية متكررة", "مساحة كل جدار = " + v.w + " × " + v.h + " = " + area + " م²، تتكرر " + v.walls + " مرات"],
            ["ثابت", "تغطية العلبة " + COVER + " م²، وسعرها " + PRICE + " دنانير"],
            ["عملية رئيسة", "عدد العلب = تقريب " + total + " ÷ " + COVER + " إلى الأعلى = " + cans],
            ["مخرج", "الكلفة = " + cans + " × " + PRICE + " = " + (cans * PRICE) + " دينارًا"]].forEach(function (r) {
            out.appendChild(UI.el("li", null, UI.el("strong", { text: r[0] + ": " }), r[1]));
          });
        }
        body.appendChild(grid);
        body.appendChild(pic);
        body.appendChild(out);
        draw();
      }
    });
    api.link("لأن المساحة تتغير مع كل جدار والتغطية ثابتة، فإن الحساب نفسه يتكرر، لذلك تكتبه مرة واحدة وتعيد استخدامه.");
  }

  UI.register({
    id: "a1",
    badge: "A1",
    tone: "teal",
    short: "التفكير الحاسوبي",
    shortEn: "Computational thinking",
    titleAr: "مهارات التفكير الحاسوبي",
    titleEn: "Computational thinking skills",
    term: "computational-thinking",
    blurb: "تفكيك المسألة، ثم النمط، والتعميم، وإخفاء ما لا يلزم.",
    screens: [
      L({
        cov: ["A1-FOUR", "A1-FOUR-Q"],
        titleAr: "أربع مهارات قبل الكود",
        titleEn: "Computational thinking skills",
        story: { icon: "taxi", color: C.amber, who: "سائق سيارة أجرة في عمّان", text: "قبل أن ينطلق، يقسّم السائق الطريق إلى أجزاء، ويتذكر الشوارع التي تزدحم كل يوم، ويتجاهل ما لا يهمه، ثم يختار الطريق." },
        lines: [
          { text: "التفكير الحاسوبي أربع مهارات مترابطة: التفكيك، وتعرّف الأنماط، والتعميم، والتجريد. تستخدمها قبل كتابة أي سطر لتفهم المسألة، ثم تختار ما تمثّله في البرنامج.", cov: "A1-FOUR" }
        ],
        terms: [["computational-thinking", "التفكير الحاسوبي"]],
        art: A.tiles([
          { icon: "layers", label: "التفكيك", sub: "Decomposition", subEn: true, c: C.teal },
          { icon: "eye", label: "تعرّف الأنماط", sub: "Pattern recognition", subEn: true, c: C.amber },
          { icon: "sparkle", label: "التعميم", sub: "Pattern generalisation", subEn: true, c: C.vio },
          { icon: "filter", label: "التجريد", sub: "Abstraction", subEn: true, c: C.rose }
        ], { cols: 2, th: 120, label: "المهارات الأربع" }),
        caption: "المهارات الأربع تعمل معًا، لا واحدة بعد أخرى فقط",
        quiz: {
          id: "a1-four",
          cov: "A1-FOUR-Q",
          prompt: "متى تُستخدم هذه المهارات؟",
          choices: [
            { id: "a", text: "بعد انتهاء البرنامج فقط.", ok: false },
            { id: "b", text: "قبل الكتابة، لفهم المسألة وتمثيلها.", ok: true }
          ],
          why: "المهارات الأربع تسبق السطر الأول. التفكيك يجزّئ، والنمط يكشف التكرار، والتعميم يستنتج، والتجريد يخفي التفصيل غير اللازم."
        }
      }),
      { cov: ["A1-DEC", "A1-MEAL", "A1-DEC-Q", "A1-H-LIMIT"], titleAr: "التفكيك", titleEn: "Decomposition", render: meal },
      { cov: ["A1-PAY"], titleAr: "خطوات منفصلة: صافي الأجر", titleEn: "Breaking down problems into distinct steps", render: pay },
      L({
        cov: ["A1-TERM", "A1-TERM-Q", "A1-H-FIN"],
        titleAr: "وصف المسألة بلغة مجالها",
        titleEn: "Identifying and describing problems and processes",
        story: { icon: "calc", color: C.sky, who: "قسم المحاسبة في شركة", text: "تشرح المبرمجة مسألة الرواتب لمحاسب. لو قالت «الرقم الكبير والرقم الصغير» لضاع المعنى. هو ينتظر: إجمالي، وخصم، وضريبة، وصافٍ." },
        lines: [
          { text: "أول مرحلة بعد التفكيك أن تصف المسألة بكلمات مجالها. الكلمات التي يصعب فهمها خارج المجال تُسمّى المصطلح.", cov: "A1-TERM" }
        ],
        terms: [["terminology", "المصطلح"]],
        hints: [{ cov: "A1-H-FIN", label: "مثال مالي", text: "في مسألة الراتب تُستخدم كلمات القطاع: أجر، وخصم، وضريبة. لا تُستبدل بكلمات عامة تضيّع المعنى." }],
        art: A.duo(
          { icon: "chat", title: "كلمات عامة", c: C.rose, lines: ["الرقم الكبير", "الشيء الذي يُطرح", "الباقي"] },
          { icon: "money", title: "لغة المال", c: C.teal, lines: ["الإجمالي", "الخصم والضريبة", "الصافي"] },
          { mid: "→", label: "من كلمات عامة إلى مصطلح المجال" }
        ),
        caption: "المعنى نفسه، لكن المصطلح أدق عند أهل المجال",
        quiz: {
          id: "a1-term",
          cov: "A1-TERM-Q",
          prompt: "تشرح مسألة راتب لمحاسب. أي لغة أنسب؟",
          choices: [
            { id: "a", text: "كلمات عامة لا علاقة لها بالمال.", ok: false },
            { id: "b", text: "مصطلحات الأجر والخصم والضريبة.", ok: true }
          ],
          why: "تصف المسألة بلغة مجالها. المصطلح لفظ يستخدمه أهل المجال وقد يصعب على من خارجه."
        }
      }),
      L({
        cov: ["A1-DOC", "A1-DOC-Q"],
        titleAr: "خطوات منظمة يتبعها غيرك",
        titleEn: "Describing problems and processes as a set of structured steps",
        lines: [
          { text: "المرحلة الثالثة أن تدوّن الخطوات بترتيب يستطيع غيرك أن يتبعه. حين تكثر التفرعات يكون الرسم أوضح من فقرة طويلة، فتقول: شاهد الرسم.", cov: "A1-DOC" }
        ],
        example: "طريقك إلى المدرسة: إن كان الدوار مزدحمًا تأخذ الطريق الفرعي، وإلا تكمل في الشارع الرئيسي. التفرع أوضح في رسم.",
        art: function (api) {
          const s = A.box(200, 10, 160, 50, C.teal) + A.text(280, 42, "اخرج من البيت", { size: 15 }) +
            A.arrow(280, 62, 280, 96, C.teal) +
            '<path d="M280 100 L360 145 L280 190 L200 145 Z" fill="' + C.amber + '" fill-opacity=".15" stroke="' + C.amber + '"/>' + A.text(280, 151, "الدوار مزدحم؟", { size: 14 }) +
            A.arrow(360, 145, 450, 145, C.rose) + A.text(405, 135, "نعم", { size: 13, color: C.rose }) +
            A.box(420, 160, 130, 50, C.rose) + A.text(485, 191, "الطريق الفرعي", { size: 14 }) +
            A.arrow(200, 145, 110, 145, C.teal) + A.text(155, 135, "لا", { size: 13, color: C.teal }) +
            A.box(10, 160, 130, 50, C.teal) + A.text(75, 191, "الشارع الرئيسي", { size: 14 }) +
            A.arrow(485, 212, 300, 262, C.mute) + A.arrow(75, 212, 260, 262, C.mute) +
            A.box(200, 262, 160, 48, C.vio) + A.text(280, 292, "المدرسة", { size: 15 });
          api.art(A.svg(560, 320, s, "مخطط قرار بسيط لطريق المدرسة"), "شاهد الرسم: التفرع أوضح من فقرة");
        },
        quiz: {
          id: "a1-doc",
          cov: "A1-DOC-Q",
          prompt: "متى يُفضَّل الرسم على الفقرة؟",
          choices: [
            { id: "a", text: "حين تتفرع الخطوات ويصعب تتبع النص.", ok: true },
            { id: "b", text: "حين تكون الخطوة واحدة وواضحة.", ok: false }
          ],
          why: "الخطوات المنظمة يتبعها شخص آخر. الرسم يوضح التفرع. والعبارة المستخدمة: شاهد الرسم."
        }
      }),
      L({
        cov: ["A1-COMM", "A1-COMM-Q"],
        titleAr: "إيصال السمات الرئيسة",
        titleEn: "Communicating the key features of problems and processes",
        story: { icon: "users", color: C.vio, who: "اجتماع مع صاحب مخبز", text: "يشرح المبرمج لصاحب المخبز كيف سيعمل برنامج الطلبات. لا يقول «حلقة ومصفوفة»، بل يقول «كل طلب يُسجَّل ويظهر في قائمة اليوم»." },
        lines: [
          { text: "المرحلة الرابعة أن توصل سمات الحل إلى من يبرمج وإلى صاحب الطلب. مع المبرمج تستخدم الكلمات الفنية، ومع صاحب الطلب تستخدم لغة مجاله. الوضوح شرط، والمسألة الغامضة لا تُحل.", cov: "A1-COMM" }
        ],
        art: A.duo(
          { icon: "code", title: "مع المبرمج", c: C.sky, lines: ["مصفوفة الطلبات", "حلقة على كل طلب", "دالة للمجموع"] },
          { icon: "bread", title: "مع صاحب المخبز", c: C.amber, lines: ["قائمة طلبات اليوم", "كل طلب يُراجع", "المجموع آخر اليوم"] },
          { mid: "=", label: "الفكرة نفسها بلغتين" }
        ),
        caption: "الفكرة نفسها، والكلمات تتغير مع السامع",
        quiz: {
          id: "a1-comm",
          cov: "A1-COMM-Q",
          prompt: "ماذا يتغير حين تكلّم صاحب الطلب؟",
          choices: [
            { id: "a", text: "تستخدم لغة مجاله، لا المصطلح الفني وحده.", ok: true },
            { id: "b", text: "تخفي خطوات الحل كلها.", ok: false }
          ],
          why: "الإيصال مرن. المبرمج يفهم المصطلح الفني، وصاحب الطلب يفهم لغة قطاعه. المهم أن تصل السمات التي تؤثر في الحل."
        }
      }),
      { cov: ["A1-PAT", "A1-VEH", "A1-PAT-Q"], titleAr: "تعرّف الأنماط", titleEn: "Pattern recognition", render: patterns },
      { cov: ["A1-LAYER"], titleAr: "التعميم والتجريد", titleEn: "Pattern generalisation and abstraction", render: layers },
      L({
        cov: ["A1-INFO", "A1-INFO-Q"],
        titleAr: "المعلومات المطلوبة للحل",
        titleEn: "Identifying information required to solve a problem",
        story: { icon: "chart", color: C.teal, who: "مقصف المدرسة", text: "يطلب المدير تقريرًا عن مبيعات المقصف. قبل أن تبدأ تسأل: ماذا يريد بالضبط؟ ولماذا؟ وبأي شكل؟ ومتى يحتاجه؟" },
        lines: [
          { text: "قبل الحل تحدد أربعة أمور: ما المطلوب، ولماذا، وبأي صيغة، ومتى تلزم المعلومة. إن نقص واحد منها بدأت العمل على مسألة غير المسألة.", cov: "A1-INFO" }
        ],
        art: A.tiles([
          { icon: "question", label: "ما المطلوب؟", sub: "مبيعات الأسبوع", c: C.teal },
          { icon: "target", label: "لماذا؟", sub: "لتقرير الشراء", c: C.amber },
          { icon: "chart", label: "بأي صيغة؟", sub: "رسم أعمدة", c: C.vio },
          { icon: "clock", label: "متى؟", sub: "صباح الأحد", c: C.rose }
        ], { cols: 2, th: 120, label: "أربعة أسئلة قبل الحل" }),
        caption: "أربعة أسئلة تحدد المسألة قبل الحل",
        quiz: {
          id: "a1-info",
          cov: "A1-INFO-Q",
          prompt: "أي بند يمنع تأخر الحل؟",
          choices: [
            { id: "a", text: "متى تلزم المعلومة.", ok: true },
            { id: "b", text: "لون خلفية الشاشة.", ok: false }
          ],
          why: "المطلوب والسبب والصيغة وموعد الحاجة أربعة أسئلة. معرفة موعد الحاجة تمنع تأخر الحل. أما اللون فلا يغيّر صحته."
        }
      }),
      { cov: ["A1-FILTER", "A1-FILTER-Q"], titleAr: "تصفية ما لا يلزم", titleEn: "Filtering out information", render: filter },
      { cov: ["A1-VAR", "A1-VAR-Q", "A1-H-GENDER", "A1-H-HOUSE"], titleAr: "المتغيرات والثوابت والمدخلات والمخرجات", titleEn: "Variables, constants, inputs, outputs", render: variables },
      { cov: ["A1-PAINT"], titleAr: "العمليات الرئيسة والمتكررة", titleEn: "Key processes and repeated processes", render: paint }
    ]
  });
})();
