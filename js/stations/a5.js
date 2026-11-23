(function () {
  const L = UI.lesson;
  const A = window.ART;
  const C = A.C;

  /* ---------- جدول الحقيقة ---------- */
  function truth(api) {
    api.story({ icon: "door", color: C.teal, who: "بوابة منصة المدرسة", text: "تدخل المنصة فقط إن كان اسم المستخدم صحيحًا، وكلمة المرور صحيحة، وحسابك غير محظور. ثلاثة شروط، ونتيجة واحدة." });
    api.p("جدول الحقيقة يسرد كل تركيب لقيم الصدق في تعبير منطقي. كل متغير يأخذ 0 أو 1، والصفوف هي كل التراكيب الممكنة.");
    api.example("الدخول L ينجح فقط مع اسم صحيح U، وكلمة صحيحة P، ومن دون حظر O. التعبير: L = (U·P)·¬O. النقطة تعني «و»، والعلامة ¬ تعني «ليس».");
    api.term("truth-table", "جدول الحقيقة");
    api.term("logical-operator", "العامل المنطقي");
    api.lab({
      title: "اقلب المفاتيح",
      line: "اضغط U و P و O وراقب L والصف المضاء في الجدول.",
      cov: "A5-TRUTH",
      build: function (body) {
        const v = { U: 1, P: 1, O: 0 };
        const rows = [];
        for (let u = 1; u >= 0; u--) for (let p = 1; p >= 0; p--) for (let o = 1; o >= 0; o--) rows.push({ u: u, p: p, o: o, l: (u && p && !o) ? 1 : 0 });
        const sw = UI.el("div", { class: "switches" });
        const names = { U: "اسم المستخدم صحيح", P: "كلمة المرور صحيحة", O: "الحساب محظور" };
        const buttons = {};
        ["U", "P", "O"].forEach(function (k) {
          const b = UI.el("button", { type: "button", class: "switch" }, UI.el("b", { text: k }), UI.el("small", { text: names[k] }), UI.el("span", { class: "val" }));
          b.addEventListener("click", function () { v[k] = v[k] ? 0 : 1; draw(); });
          buttons[k] = b;
          sw.appendChild(b);
        });
        const gate = UI.el("div");
        const table = UI.el("table", { class: "truth" });
        const sum = UI.el("p", { class: "readout" });
        function draw() {
          Object.keys(buttons).forEach(function (k) { buttons[k].setAttribute("aria-pressed", v[k] ? "true" : "false"); buttons[k].querySelector(".val").textContent = String(v[k]); });
          const l = (v.U && v.P && !v.O) ? 1 : 0;
          const c = l ? C.teal : C.rose;
          gate.innerHTML = A.svg(560, 120,
            A.text(280, 30, "L = (U · P) · ¬O", { en: true, size: 20, cls: "mono" }) +
            A.text(280, 62, "(" + v.U + " · " + v.P + ") · ¬" + v.O + "  =  (" + (v.U && v.P ? 1 : 0) + ") · " + (v.O ? 0 : 1), { en: true, size: 15, color: C.mute, cls: "mono" }) +
            '<g class="pulse">' + A.icon(l ? "unlock" : "lock", 250, 70, 46, c) + "</g>" +
            A.text(400, 104, l ? "L = 1  دخول ناجح" : "L = 0  لا دخول", { size: 16, color: c, weight: 700 }), "قيمة L الحالية");
          table.replaceChildren();
          const head = UI.el("tr");
          ["U", "P", "O", "¬O", "L"].forEach(function (h) { head.appendChild(UI.el("th", { text: h })); });
          table.appendChild(head);
          rows.forEach(function (r) {
            const now = r.u === v.U && r.p === v.P && r.o === v.O;
            const tr = UI.el("tr", { class: (now ? "now " : "") + (r.l ? "win" : "") });
            [r.u, r.p, r.o, r.o ? 0 : 1, r.l].forEach(function (x) { tr.appendChild(UI.el("td", { text: String(x) })); });
            table.appendChild(tr);
          });
          const wins = rows.filter(function (r) { return r.l === 1; }).length;
          sum.textContent = "الصفوف " + UI.ar(rows.length) + ": صف ناجح واحد (" + UI.ar(wins) + ")، و" + UI.ar(rows.length - wins) + " غير ذلك.";
        }
        body.appendChild(sw);
        body.appendChild(gate);
        body.appendChild(table);
        body.appendChild(sum);
        draw();
      }
    });
    api.link("لأن النجاح يحتاج الاسم والكلمة ونفي الحظر معًا، فإن صفًا واحدًا فقط يعطي 1، لذلك تكون بقية الصفوف الثمانية سبعة.");
    api.quiz({
      id: "a5-truth",
      cov: "A5-TRUTH-Q",
      prompt: "أي صف يجعل L تساوي 1؟",
      choices: [
        { id: "a", text: "U=1 و P=1 و O=0", ok: true },
        { id: "b", text: "U=1 و P=1 و O=1", ok: false }
      ],
      why: "النقطة تعني «و»، والعلامة ¬ تعني «ليس»، فيجب أن يكون الحظر 0. من ثمانية صفوف ينجح واحد ويفشل سبعة. والصفوف تُولَّد من كل التراكيب، لا تُكتب يدويًا."
    });
  }

  /* ---------- مخطط فن ---------- */
  function venn(api) {
    api.story({ icon: "lock", color: C.vio, who: "نظام شركة صغيرة", text: "صفحة الرواتب لا يفتحها إلا من يعمل في الإدارة وفي المالية معًا. من يملك الوصول؟ ارسم المجموعتين وانظر إلى التقاطع." });
    api.p("المجموعة كائنات مميزة لا يتكرر فيها عنصر. التقاطع ما يوجد في المجموعتين معًا. والتصفية تُبقي من ينطبق عليه الشرط وتستبعد غيره.");
    api.example("الإدارة: جون وأحمد وجو. المالية: كلير وجو ونيامه وفيل.");
    api.term("set", "المجموعة");
    api.term("venn-diagram", "مخطط فن");
    api.term("intersection", "التقاطع");
    api.term("filtering", "التصفية");
    api.lab({
      title: "صفِّ بالضغط على المناطق",
      line: "اضغط منطقة في المخطط لتبقى أسماؤها وحدها مضاءة.",
      cov: "A5-VENN",
      build: function (body) {
        const admins = ["جون", "أحمد", "جو"];
        const finance = ["كلير", "جو", "نيامه", "فيل"];
        const all = ["جون", "أحمد", "جو", "كلير", "نيامه", "فيل"];
        let region = null;
        const holder = UI.el("div", { class: "venn" });
        const people = UI.el("div", { class: "people" });
        const out = UI.el("p", { class: "readout", text: "اضغط منطقة لتصفية الأسماء." });
        const regions = {
          admin: { label: "الإدارة فقط", test: function (n) { return admins.indexOf(n) >= 0 && finance.indexOf(n) < 0; } },
          both: { label: "الإدارتان معًا", test: function (n) { return admins.indexOf(n) >= 0 && finance.indexOf(n) >= 0; } },
          fin: { label: "المالية فقط", test: function (n) { return finance.indexOf(n) >= 0 && admins.indexOf(n) < 0; } },
          any: { label: "الإدارة أو المالية", test: function (n) { return admins.indexOf(n) >= 0 || finance.indexOf(n) >= 0; } }
        };
        function draw() {
          const s =
            '<circle class="region' + (region === "admin" || region === "any" ? " on" : "") + '" data-r="admin" cx="350" cy="150" r="120" fill="' + C.teal + '" fill-opacity=".14" stroke="' + C.teal + '" stroke-width="2"/>' +
            '<circle class="region' + (region === "fin" || region === "any" ? " on" : "") + '" data-r="fin" cx="210" cy="150" r="120" fill="' + C.amber + '" fill-opacity=".14" stroke="' + C.amber + '" stroke-width="2"/>' +
            '<path class="region' + (region === "both" ? " on" : "") + '" data-r="both" d="M280 52 A120 120 0 0 1 280 248 A120 120 0 0 1 280 52 Z" fill="' + C.vio + '" fill-opacity=".2" stroke="' + C.vio + '" stroke-width="2"/>' +
            A.text(400, 28, "الإدارة", { size: 16, color: C.teal, weight: 700 }) + A.text(160, 28, "المالية", { size: 16, color: C.amber, weight: 700 }) +
            A.text(410, 140, "جون", { size: 15 }) + A.text(410, 170, "أحمد", { size: 15 }) +
            A.text(280, 156, "جو", { size: 17, weight: 700 }) +
            A.text(150, 120, "كلير", { size: 15 }) + A.text(150, 150, "نيامه", { size: 15 }) + A.text(150, 180, "فيل", { size: 15 });
          holder.innerHTML = A.svg(560, 290, s, "مخطط فن للإدارة والمالية");
          holder.querySelectorAll("[data-r]").forEach(function (node) {
            node.setAttribute("tabindex", "0");
            node.setAttribute("role", "button");
            node.setAttribute("aria-label", regions[node.getAttribute("data-r")].label);
          });
          people.replaceChildren();
          all.forEach(function (n) {
            const keep = region ? regions[region].test(n) : true;
            people.appendChild(UI.el("span", { class: "person" + (region ? (keep ? " in" : " out") : ""), text: n }));
          });
        }
        function pick(r) {
          region = r;
          const names = all.filter(regions[r].test);
          out.textContent = regions[r].label + ": " + names.join("، ") + (r === "both" ? ". جو وحده في التقاطع، لذلك جو وحده يملك الوصول." : ".");
          draw();
        }
        holder.addEventListener("click", function (e) {
          const t = e.target.closest("[data-r]");
          if (!t) return;
          const r = t.getAttribute("data-r");
          pick(r);
        });
        holder.addEventListener("keydown", function (e) {
          const t = e.target.closest("[data-r]");
          if (t && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pick(t.getAttribute("data-r")); }
        });
        const row = UI.el("div", { class: "row" });
        const both = UI.el("button", { type: "button", class: "btn", "data-cov": "A5-FILT", text: "صفِّ: من في الإدارتين؟" });
        both.addEventListener("click", function () { pick("both"); });
        const any = UI.el("button", { type: "button", class: "chip", text: "الإدارة أو المالية" });
        any.addEventListener("click", function () { pick("any"); });
        row.appendChild(both); row.appendChild(any);
        body.appendChild(holder);
        body.appendChild(row);
        body.appendChild(people);
        body.appendChild(out);
        draw();
      }
    });
    api.link("لأن الوصول يشترط المجموعتين معًا، فإن التقاطع هو جو، لذلك تُستبعد بقية الأسماء.");
    api.quiz({
      id: "a5-venn",
      cov: "A5-VENN-Q",
      prompt: "من يملك الوصول إلى الدالة المحدودة بالإدارتين؟",
      choices: [
        { id: "a", text: "جو فقط.", ok: true },
        { id: "b", text: "كل الأسماء في القائمتين.", ok: false }
      ],
      why: "التقاطع ما ينتمي إلى المجموعتين، وجو مشترك. التصفية تُبقي هذا الشرط وتستبعد غيره. والمجموعة لا تكرر العنصر."
    });
  }

  /* ---------- التكرار ---------- */
  function iteration(api) {
    api.story({ icon: "calc", color: C.amber, who: "حساب الجذر بلا آلة حاسبة", text: "تخمّن أن جذر 2 يساوي 1. تحسّن التخمين بقاعدة واحدة، ثم تطبّق القاعدة نفسها على الناتج الجديد، حتى يثبت الرقم." });
    api.p("التكرار هنا تطبيق الإجراء على نتيجة التطبيق السابق. ليس حلقة الكود فقط، بل أن مخرج الخطوة يصير مدخل الخطوة التالية حتى تستقر النتيجة.", "A5-ITER");
    api.term("iteration", "التكرار");
    api.code("x = 1\nrepeat:\n    x = (x + 2 / x) / 2\nuntil x stops changing", null, "text", "شبه كود");
    api.lab({
      title: "حسّن التخمين",
      line: "اضغط «كرّر»: الناتج يدخل الخطوة التالية حتى يثبت.",
      build: function (body) {
        let x = 1;
        const steps = [x];
        const list = UI.el("ol", { class: "ledger", dir: "ltr" });
        const pic = UI.el("div");
        const out = UI.el("p", { class: "readout" });
        const go = UI.el("button", { type: "button", class: "btn", text: "↻ كرّر" });
        function draw() {
          list.replaceChildren();
          steps.forEach(function (s, i) { list.appendChild(UI.el("li", { style: "font-family:var(--mono)", text: "x" + i + " = " + s.toFixed(6) })); });
          const err = Math.abs(steps[steps.length - 1] - Math.SQRT2);
          let s = "";
          steps.forEach(function (v, i) {
            const x0 = 40 + i * 90;
            s += '<g class="rise">' + '<circle cx="' + x0 + '" cy="60" r="28" fill="' + C.amber + '" fill-opacity=".15" stroke="' + C.amber + '"/>' + A.text(x0, 66, v.toFixed(3), { en: true, size: 12 }) + "</g>";
            if (i) s += A.arrow(x0 - 60, 60, x0 - 30, 60, C.amber);
          });
          pic.innerHTML = A.svg(560, 120, s, "سلسلة التكرار");
          const stable = steps.length > 1 && Math.abs(steps[steps.length - 1] - steps[steps.length - 2]) < 1e-9;
          out.textContent = stable ? "استقرت النتيجة عند " + steps[steps.length - 1].toFixed(6) + ". توقف التكرار." : "الفرق عن الجذر الحقيقي: " + err.toFixed(6);
          go.disabled = stable || steps.length >= 6;
        }
        go.addEventListener("click", function () { x = (x + 2 / x) / 2; steps.push(x); draw(); });
        body.appendChild(pic);
        body.appendChild(UI.el("div", { class: "row" }, go));
        body.appendChild(list);
        body.appendChild(out);
        draw();
      }
    });
    api.quiz({
      id: "a5-iter", cov: "A5-ITER-Q",
      prompt: "ما الذي يميز التكرار المنطقي؟",
      choices: [
        { id: "a", text: "استخدام ناتج الخطوة في الخطوة التالية.", ok: true },
        { id: "b", text: "تنفيذ الخطوة مرة واحدة ثم التوقف دائمًا.", ok: false }
      ],
      why: "كل دورة تأخذ ما أنتجته الدورة السابقة، والتوقف حين تبلغ الحالة المطلوبة."
    });
  }

  /* ---------- الروابط ---------- */
  function connectives(api) {
    api.story({ icon: "ticket", color: C.vio, who: "سينما في سيتي مول", text: "تدخل الفيلم إن كان معك مال أو تذكرة. يكفي أحدهما. أما الغرامة فتجب إن غاب المال وكان الخصم المباشر مستحقًا." });
    api.p("القضية جملة إما صحيحة وإما خاطئة، لا الاثنتان. «الشمس حارة» قضية صحيحة، و«اثنان زائد ثلاثة يساوي ستة» قضية خاطئة. والروابط خمسة: و، أو، ليس، إن… فإن، إذا وفقط إذا.", "A5-CONN");
    api.term("proposition", "القضية");
    api.term("connective", "الرابط");
    api.term("propositional-logic", "المنطق الاقتراحي");
    api.lab({
      title: "مختبر الروابط",
      line: "اختر رابطًا، واقلب القضيتين، وراقب النتيجة.",
      build: function (body) {
        const v = { p: 1, q: 0 };
        let op = "or";
        const ops = {
          and: ["و", "AND", function (p, q) { return p && q; }, "p و q"],
          or: ["أو", "OR", function (p, q) { return p || q; }, "p أو q"],
          not: ["ليس", "NOT", function (p) { return !p; }, "ليس p"],
          imp: ["إن… فإن", "IF…THEN", function (p, q) { return !p || q; }, "إن p فإن q"],
          iff: ["إذا وفقط إذا", "IFF", function (p, q) { return p === q; }, "p إذا وفقط إذا q"]
        };
        const opRow = UI.el("div", { class: "row" });
        const sw = UI.el("div", { class: "switches", style: "grid-template-columns:repeat(2,minmax(0,1fr))" });
        const pb = UI.el("button", { type: "button", class: "switch" }, UI.el("b", { text: "p" }), UI.el("small", { text: "معي مال" }), UI.el("span", { class: "val" }));
        const qb = UI.el("button", { type: "button", class: "switch" }, UI.el("b", { text: "q" }), UI.el("small", { text: "معي تذكرة" }), UI.el("span", { class: "val" }));
        pb.addEventListener("click", function () { v.p = v.p ? 0 : 1; draw(); });
        qb.addEventListener("click", function () { v.q = v.q ? 0 : 1; draw(); });
        sw.appendChild(pb); sw.appendChild(qb);
        const out = UI.el("p", { class: "readout" });
        function draw() {
          opRow.replaceChildren();
          Object.keys(ops).forEach(function (k) {
            const b = UI.el("button", { type: "button", class: "chip", "aria-pressed": op === k ? "true" : "false" }, ops[k][0] + " ", UI.el("small", { lang: "en", text: ops[k][1] }));
            b.addEventListener("click", function () { op = k; draw(); });
            opRow.appendChild(b);
          });
          [[pb, v.p], [qb, v.q]].forEach(function (x) { x[0].setAttribute("aria-pressed", x[1] ? "true" : "false"); x[0].querySelector(".val").textContent = String(x[1]); });
          qb.style.opacity = op === "not" ? "0.35" : "1";
          const r = ops[op][2](!!v.p, !!v.q) ? 1 : 0;
          out.className = "readout" + (r ? "" : " bad");
          out.textContent = ops[op][3] + " = " + r + (op === "or" ? (r ? "  ← تدخل الفيلم" : "  ← لا دخول") : "");
        }
        body.appendChild(opRow);
        body.appendChild(sw);
        body.appendChild(out);
        draw();
      }
    });
    api.quiz({
      id: "a5-conn", cov: "A5-CONN-Q",
      prompt: "الفيلم يُشاهد بمال أو بتذكرة. أي رابط هذا؟",
      choices: [
        { id: "a", text: "أو", ok: true },
        { id: "b", text: "و، بلا بديل.", ok: false }
      ],
      why: "«أو» يكفيها أحد الطرفين، و«و» تطلب الطرفين، و«ليس» تقلب الصدق، و«إن… فإن» تربط الشرط بالنتيجة، و«إذا وفقط إذا» تطلب التلازم في الاتجاهين."
    });
  }

  UI.register({
    id: "a5",
    badge: "A5",
    tone: "teal",
    short: "مبادئ المنطق",
    shortEn: "Logic",
    titleAr: "مبادئ المنطق في تصميم البرامج",
    titleEn: "Principles of logic applied to program design",
    blurb: "ابنِ الشرط واختبر صدقه قبل كتابة البرنامج.",
    screens: [
      L({
        cov: ["A5-WHY", "A5-WHY-Q"],
        titleAr: "لماذا المنطق؟",
        titleEn: "Principles of logic applied to program design",
        story: { icon: "traffic", color: C.amber, who: "إشارة مرور عند دوار", text: "لو أضاءت الإشارة الأخضر للاتجاهين معًا لوقع حادث. الخطأ ليس في لغة البرمجة، بل في المنطق الذي سبقها." },
        lines: [{ text: "المنطق مبادئ تجعل البرنامج يعمل، والتفكير المنطقي أهم من حفظ لغة واحدة. به تعالج البيانات، وتبني الشروط، وتختبر الخوارزمية قبل الكود.", cov: "A5-WHY" }],
        terms: [["algorithm", "الخوارزمية"]],
        art: A.flow([
          { icon: "bulb", label: "الفكرة", c: C.amber },
          { icon: "check", label: "تثبت بالمنطق", c: C.teal },
          { icon: "code", label: "تُكتب بلغة", c: C.vio }
        ], { label: "المنطق يسبق الكود" }),
        caption: "اللغة وعاء لتعبير ثبتت صحته",
        quiz: {
          id: "a5-why", cov: "A5-WHY-Q",
          prompt: "ماذا يسبق نقل الشرط إلى لغة البرمجة؟",
          choices: [
            { id: "a", text: "التأكد من صدقه بالمنطق.", ok: true },
            { id: "b", text: "اختيار لون الزر.", ok: false }
          ],
          why: "المنطق يكشف التناقض قبل التنفيذ، واللغة بعد ذلك وعاء للتعبير الذي ثبتت صحته."
        }
      }),
      L({
        cov: ["A5-INF", "A5-INF-Q", "A5-H-PROLOG"],
        titleAr: "الاستدلال والمغالطة",
        titleEn: "Mathematical logic: inference",
        lines: [{ text: "الاستدلال يبلغ نتيجة من مقدمات تُعرف أو تُعتقد صحتها. كل اللحوم من الحيوانات، ولحم الضأن من الأغنام، والأغنام حيوانات، إذن لحم الضأن من الحيوانات. أما الاستدلال الخاطئ فمغالطة وإن بدا مرتبًا.", cov: "A5-INF" }],
        terms: [["inference", "الاستدلال"], ["fallacy", "المغالطة"], ["prolog", "Prolog"]],
        hints: [{ cov: "A5-H-PROLOG", label: "Prolog", text: "Prolog لغة وقائع وقواعد، يمكن سؤالها عن حقيقة جديدة تُستنتج من القاعدة." }],
        art: function (api) {
          api.art(A.flow([
            { icon: "meat", label: "كل اللحوم من الحيوانات", c: C.teal },
            { icon: "sheep", label: "لحم الضأن من الأغنام", c: C.amber },
            { icon: "check", label: "الأغنام حيوانات", c: C.vio },
            { icon: "star", label: "إذن: لحم الضأن من الحيوانات", c: C.lime }
          ], { dir: "v", label: "سلسلة استدلال" }), "مقدمات صحيحة وربط صحيح، فالنتيجة صحيحة");
          api.order({
            id: "g-a5-inf",
            title: "رتّب سلسلة: لأن… فإن… لذلك",
            items: ["لأن كل الطلاب المسجلين يملكون حسابًا", "وسارة طالبة مسجلة", "فإن سارة تملك حسابًا", "لذلك تستطيع الدخول إلى المنصة"],
            start: [2, 3, 0, 1],
            why: "تبدأ بالقاعدة العامة، ثم الحالة الخاصة، ثم النتيجة، ثم ما يترتب عليها. لو قيل «سارة تملك حسابًا، إذن هي مسجلة» لكانت مغالطة."
          });
        },
        quiz: {
          id: "a5-inf", cov: "A5-INF-Q",
          prompt: "لماذا تصح نتيجة الضأن؟",
          choices: [
            { id: "a", text: "لأن الأغنام حيوانات واللحم منها.", ok: true },
            { id: "b", text: "لأن كل نتيجة تُقال تصبح صحيحة.", ok: false }
          ],
          why: "المقدمتان صحيحتان والربط صحيح. لو قيل إن النبات لحم لكانت مغالطة. والاستدلال يبني سلسلة: لأن… فإن… لذلك."
        }
      }),
      L({
        cov: ["A5-CON", "A5-CON-Q"],
        titleAr: "الاتساق",
        titleEn: "Mathematical logic: consistency",
        story: { icon: "lock", color: C.rose, who: "رسالة غريبة من البنك", text: "يعرض التطبيق: «حسابك مقفل» وتحتها «حسابك مفتوح، يمكنك التحويل». أي الجملتين تصدّق؟ البرنامج نفسه متناقض." },
        lines: [{ text: "الاتساق يفحص ألا تُقبل الجملة ونقيضها معًا. إن قال البرنامج إن الحساب مقفل ومفتوح في الشرط نفسه ففيه تناقض.", cov: "A5-CON" }],
        terms: [["consistency", "الاتساق"]],
        art: function (api) {
          api.lab({
            title: "افحص الاتساق",
            line: "اقلب الجملتين. هل يقبل البرنامج الجملة ونقيضها معًا؟",
            build: function (body) {
              const v = { a: 1, b: 0 };
              const sw = UI.el("div", { class: "switches", style: "grid-template-columns:repeat(2,minmax(0,1fr))" });
              const out = UI.el("p", { class: "readout" });
              const btns = [["a", "الحساب مقفل"], ["b", "الحساب مفتوح"]].map(function (x) {
                const b = UI.el("button", { type: "button", class: "switch" }, UI.el("b", { text: x[0] === "a" ? "S" : "¬S" }), UI.el("small", { text: x[1] }), UI.el("span", { class: "val" }));
                b.addEventListener("click", function () { v[x[0]] = v[x[0]] ? 0 : 1; draw(); });
                sw.appendChild(b);
                return [b, x[0]];
              });
              function draw() {
                btns.forEach(function (b) { b[0].setAttribute("aria-pressed", v[b[1]] ? "true" : "false"); b[0].querySelector(".val").textContent = String(v[b[1]]); });
                const bad = v.a && v.b;
                out.className = "readout" + (bad ? " bad" : "");
                out.textContent = bad ? "تناقض: قُبلت الجملة ونقيضها معًا. النظام غير متسق." : (!v.a && !v.b ? "لم تُقبل أي جملة. لا تناقض، لكن الحالة غير معروفة." : "متسق: جملة واحدة فقط مقبولة.");
              }
              body.appendChild(sw);
              body.appendChild(out);
              draw();
            }
          });
        },
        quiz: {
          id: "a5-con", cov: "A5-CON-Q",
          prompt: "متى يختل الاتساق؟",
          choices: [
            { id: "a", text: "حين تُقبل القضية ونقيضها معًا.", ok: true },
            { id: "b", text: "حين تتكرر مقدمة صحيحة.", ok: false }
          ],
          why: "الاتساق يمنع التناقض، وتكرار المقدمة الصحيحة لا يصنع نقيضًا."
        }
      }),
      { cov: ["A5-ITER", "A5-ITER-Q"], titleAr: "التكرار المنطقي", titleEn: "Iteration: repeating a procedure on the previous result", render: iteration },
      L({
        cov: ["A5-COMP", "A5-COMP-Q", "A5-H-FORMS"],
        titleAr: "الاكتمال",
        titleEn: "Mathematical logic: completeness",
        lines: [
          { text: "الاكتمال يسأل: هل يمكن إثبات كل قضية صحيحة داخل النظام؟ Σ مجموعة مقدمات، وΦ قضية، و⊢ تعني «يُثبت». فـ Σ ⊢ Φ تعني أن المقدمات تثبت القضية.", cov: "A5-COMP" },
          "في البرنامج يُستخدم هذا لإثبات أن الخوارزمية تبلغ هدفها تحت القواعد المعطاة."
        ],
        terms: [["completeness", "الاكتمال"]],
        hints: [{ cov: "A5-H-FORMS", label: "شكلان", text: "للاكتمال شكل وظيفي وشكل دلالي. كلاهما يسأل عن إمكان الإثبات، لا عن كتابة الكود." }],
        art: function (api) {
          const s = A.box(330, 40, 210, 200, C.teal, { fo: 0.08 }) + A.text(435, 76, "Σ المقدمات", { size: 17, color: C.teal, weight: 700 }) +
            A.text(435, 116, "الطلب > 50", { size: 14 }) + A.text(435, 146, "المسافة < 26", { size: 14 }) + A.text(435, 176, "القاعدة: الاثنان معًا", { size: 14 }) +
            A.arrow(325, 140, 235, 140, C.amber, { w: 3.5 }) + A.text(280, 124, "⊢", { en: true, size: 32, color: C.amber }) +
            A.box(20, 80, 210, 120, C.vio, { fo: 0.12 }) + A.text(125, 120, "Φ القضية", { size: 17, color: C.vio, weight: 700 }) + A.text(125, 160, "الشحن مجاني", { size: 15 }) +
            A.text(280, 280, "Σ ⊢ Φ : من المقدمات تثبت القضية", { size: 15, color: C.mute });
          api.art(A.svg(560, 295, s, "المقدمات تثبت القضية"), "كل ما هو صادق يمكن إثباته من المقدمات");
        },
        quiz: {
          id: "a5-comp", cov: "A5-COMP-Q",
          prompt: "ماذا تعني Σ ⊢ Φ؟",
          choices: [
            { id: "a", text: "من المقدمات Σ تُثبت القضية Φ.", ok: true },
            { id: "b", text: "Φ تنفي Σ دائمًا.", ok: false }
          ],
          why: "⊢ علامة الإثبات. والاكتمال يعني أن ما هو صادق يمكن إثباته. وفي البرنامج يبرّر هذا أن الخوارزمية تصل إلى الحالة المطلوبة."
        }
      }),
      { cov: ["A5-TRUTH", "A5-TRUTH-Q"], titleAr: "التحقق بجدول الحقيقة", titleEn: "Mathematical logic: verification by truth tables", render: truth },
      { cov: ["A5-CONN", "A5-CONN-Q"], titleAr: "القضايا والروابط الخمسة", titleEn: "Propositions and connectives", render: connectives },
      L({
        cov: ["A5-PDL", "A5-PDL-Q"],
        titleAr: "المنطق الديناميكي الاقتراحي",
        titleEn: "Propositional dynamic logic to demonstrate the function of algorithms",
        story: { icon: "phone", color: C.sky, who: "تسجيل الدخول إلى تطبيق", text: "تبدأ خارج الحساب. تكتب الاسم، ثم الكلمة، ثم تضغط «دخول». كل حدث ينقلك من حالة إلى حالة. هل يمكن أن تصل إلى «داخل الحساب» دائمًا بكلمة صحيحة؟" },
        lines: [{ text: "PDL يصف حالات البرنامج وأحداثه بطريقة رياضية، ويُستخدم بعد تصميم الخوارزمية للتحقق من أنها تبلغ الحالة المطلوبة والنتيجة الصحيحة.", cov: "A5-PDL" }],
        terms: [["pdl", "PDL"]],
        art: function (api) {
          const st = [[90, 150, "خارج الحساب", C.mute], [280, 70, "أُدخل الاسم", C.sky], [470, 150, "داخل الحساب", C.teal], [280, 240, "رسالة خطأ", C.rose]];
          let s = A.arrow(130, 125, 230, 85, C.sky) + A.text(160, 90, "كتابة الاسم", { size: 12, color: C.mute }) +
            A.arrow(330, 85, 430, 125, C.teal) + A.text(410, 90, "كلمة صحيحة", { size: 12, color: C.teal }) +
            A.arrow(280, 108, 280, 200, C.rose) + A.text(330, 160, "كلمة خاطئة", { size: 12, color: C.rose }) +
            A.arrow(235, 235, 130, 180, C.mute) + A.text(160, 232, "أعد المحاولة", { size: 12, color: C.mute });
          st.forEach(function (x, i) {
            s += '<g class="rise" style="animation-delay:' + (i * 0.1) + 's"><ellipse cx="' + x[0] + '" cy="' + x[1] + '" rx="74" ry="32" fill="' + x[3] + '" fill-opacity=".15" stroke="' + x[3] + '" stroke-width="2"' + (i === 2 ? ' class="pulse"' : "") + '/>' + A.text(x[0], x[1] + 6, x[2], { size: 14 }) + "</g>";
          });
          api.art(A.svg(560, 290, s, "حالات تسجيل الدخول والأحداث بينها"), "الحالات دوائر، والأحداث أسهم بينها");
        },
        quiz: {
          id: "a5-pdl", cov: "A5-PDL-Q",
          prompt: "بماذا يتحقق PDL بعد انتهاء تصميم الخوارزمية؟",
          choices: [
            { id: "a", text: "ببلوغ الحالة المطلوبة والنتيجة الصحيحة.", ok: true },
            { id: "b", text: "بلون واجهة التسجيل.", ok: false }
          ],
          why: "المنطق الديناميكي يتابع الحالات والأحداث، وغايته التأكد من أن التنفيذ يستطيع الوصول إلى المطلوب."
        }
      }),
      { cov: ["A5-VENN", "A5-FILT", "A5-VENN-Q"], titleAr: "المجموعات ومخطط فن والتصفية", titleEn: "Use of sets: interrelationships, search and filter", render: venn }
    ]
  });
})();
