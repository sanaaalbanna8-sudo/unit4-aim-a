(function () {
  const L = UI.lesson;
  const A = window.ART;
  const C = A.C;
  const P1 = "من الآلة إلى اللغة";
  const P2 = "أنواع اللغات";
  const P3 = "المقارنة والسلوك المهني";

  function hex2(n) { return n.toString(16).toUpperCase().padStart(2, "0"); }
  function bin8(n) { return n.toString(2).padStart(8, "0"); }

  /* ---------- المصابيح الثنائية ---------- */
  function bulbsLab(api) {
    api.lab({
      title: "مصابيح البايت",
      line: "كل مصباح خانة. أشعل المصابيح لتكوّن العدد 5، ثم جرّب أعدادًا أخرى.",
      build: function (body) {
        const vals = [128, 64, 32, 16, 8, 4, 2, 1];
        const on = vals.map(function () { return false; });
        const row = UI.el("div", { class: "bulbs" });
        const out = UI.el("p", { class: "readout" });
        function draw() {
          const n = vals.reduce(function (s, v, i) { return s + (on[i] ? v : 0); }, 0);
          row.querySelectorAll(".bulb").forEach(function (b, i) { b.setAttribute("aria-pressed", on[i] ? "true" : "false"); b.querySelector("b").textContent = on[i] ? "1" : "0"; });
          out.textContent = "العشري " + n + "، والثنائي " + bin8(n) + "، والست عشري " + hex2(n) + (n === 5 ? ". أحسنت: 5 = 4 + 1." : ".");
        }
        vals.forEach(function (v, i) {
          const b = UI.el("button", { type: "button", class: "bulb", "aria-label": "خانة " + v }, UI.el("b", { text: "0" }), UI.el("small", { text: String(v) }));
          b.addEventListener("click", function () { on[i] = !on[i]; draw(); });
          row.appendChild(b);
        });
        body.appendChild(row);
        body.appendChild(out);
        draw();
      }
    });
  }

  /* ---------- مختبر الأنظمة العددية ---------- */
  function lab(api) {
    api.p("اكتب نصًا لاتينيًا فترى كل رمز وبايته بالست عشري والثنائي. هذه بايتات نصية بنظام ASCII، وليست برنامج آلة كاملًا.", "A3-TEXT");
    api.code('cout << "BTEC Student";', null, "text", "سطر الإخراج في C++");
    api.term("ascii", "ASCII");
    api.term("hexadecimal", "الست عشري");
    api.lab({
      title: "مختبر الأرقام",
      line: "اكتب في الحقلين، والبايتات تتغير مع كل حرف.",
      build: function (body) {
        const text = UI.el("input", { type: "text", value: "BTEC Student", dir: "ltr", "aria-label": "النص" });
        const tiles = UI.el("div", { class: "bytes" });
        const joined = UI.el("p", { class: "readout" });
        const num = UI.el("input", { type: "number", value: "5", min: "0", "aria-label": "عدد صحيح" });
        const numOut = UI.el("p", { class: "readout" });
        function showText() {
          tiles.replaceChildren();
          const codes = [];
          Array.from(text.value).slice(0, 24).forEach(function (ch, i) {
            const code = ch.codePointAt(0);
            const ascii = code < 128;
            codes.push(ascii ? hex2(code) : "??");
            tiles.appendChild(UI.el("div", { class: "byte", style: "animation-delay:" + (i * 0.02) + "s" },
              UI.el("span", { class: "ch", text: ch === " " ? "␠" : ch }),
              UI.el("span", { class: "hx", text: ascii ? hex2(code) : "—" }),
              UI.el("span", { class: "bn", text: ascii ? bin8(code) : "خارج ASCII" })));
          });
          joined.replaceChildren(UI.el("strong", { text: "بايتات نصية: " }), UI.el("span", { dir: "ltr", style: "font-family:var(--mono)", text: codes.join(" ") }));
        }
        function showNum() {
          const v = Math.max(0, Math.floor(Number(num.value) || 0));
          numOut.textContent = v + " بالثنائي " + v.toString(2) + "، وبالست عشري " + v.toString(16).toUpperCase() + ".";
        }
        text.addEventListener("input", showText);
        num.addEventListener("input", showNum);
        body.appendChild(UI.el("label", { class: "field" }, UI.el("span", { text: "النص" }), text));
        body.appendChild(tiles);
        body.appendChild(joined);
        body.appendChild(UI.el("label", { class: "field" }, UI.el("span", { text: "عدد صحيح" }), num));
        body.appendChild(numOut);
        showText();
        showNum();
      }
    });
    api.link("لأن كل رمز لاتيني يقابل قيمة في ASCII، فإن النص يظهر سلسلة بايتات، لذلك يقرؤه الإنسان سطرًا ويتعامل معه المعالج أعدادًا.");
    api.quiz({
      id: "a3-lab",
      cov: "A3-LAB-Q",
      prompt: "ماذا تعني البايتات بجانب سطر الإخراج؟",
      choices: [
        { id: "a", text: "بايتات نصية، لا برنامج آلة كامل.", ok: true },
        { id: "b", text: "برنامج آلة جاهز للتشغيل وحده.", ok: false }
      ],
      why: "خمسة تُكتب 101 لأنها 4 + 1. النص BTEC Student بايتاته 42 54 45 43 20 53 74 75 64 65 6E 74، ووسمها: بايتات نصية."
    });
  }

  /* ---------- التجميع خطوة خطوة ---------- */
  function machine(api) {
    api.p("هذا أدنى مستوى. كود الآلة يخص عائلة معالجات مثل x86 بنسختي 32 و 64 بت، ونقله إلى عائلة أخرى يحتاج تحويل التعليمات أو محاكاة.", "A3-MACH");
    api.p("التجميع يستخدم وسائل تذكّر: mov للنقل، و add للجمع، و int 20h للإنهاء. ax و bx سجلّان سريعان داخل المعالج. كود التشغيل هو العملية، والمعامل هو القيمة. والمجمّع يحوّل التجميع إلى لغة آلة.", "A3-REG");
    api.example("تلجأ إلى هذا المستوى حين تلزمك السرعة القصوى أو الوصول المباشر إلى العتاد.");
    api.term("assembly", "التجميع");
    api.term("mnemonic", "وسيلة التذكّر");
    api.term("register", "السجل");
    api.term("opcode", "كود التشغيل");
    api.term("operand", "المعامل");
    api.term("assembler", "المجمّع");
    api.hint("A3-H-VEND", "آلات البيع والشاشات", "يُستخدم هذا المستوى أيضًا في آلات البيع والشاشات الأمامية وبعض الألعاب.");
    api.lab({
      title: "نفّذ التعليمات خطوة خطوة",
      tag: "مثال تعليمي",
      line: "مثال تعليمي لتعليمات 8086، وليس برنامجًا كاملًا لآلة حديثة. اضغط «خطوة» وراقب السجل ax.",
      build: function (body) {
        const prog = [
          { asm: "mov ax, 2", bytes: "B8 02 00", note: "انقل 2 إلى ax", run: function () { return 2; } },
          { asm: "add ax, 4", bytes: "05 04 00", note: "أضف 4 إلى ax", run: function (ax) { return ax + 4; } },
          { asm: "int 20h", bytes: "CD 20", note: "أنهِ المثال", run: function (ax) { return ax; } }
        ];
        let pc = 0;
        let ax = 0;
        const code = UI.el("div", { class: "codebox" });
        const reg = UI.el("div");
        const out = UI.el("p", { class: "readout", text: "لم تُنفَّذ أي تعليمة بعد." });
        const step = UI.el("button", { type: "button", class: "btn", text: "خطوة ▶" });
        function draw() {
          code.replaceChildren();
          prog.forEach(function (p, i) {
            code.appendChild(UI.el("span", { class: "ln" + (i === pc - 1 ? " run" : "") }, p.asm.padEnd(12, " ") + ";  " + p.bytes));
          });
          const s = A.box(150, 10, 260, 90, C.amber, { fo: 0.1 }) + A.text(280, 40, "السجل ax", { size: 14, color: C.mute }) +
            A.text(280, 82, String(ax), { size: 34, en: true, color: C.amber, weight: 700, cls: pc ? "rise" : "" }) +
            A.icon("cpu", 440, 22, 64, C.sky) + A.icon("cpu", 56, 22, 64, C.sky);
          reg.innerHTML = A.svg(560, 110, s, "قيمة السجل ax");
          step.disabled = pc >= prog.length;
        }
        step.addEventListener("click", function () {
          const p = prog[pc];
          ax = p.run(ax);
          pc += 1;
          out.textContent = p.bytes + " ← " + p.note + (pc === prog.length ? ". انتهى المثال و ax = 6." : ".");
          draw();
        });
        body.appendChild(code);
        body.appendChild(reg);
        body.appendChild(UI.el("div", { class: "row" }, step));
        body.appendChild(out);
        draw();
      }
    });
    api.quiz({
      id: "a3-mach", cov: "A3-MACH-Q",
      prompt: "ما وسم البايتات B8 02 00 و 05 04 00 و CD 20؟",
      choices: [
        { id: "a", text: "مثال تعليمي لتعليمات 8086.", ok: true },
        { id: "b", text: "بايتات نصية لعبارة BTEC Student.", ok: false }
      ],
      why: "B8 02 00 تنقل 2 إلى ax. و 05 04 00 تضيف 4. و CD 20 تنهي المثال. هذا مثال تعليمي لشكل التعليمة، لا برنامج منتج حديث."
    });
  }

  /* ---------- النموذج الحدثي ---------- */
  function events(api) {
    api.story({ icon: "window", color: C.sky, who: "صرّاف آلي في البنك", text: "الصرّاف لا يفعل شيئًا حتى تضغط زرًا. كل ضغطة حدث، ولكل حدث شفرة تعمل. وأنت من يختار الترتيب." });
    api.p("البرنامج ينتظر حدثًا من النظام، مثل الساعة، أو من المستخدم، مثل النقر. المسار ليس متسلسلًا، فالمستخدم يختار العملية. المراقب ينتظر الحدث، ومعالج الحدث هو الشفرة التي تعمل.", "A3-ED");
    api.example("من قائمة «ملف» تختار «فتح»، فيظهر مربع حوار.");
    api.term("event-driven", "قائم على الأحداث");
    api.term("event-handler", "معالج الحدث");
    api.term("listener", "المراقب");
    api.hint("A3-H-ED-LANGS", "لغات حدثية", "منها Visual Basic .NET و Python و Ruby و JavaScript.");
    api.hint("A3-H-VB-MULTI", "Visual Basic .NET", "تُصنَّف حدثية، وتعتمد على فئات الأزرار والنماذج والحوار، فهي كائنية أيضًا.");
    api.lab({
      title: "نافذة تنتظر الأحداث",
      line: "اضغط أي زر بالترتيب الذي تريد، وراقب المراقب والمعالج في السجل.",
      build: function (body) {
        const log = UI.el("ol", { class: "ledger" });
        const dialog = UI.el("p", { class: "readout", hidden: true, text: "📂 مربع حوار: اختر ملفًا لفتحه" });
        function fire(name, who, handler) {
          log.insertBefore(UI.el("li", null, UI.el("strong", { text: "حدث من " + who + ": " }), name + " ← المراقب سمع ← المعالج " + handler), log.firstChild);
          while (log.children.length > 5) log.removeChild(log.lastChild);
        }
        const bar = UI.el("div", { class: "row" });
        const open = UI.el("button", { type: "button", class: "btn ghost small", text: "ملف ← فتح" });
        open.addEventListener("click", function () { dialog.hidden = false; fire("نقر «فتح»", "المستخدم", "يُظهر مربع الحوار"); });
        const save = UI.el("button", { type: "button", class: "btn ghost small", text: "احفظ" });
        save.addEventListener("click", function () { fire("نقر «احفظ»", "المستخدم", "يحفظ الملف"); });
        const tick = UI.el("button", { type: "button", class: "btn ghost small", text: "⏰ دقّت الساعة" });
        tick.addEventListener("click", function () { fire("مرور دقيقة", "النظام", "يحدّث الوقت"); });
        bar.appendChild(open); bar.appendChild(save); bar.appendChild(tick);
        const win = UI.el("div", { class: "stack-scene" });
        win.appendChild(bar);
        win.appendChild(dialog);
        body.appendChild(win);
        body.appendChild(log);
      }
    });
    api.quiz({
      id: "a3-ed", cov: "A3-ED-Q",
      prompt: "ماذا يعمل معالج الحدث؟",
      choices: [
        { id: "a", text: "الشفرة التي تُنفَّذ عند وقوع الحدث.", ok: true },
        { id: "b", text: "يحذف واجهة البرنامج.", ok: false }
      ],
      why: "المراقب ينتظر، وعند الحدث يعمل المعالج. مثال: اختيار «فتح» يُظهر مربع الحوار."
    });
  }

  /* ---------- الذاكرة والتسرب ---------- */
  function memory(api) {
    api.story({ icon: "cup", color: C.amber, who: "مقصف المدرسة", text: "في مقصف يغسل العامل الأكواب بنفسه، فإن نسي تراكمت. وفي مقصف آخر يجمعها عامل يمرّ كل فترة، لكنه لا يأخذ كوبًا ما زال أحد يمسكه." });
    api.p("جمع البيانات المهملة ليس إلزاميًا في كل لغة. في C يكون التحرير يدويًا، ونسيان تحرير ذاكرة لم تعد لازمة سبب شائع للتسرب.", "A3-GC");
    api.p("الجمع التلقائي يمنع هذا النوع من النسيان، وقد يوقف التنفيذ لحظة. ومع ذلك قد يبقى تسرب إن بقيت مراجع إلى بيانات لا تُستخدم.");
    api.term("garbage-collection", "جمع البيانات المهملة");
    api.term("memory-leak", "تسرب الذاكرة");
    api.lab({
      title: "مختبر الذاكرة",
      line: "احجز صناديق، ثم اضغط الصندوق لتغيّر حالته، وجرّب التحرير اليدوي والجمع التلقائي.",
      build: function (body) {
        let mode = "c";
        let blocks = [];
        let n = 0;
        const states = { use: ["قيد الاستخدام", C.teal], done: ["انتهى استخدامه", C.amber], ref: ["انتهى وبقي له مرجع", C.rose] };
        const modes = UI.el("div", { class: "row" });
        const cBtn = UI.el("button", { type: "button", class: "chip", "aria-pressed": "true", text: "C: تحرير يدوي" });
        const gBtn = UI.el("button", { type: "button", class: "chip", "aria-pressed": "false", text: "C#: جمع تلقائي" });
        modes.appendChild(cBtn); modes.appendChild(gBtn);
        const pic = UI.el("div", { class: "row", style: "min-height:6rem" });
        const out = UI.el("p", { class: "readout" });
        const alloc = UI.el("button", { type: "button", class: "btn", text: "+ احجز ذاكرة" });
        const act = UI.el("button", { type: "button", class: "btn amber" });
        function draw(msg) {
          cBtn.setAttribute("aria-pressed", mode === "c" ? "true" : "false");
          gBtn.setAttribute("aria-pressed", mode === "gc" ? "true" : "false");
          act.textContent = mode === "c" ? "حرّر ما انتهى (free)" : "شغّل الجامع";
          pic.replaceChildren();
          blocks.forEach(function (b) {
            const st = states[b.s];
            const btn = UI.el("button", { type: "button", class: "chip", style: "border-color:" + st[1] + ";background:" + st[1] + "22", text: "▦ " + b.id + " · " + st[0] });
            btn.addEventListener("click", function () { b.s = b.s === "use" ? "done" : b.s === "done" ? "ref" : "use"; draw(); });
            pic.appendChild(btn);
          });
          if (!blocks.length) pic.appendChild(UI.el("span", { class: "empty", text: "الذاكرة فارغة." }));
          const leak = blocks.filter(function (b) { return b.s !== "use"; }).length;
          out.textContent = msg || ("صناديق محجوزة: " + UI.ar(blocks.length) + "، ومنها " + UI.ar(leak) + " لم تعد لازمة وما زالت تشغل الذاكرة.");
          out.classList.toggle("bad", leak > 0 && !msg);
        }
        alloc.addEventListener("click", function () { if (blocks.length < 8) { n += 1; blocks.push({ id: n, s: "use" }); } draw(); });
        act.addEventListener("click", function () {
          if (mode === "c") {
            const before = blocks.length;
            blocks = blocks.filter(function (b) { return b.s === "use"; });
            draw("حرّرت " + UI.ar(before - blocks.length) + " صناديق بيدك. لو نسيت هذه الخطوة لبقيت محجوزة: هذا هو التسرب.");
          } else {
            const freed = blocks.filter(function (b) { return b.s === "done"; }).length;
            const kept = blocks.filter(function (b) { return b.s === "ref"; }).length;
            blocks = blocks.filter(function (b) { return b.s !== "done"; });
            draw("⏸ توقف لحظي... جمع الجامع " + UI.ar(freed) + " صناديق." + (kept ? " وبقي " + UI.ar(kept) + " لأن لها مرجعًا: تسرب رغم الجمع." : ""));
          }
        });
        cBtn.addEventListener("click", function () { mode = "c"; draw(); });
        gBtn.addEventListener("click", function () { mode = "gc"; draw(); });
        body.appendChild(modes);
        body.appendChild(pic);
        body.appendChild(UI.el("div", { class: "row" }, alloc, act));
        body.appendChild(out);
        draw();
      }
    });
    api.quiz({
      id: "a3-gc", cov: "A3-GC-Q",
      prompt: "ما السبب الشائع للتسرب عند التحرير اليدوي؟",
      choices: [
        { id: "a", text: "نسيان تحرير ذاكرة لم تعد لازمة.", ok: true },
        { id: "b", text: "كثرة الجمع التلقائي وحدها تصنع التسرب.", ok: false }
      ],
      why: "النسيان في C يُبقي الذاكرة محجوزة. الجمع التلقائي يمنع هذا النسيان وقد يوقف البرنامج لحظة. وإن بقي اسم يشير إلى بيانات مهملة بقي التسرب ممكنًا."
    });
  }

  /* ---------- اختيار النموذج ---------- */
  function pick(api) {
    api.story({ icon: "users", color: C.vio, who: "شركة برمجيات ناشئة في عمّان", text: "وصلت أربعة طلبات في أسبوع: لعبة، ومتجر إلكتروني، وجهاز قياس، ونافذة إدخال بيانات. لكل طلب قيد، والقيد يحدد النموذج لا شهرة اللغة." });
    api.p("أجب عن أسئلة قصيرة عن المشروع، فيقترح عليك المختبر النموذج واللغة الأقرب، مع جملة تشرح السبب.");
    const results = {
      ed: { icon: "window", name: "النموذج الحدثي", lang: "Visual Basic .NET", why: "لأن النافذة تنتظر نقرة أو إدخالًا، فإن النموذج الحدثي يناسبها، لذلك تُبنى النماذج كثيرًا بـ Visual Basic .NET." },
      oo: { icon: "blueprint", name: "النموذج الكائني", lang: "C# أو Java أو C++", why: "لأن اللعبة كائنات تتفاعل، فإن النموذج الكائني يناسبها، لذلك تُبنى غالبًا بـ C# على أدوات الألعاب." },
      mach: { icon: "cpu", name: "التجميع أو C", lang: "Assembler أو C", why: "لأن الجهاز يحتاج تحكمًا قريبًا من العتاد، فإن المستوى الأدنى أنسب، لذلك تُستخدم C أو التجميع." },
      mark: { icon: "code", name: "لغة ترميز", lang: "HTML أو XML", why: "لأن المطلوب وصف هيكل لا تنفيذ خطوات، فإن الترميز يكفي، لذلك تُستخدم HTML للصفحة و XML للبيانات." },
      scr: { icon: "gear", name: "لغة نصية", lang: "PHP أو Perl أو Ruby", why: "لأن المتجر صفحات وطلبات على الخادم، فإن اللغة النصية تناسب الربط، لذلك يشتهر PHP لهذا العمل." },
      proc: { icon: "file", name: "النموذج الإجرائي", lang: "C أو Perl أو Python", why: "لأن المسألة خطوات واضحة متتالية، فإن النموذج الإجرائي يكفي، لذلك تبدأ بإجراءات قصيرة لكل غرض." }
    };
    const qs = [
      ["هل البرنامج ينتظر نقرات وأحداثًا من المستخدم أو من النظام؟", "ed"],
      ["هل فيه أشياء من الواقع لها بيانات وسلوك، مثل لاعبين أو حسابات؟", "oo"],
      ["هل يحتاج سرعة قصوى ووصولًا مباشرًا إلى العتاد؟", "mach"],
      ["هل المطلوب وصف هيكل صفحة أو بيانات فقط؟", "mark"],
      ["هل يؤتمت مهام على الخادم أو يربط برامج منفصلة؟", "scr"]
    ];
    api.lab({
      title: "اختيار النموذج",
      line: "أجب بنعم أو لا. أول «نعم» تحدد النموذج الأقرب.",
      cov: "A3-PICK",
      build: function (body) {
        let i = 0;
        const box = UI.el("div", { class: "wizard" });
        function show(key) {
          const r = results[key];
          box.replaceChildren(UI.el("div", { class: "result" },
            UI.fromMarkup(A.badge(r.icon, C.teal)),
            UI.el("div", null, UI.el("p", null, UI.el("b", { text: r.name }), " · ", UI.el("span", { dir: "ltr", text: r.lang })), UI.el("p", { text: r.why }))));
        }
        function ask() {
          if (i >= qs.length) { show("proc"); return; }
          const meter = UI.el("div", { class: "meter" }, UI.el("i", { style: "width:" + Math.round(i / qs.length * 100) + "%" }));
          const yes = UI.el("button", { type: "button", class: "btn", text: "نعم" });
          const no = UI.el("button", { type: "button", class: "btn ghost", text: "لا" });
          yes.addEventListener("click", function () { show(qs[i][1]); });
          no.addEventListener("click", function () { i += 1; ask(); });
          box.replaceChildren(meter, UI.el("p", { class: "qline", text: "سؤال " + UI.ar(i + 1) + ": " + qs[i][0] }), UI.el("div", { class: "row" }, yes, no));
        }
        const presets = UI.el("div", { class: "row" });
        [["لعبة فيها شخصيات وقواعد", "oo"], ["متجر إلكتروني على الخادم", "scr"], ["جهاز يحتاج وصولًا للعتاد", "mach"], ["نافذة فيها حقول وأزرار", "ed"]].forEach(function (p) {
          const b = UI.el("button", { type: "button", class: "chip", text: p[0] });
          b.addEventListener("click", function () { show(p[1]); });
          presets.appendChild(b);
        });
        body.appendChild(box);
        body.appendChild(UI.el("p", { class: "zone-label", text: "أو جرّب طلبًا جاهزًا:" }));
        body.appendChild(presets);
        ask();
      }
    });
    api.quiz({
      id: "a3-pick",
      cov: "A3-PICK-Q",
      prompt: "نافذة فيها أزرار وحقول. أي نموذج أقرب؟",
      choices: [
        { id: "a", text: "النموذج الحدثي.", ok: true },
        { id: "b", text: "لغة الترميز وحدها.", ok: false }
      ],
      why: "النافذة تنتظر حدثًا من المستخدم. الترميز يصف هيكلًا ولا يشغّل سلوك الزر وحده. اللعبة أقرب إلى الكائنات، والجهاز إلى التجميع أو C، والمتجر إلى لغة نصية على الخادم."
    });
  }

  /* ---------- أدوات التطوير ---------- */
  function tools(api) {
    api.story({ icon: "bug", color: C.rose, who: "قبل تسليم المشروع بساعة", text: "البرنامج يعطي مجموعًا خاطئًا. تضع ليان نقطة توقف عند سطر الجمع، وتراقب المتغير total، فترى الخطأ في الدورة الثالثة." });
    api.p("بعض بيئات التطوير تولّد كودًا من سحب النموذج، وتلوّن الكود، وتوفر تتبعًا ومراقبة ونقطة توقف. وبعض المشاريع تحتاج أجهزة خاصة لبرمجة شريحة على لوحتها.");
    api.term("ide", "بيئة التطوير");
    api.term("syntax-highlighting", "تلوين الكود");
    api.term("breakpoint", "نقطة التوقف");
    api.term("watch", "المراقبة");
    api.term("trace", "التتبع");
    api.hint("A3-H-SYNTAX", "ألوان الكود", "التعليق بلون والسلسلة بلون آخر يسهّلان القراءة والتصحيح.");
    api.hint("A3-H-DEBUG", "أدوات التصحيح", "التتبع يسجل الطريق. المراقبة تعرض قيمة. نقطة التوقف توقف التنفيذ عند سطر.");
    api.hint("A3-H-DRAG", "سحب النموذج", "في Visual Basic .NET قد يتحول تصميم النموذج بالسحب إلى كود.");
    api.hint("A3-H-VIRT", "بيئة في المتصفح", "يمكن اختيار لغة وكتابة مقطع قصير ثم تشغيله داخل بيئة في المتصفح.");
    api.hint("A3-H-JTAG", "JTAG و SPI", "الجهاز الخارجي يوصل بـ SPI أو JTAG عبر USB أو كبل تسلسلي أو متوازٍ. ISP تعيد البرمجة واللوحة باقية في دائرتها، ومثال ذلك إصلاح هاتف لا فتح قفله.");
    const views = [
      ["ide-debug", "نقطة توقف ومراقبة"],
      ["syntax-colors", "لون للتعليق ولون للسلسلة"],
      ["form-designer", "سحب النموذج يولّد كودًا"],
      ["jtag-board", "وصل يبقي اللوحة داخل دائرتها"]
    ];
    const tabs = UI.el("div", { class: "row" });
    api.add(tabs, "vis");
    const figs = views.map(function (v) { return api.shot(v[0], "شاهد الرسم: " + v[1]); });
    function select(k) {
      figs.forEach(function (f, i) { f.hidden = i !== k; });
      tabs.querySelectorAll(".chip").forEach(function (b, i) { b.setAttribute("aria-pressed", i === k ? "true" : "false"); });
    }
    views.forEach(function (v, i) {
      const b = UI.el("button", { type: "button", class: "chip", text: ["التصحيح", "تلوين الكود", "مصمم النماذج", "جهاز خاص"][i] });
      b.addEventListener("click", function () { select(i); });
      tabs.appendChild(b);
    });
    select(0);
  }

  UI.register({
    id: "a3",
    badge: "A3",
    tone: "violet",
    short: "لغات البرمجة",
    shortEn: "Programming languages",
    titleAr: "سمات لغات البرمجة وخصائصها",
    titleEn: "Features and characteristics of programming languages",
    blurb: "من لغة الآلة إلى اللغة العالية، ثم اختيار النموذج.",
    screens: [
      L({
        part: P1, cov: ["A3-HIST", "A3-HIST-Q", "A3-H-NATURAL"],
        titleAr: "من لغة الآلة إلى لغات أسهل",
        titleEn: "High-level and low-level programming languages",
        story: { icon: "chat", color: C.amber, who: "تخيّل", text: "أن تكتب رسالة لصديقك بالأصفار والآحاد فقط. ستصل بسرعة، لكن كتابتها تأخذ يومًا كاملًا. هكذا كانت البرمجة في البداية." },
        lines: [{ text: "منذ منتصف القرن العشرين ظهرت مئات اللغات. البرامج الأولى كانت لغة آلة: تشغيلها سريع، وكتابتها بطيئة وتحتاج مهارة. ثم جاءت اللغات الدنيا والعليا فقصّرت وقت البناء.", cov: "A3-HIST" }],
        points: ["اللغة الدنيا أقرب إلى الآلة.", "اللغة العليا أقرب إلى وصف الإنسان."],
        terms: [["high-level-language", "لغة عالية"], ["low-level-language", "لغة دنيا"], ["machine-code", "لغة الآلة"]],
        hints: [{ cov: "A3-H-NATURAL", label: "لغات طبيعية", text: "من أمثلة لغات البشر: الإنجليزية والعربية والتايلاندية والهولندية. اللغة العالية تقترب من هذا الوصف ولا تبلغه." }],
        art: function (api) {
          const steps = [["لغة الآلة", "10110000 00000010", C.rose], ["التجميع", "mov ax, 2", C.amber], ["لغة عالية", "total = price * 2", C.teal], ["لغة البشر", "ضاعف السعر", C.mute]];
          let s = "";
          steps.forEach(function (st, i) {
            const x = 20 + i * 132, y = 230 - i * 62;
            s += '<g class="rise" style="animation-delay:' + (i * 0.12) + 's">' + A.box(x, y, 122, 230 - y + 90 > 0 ? 320 - y : 60, st[2], { fo: i === 3 ? 0.04 : 0.14, dash: i === 3 ? "5 5" : null }) +
              A.text(x + 61, y + 30, st[0], { size: 15, color: st[2], weight: 700 }) + A.text(x + 61, y + 56, st[1], { size: i === 3 ? 13 : 11, en: i !== 3, cls: i === 3 ? "" : "mono" }) + "</g>";
          });
          s += A.arrow(40, 40, 520, 40, C.mute) + A.text(280, 28, "كلما صعدت اقتربت من لغة الإنسان", { size: 13, color: C.mute });
          api.art(A.svg(560, 340, s, "درجات اللغات من الآلة إلى الإنسان"), "كل درجة أقرب إلى الإنسان وأبعد عن الآلة");
        },
        quiz: {
          id: "a3-hist", cov: "A3-HIST-Q",
          prompt: "لماذا كان بناء التطبيق المعقد صعبًا في البداية؟",
          choices: [
            { id: "a", text: "لأن الكتابة بلغة الآلة بطيئة وتحتاج مهارة.", ok: true },
            { id: "b", text: "لأن المعالج لا ينفذ التعليمات الثنائية.", ok: false }
          ],
          why: "لغة الآلة سريعة عند التشغيل وصعبة عند الكتابة. اللغات اللاحقة جعلت بناء البرامج المعقدة أقصر."
        }
      }),
      L({
        part: P1, cov: ["A3-BASE", "A3-BASE-Q"],
        titleAr: "الثنائي والست عشري",
        titleEn: "Binary and hexadecimal",
        story: { icon: "bulb", color: C.amber, who: "مفتاح الضوء في غرفتك", text: "المفتاح إما مضاء وإما مطفأ. ثمانية مفاتيح متجاورة تكفي لتكتب أي عدد من 0 إلى 255." },
        lines: [{ text: "الثنائي أساسه اثنان، ورقماه صفر وواحد: الدارة تعمل أو تتوقف. خمسة تُكتب 101: واحد في خانة الأربعة، وصفر في خانة الاثنين، وواحد في خانة الواحد. والست عشري أساسه ستة عشر، ويختصر كتابة البايت.", cov: "A3-BASE" }],
        terms: [["binary", "الثنائي"], ["hexadecimal", "الست عشري"]],
        art: bulbsLab,
        quiz: {
          id: "a3-base", cov: "A3-BASE-Q",
          prompt: "كم يساوي 5 في الثنائي؟",
          choices: [
            { id: "a", text: "101", ok: true },
            { id: "b", text: "111", ok: false }
          ],
          why: "101 = 4 + 0 + 1. والست عشري يكتب البايت برقمين بدل ثمانية أرقام ثنائية."
        }
      }),
      L({
        part: P1, cov: ["A3-TEXT", "A3-TEXT-Q"],
        titleAr: "بايتات نصية",
        titleEn: "Text as bytes (ASCII)",
        lines: [
          { text: "سطر الإخراج في C++ يعرض النص اللاتيني BTEC Student. ولا توضع حروف عربية داخل هذا السطر.", cov: "A3-TEXT" },
          "بجانب السطر تظهر بايتات ASCII: 42 54 45 43 20 53 74 75 64 65 6E 74. وسمها: بايتات نصية، لا برنامج آلة كامل. المعالج يتعامل مع الأعداد، والإنسان يقرأ السطر."
        ],
        codes: [{ code: 'cout << "BTEC Student";' }],
        art: function (api) { api.shot("hex-beside-cpp", "شاهد الرسم: السطر وبجانبه بايتاته النصية"); },
        quiz: {
          id: "a3-text", cov: "A3-TEXT-Q",
          prompt: "ما الوسم الصحيح لهذه البايتات؟",
          choices: [
            { id: "a", text: "بايتات نصية.", ok: true },
            { id: "b", text: "برنامج آلة كامل.", ok: false }
          ],
          why: "البايتات تمثّل رموز النص. أما برنامج الآلة فسلسلة تعليمات ينفذها المعالج، وهذا المثال لا يدّعي ذلك."
        }
      }),
      { part: P1, cov: ["A3-LAB", "A3-LAB-Q"], titleAr: "مختبر الأرقام", titleEn: "Number systems lab", render: lab },
      L({
        part: P1, cov: ["A3-CPU", "A3-CPU-Q"],
        titleAr: "المعالج وبرنامج التحويل",
        titleEn: "The processor and translators",
        story: { icon: "chat", color: C.sky, who: "مترجم في مؤتمر", text: "المتحدث يتكلم الإنجليزية، والجمهور يفهم العربية. المترجم في المنتصف يجعل الكلام مفهومًا. برنامج التحويل يفعل الشيء نفسه بين الإنسان والمعالج." },
        lines: [{ text: "وحدة المعالجة المركزية تدير الموارد وتنفّذ التعليمات التي تجلبها من الذاكرة. برنامج التحويل يُخرج تعليمات ثنائية يستطيع المعالج تشغيلها. تصحيح الأخطاء إيجاد الخلل وإزالته، والتجميع المتقاطع يبني البرنامج على آلة ليعمل على آلة أخرى.", cov: "A3-CPU" }],
        terms: [["cpu", "المعالج"], ["translator", "برنامج التحويل"], ["compiler", "المترجم"], ["debugging", "تصحيح الأخطاء"], ["cross-compilation", "التجميع المتقاطع"]],
        art: function (api) {
          api.art(A.flow([
            { icon: "code", label: "المصدر", sub: "total = a + b", subEn: true, c: C.teal },
            { icon: "gear", label: "برنامج التحويل", c: C.amber },
            { icon: "file", label: "تعليمات ثنائية", sub: "1011 0000", subEn: true, c: C.vio },
            { icon: "cpu", label: "المعالج ينفذ", c: C.sky }
          ], { bw: 118, label: "من المصدر إلى التنفيذ" }), "من وصف الإنسان إلى تنفيذ المعالج");
          api.order({
            id: "g-a3-cpu",
            title: "رتّب الطريق من الكود إلى التنفيذ",
            items: ["تكتب المصدر بلغة عالية", "برنامج التحويل يقرأ المصدر", "تخرج تعليمات ثنائية", "المعالج يجلبها من الذاكرة وينفذها"],
            start: [2, 0, 3, 1],
            why: "المصدر أولًا، ثم التحويل، ثم الناتج الثنائي، ثم التنفيذ. المعالج لا يفهم المصدر مباشرة."
          });
        },
        quiz: {
          id: "a3-cpu", cov: "A3-CPU-Q",
          prompt: "ما دور برنامج التحويل؟",
          choices: [
            { id: "a", text: "إخراج تعليمات يستطيع المعالج تنفيذها.", ok: true },
            { id: "b", text: "إخفاء البرنامج عن المستخدم نهائيًا.", ok: false }
          ],
          why: "المعالج ينفذ الثنائي. برنامج التحويل يصل بين وصف الإنسان وهذه التعليمات. التصحيح يزيل الخلل، والتجميع المتقاطع يبني لآلة أخرى."
        }
      }),
      L({
        part: P1, cov: ["A3-TRADE", "A3-FIVE", "A3-TRADE-Q"],
        titleAr: "المفاضلة بين المستويين",
        titleEn: "Comparing high-level and low-level languages",
        lines: [
          { text: "خمسة أسباب لكثرة اللغات العالية في العمل: الإنتاجية، وسهولة القراءة، وسهولة التصحيح، ومرونة الأدوات، وإمكان النقل.", cov: "A3-FIVE" },
          { text: "المستوى الأدنى يمنحك تحكمًا نهائيًا، لكن كتابته أطول وأصعب. والمستوى الأعلى أسرع في التطوير، وناتجه غالبًا أقل كفاءة وأكبر حجمًا، فأمر عالٍ واحد قد يصبح مئات التعليمات.", cov: "A3-TRADE" },
          "C++ و Visual Basic .NET تخفيان بنية المعالج. أما لغة الآلة والتجميع فتخفيان قليلًا، وتحتاجان معرفة هذه البنية."
        ],
        art: function (api) {
          const s = '<g class="pulse">' + A.icon("scale", 230, 10, 100, C.amber) + "</g>" +
            A.box(20, 120, 240, 150, C.rose) + A.text(140, 150, "المستوى الأدنى", { size: 17, color: C.rose, weight: 700 }) +
            A.text(140, 185, "تحكم نهائي وكفاءة", { size: 14 }) + A.text(140, 212, "كتابة أطول وأصعب", { size: 14 }) + A.text(140, 239, "يحتاج معرفة المعالج", { size: 14 }) +
            A.box(300, 120, 240, 150, C.teal) + A.text(420, 150, "المستوى الأعلى", { size: 17, color: C.teal, weight: 700 }) +
            A.text(420, 185, "تطوير أسرع وقراءة أسهل", { size: 14 }) + A.text(420, 212, "ناتج أكبر وأقل كفاءة", { size: 14 }) + A.text(420, 239, "يخفي بنية المعالج", { size: 14 });
          api.art(A.svg(560, 285, s, "ميزان المفاضلة بين المستويين"), "مفاضلة: تكسب شيئًا وتدفع ثمنه");
          api.bins({
            id: "g-a3-trade",
            title: "انسب كل صفة إلى مستواها",
            bins: [{ id: "low", label: "المستوى الأدنى" }, { id: "high", label: "المستوى الأعلى" }],
            items: [
              { text: "تحكم نهائي بالعتاد", bin: "low" }, { text: "كتابة أسرع", bin: "high" }, { text: "يحتاج معرفة بنية المعالج", bin: "low" },
              { text: "أسهل في القراءة", bin: "high" }, { text: "ناتج أكبر غالبًا", bin: "high" }, { text: "كتابة أطول وأصعب", bin: "low" }
            ],
            why: "الأدنى قريب من العتاد: تحكم أكبر وكتابة أصعب. الأعلى قريب من الإنسان: تطوير أسرع وقراءة أسهل، وناتج أكبر غالبًا."
          });
        },
        quiz: {
          id: "a3-trade", cov: "A3-TRADE-Q",
          prompt: "ما ثمن سرعة التطوير في اللغة العالية؟",
          choices: [
            { id: "a", text: "الناتج قد يكون أقل كفاءة وأكبر حجمًا.", ok: true },
            { id: "b", text: "المعالج يتوقف عن تنفيذ الثنائي.", ok: false }
          ],
          why: "التحكم النهائي في المستوى الأدنى يقابله بطء الكتابة. وسرعة التطوير في المستوى الأعلى يقابلها غالبًا برنامج أقل كفاءة. هذه مفاضلة، لا إلغاء لأحد الطرفين."
        }
      }),
      L({
        part: P2, cov: ["A3-HOPPER", "A3-HOPPER-Q"],
        titleAr: "هوبر والفراشة",
        titleEn: "Grace Hopper and the bug",
        story: { icon: "moth", color: C.amber, who: "سنة 1945", text: "توقف حاسوب ضخم عن العمل. فتح الفريق جهازه فوجد فراشة عالقة داخل مُرحِّل. أخرجوها، فعاد الحاسوب يعمل." },
        lines: [{ text: "القصة مشهورة ومرتبطة باسم غريس هوبر. لكن كلمة الخطأ في العمل التقني أقدم من هذه الحادثة. احفظها قصة قصيرة تشرح الكلمة، لا أصلًا لها.", cov: "A3-HOPPER" }],
        terms: [["debugging", "تصحيح الأخطاء"]],
        art: function (api) {
          const s = A.box(60, 40, 440, 230, C.sky, { fo: 0.06 }) +
            '<path d="M90 160 h120 l40 -40 M290 160 h180" stroke="' + C.sky + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
            '<circle cx="210" cy="160" r="6" fill="' + C.sky + '"/><circle cx="290" cy="160" r="6" fill="' + C.sky + '"/>' +
            '<g class="bob">' + A.icon("moth", 225, 90, 70, C.amber) + "</g>" +
            A.text(280, 230, "مُرحِّل فيه فراشة", { size: 15, color: C.mute }) + A.text(280, 300, "أُخرجت الفراشة فعاد التشغيل", { size: 15 });
          api.art(A.svg(560, 315, s, "فراشة عالقة في مرحّل"), "حادثة مشهورة، والكلمة أقدم منها");
        },
        quiz: {
          id: "a3-hopper", cov: "A3-HOPPER-Q",
          prompt: "هل بدأت كلمة الخطأ مع حادثة الفراشة؟",
          choices: [
            { id: "a", text: "لا. الكلمة أقدم، والقصة مشهورة.", ok: true },
            { id: "b", text: "نعم. لم تُستخدم الكلمة قبل 1945.", ok: false }
          ],
          why: "إخراج الفراشة أعاد التشغيل في تلك الحادثة. أما استخدام كلمة الخطأ في العمل التقني فسبق القصة."
        }
      }),
      L({
        part: P2, cov: ["A3-PROC", "A3-PROC-Q", "A3-H-PROC-LANGS"],
        titleAr: "النموذج الإجرائي",
        titleEn: "Procedural, e.g. C, Perl, Python",
        story: { icon: "receipt", color: C.teal, who: "تعليمات جهاز الدفع في البقالة", text: "أدخل المبلغ، ثم امسح البطاقة، ثم أدخل الرمز، ثم خذ الإيصال. خطوات محددة بترتيب ثابت لمسألة واحدة." },
        lines: [{ text: "الإجرائي خطوات محددة لمسألة واحدة، وكثير من المبرمجين يبدأون به. إن طالت الخطوات قسّمتها إلى إجراءات، لكل إجراء غرض واحد يمكن إعادة استخدامه. والحتمية وصف أوسع، وتعتمد على الإجراءات بدرجة أقل.", cov: "A3-PROC" }],
        codes: [{ code: "int a, b;\nscanf(\"%d %d\", &a, &b);\nprintf(\"%d\\n\", a + b);", label: "مثال بلغة C: مجموع عددين" }],
        terms: [["procedural", "إجرائي"], ["procedure", "إجراء"], ["imperative", "حتمي"]],
        hints: [{ cov: "A3-H-PROC-LANGS", label: "C و Perl و Python", text: "لغات تُذكر مع النموذج الإجرائي: C و Perl و Python، ومعها BASIC و Fortran. المثال هنا مجموع عددين بلغة C." }],
        art: A.flow([
          { label: "اقرأ a", sub: "scanf", subEn: true, n: "1" },
          { label: "اقرأ b", sub: "scanf", subEn: true, n: "2" },
          { label: "اجمع a + b", n: "3" },
          { label: "اطبع الناتج", sub: "printf", subEn: true, n: "4" }
        ], { dir: "v", label: "أربع خطوات متتالية" }),
        caption: "خطوة بعد خطوة، من الأعلى إلى الأسفل",
        quiz: {
          id: "a3-proc", cov: "A3-PROC-Q",
          prompt: "متى يُقسَّم البرنامج الإجرائي إلى إجراءات؟",
          choices: [
            { id: "a", text: "حين تطول الخطوات أو تتكرر.", ok: true },
            { id: "b", text: "حين يكون البرنامج سطرًا واحدًا.", ok: false }
          ],
          why: "الإجراء خطوات لغرض واحد. التقسيم يسهّل القراءة وإعادة الاستخدام. والمثال يجمع عددين مُدخلين."
        }
      }),
      L({
        part: P2, cov: ["A3-OO", "A3-OO-Q", "A3-H-OO-LANGS", "A3-H-RUBY-MULTI"],
        titleAr: "النموذج الكائني",
        titleEn: "Object-orientated, e.g. C++, C#, Java",
        story: { icon: "taxi", color: C.amber, who: "شركة سيارات أجرة", text: "للشركة مخطط واحد لسيارة الأجرة: رقم لوحة، وسائق، وعدّاد، وفعل «ابدأ الرحلة». من هذا المخطط تخرج مئات السيارات، لكل واحدة بياناتها." },
        lines: [{ text: "الفئة مخطط، والكائن نسخة منه. الحالة بيانات، والسلوك وظائف، وجمعهما داخل الفئة اسمه الكبسلة. يناسب مسائل فيها أشياء من الواقع: عميل، وحساب، ومنتج، وطلب، وألعاب، وواجهات. وتعديل فئة لا يهدم الحل كله.", cov: "A3-OO" }],
        terms: [["object-oriented", "كائني"], ["class", "الفئة"], ["object", "الكائن"], ["encapsulation", "الكبسلة"]],
        hints: [
          { cov: "A3-H-OO-LANGS", label: "لغات كائنية", text: "من اللغات الكائنية: C++ و C# و Java و PHP و Ada و Python و Ruby." },
          { cov: "A3-H-RUBY-MULTI", label: "Ruby", text: "Ruby تُستخدم لغة نصية وفيها ميزات كائنية. اللغة قد تنتمي إلى أكثر من نموذج." }
        ],
        art: function (api) {
          let s = A.box(160, 10, 240, 130, C.vio, { dash: "6 5" }) + A.text(280, 38, "الفئة Taxi", { size: 16, color: C.vio, weight: 700 }) +
            A.text(280, 66, "plate, driver", { size: 13, en: true, cls: "mono" }) + A.text(280, 90, "StartTrip()", { size: 13, en: true, cls: "mono", color: C.amber }) +
            A.text(280, 122, "حالة + سلوك = كبسلة", { size: 13, color: C.mute });
          [["12-345", "سامي"], ["20-777", "ليلى"], ["31-002", "رامي"]].forEach(function (o, i) {
            const x = 20 + i * 180;
            s += A.arrow(280, 142, x + 80, 192, C.vio) + '<g class="rise" style="animation-delay:' + (0.2 + i * 0.12) + 's">' + A.box(x, 196, 160, 110, C.amber) +
              A.icon("taxi", x + 56, 202, 48, C.amber) + A.text(x + 80, 270, o[0], { size: 13, en: true }) + A.text(x + 80, 293, o[1], { size: 13 }) + "</g>";
          });
          api.art(A.svg(560, 315, s, "فئة واحدة وثلاثة كائنات"), "مخطط واحد، وثلاث سيارات لكل منها بياناتها");
        },
        quiz: {
          id: "a3-oo", cov: "A3-OO-Q",
          prompt: "ماذا تجمع الفئة؟",
          choices: [
            { id: "a", text: "الحالة والسلوك في مكان واحد.", ok: true },
            { id: "b", text: "تعليمات المعالج الثنائية فقط.", ok: false }
          ],
          why: "الكبسلة تُبقي البيانات والوظائف داخل الفئة. شاهد الرسم: الفئة حول بياناتها وأفعالها. وتغيير الفئة مع تغيّر الواقع يُبقي بقية الحل."
        }
      }),
      { part: P2, cov: ["A3-ED", "A3-ED-Q", "A3-H-ED-LANGS", "A3-H-VB-MULTI"], titleAr: "النموذج الحدثي", titleEn: "Event-driven, e.g. Visual Basic", render: events },
      { part: P2, cov: ["A3-MACH", "A3-REG", "A3-MACH-Q", "A3-H-VEND"], titleAr: "الآلة والتجميع", titleEn: "Machine, e.g. Assembler", render: machine },
      L({
        part: P2, cov: ["A3-MARK", "A3-MARK-Q"],
        titleAr: "لغات الترميز",
        titleEn: "Mark-up, e.g. HTML",
        story: { icon: "file", color: C.sky, who: "لوحة المطار", text: "شاشة المغادرة في مطار الملكة علياء تعرض رمز AMM. الرمز نفسه يصل إلى أنظمة كثيرة مختلفة، لأنه مكتوب بصيغة يفهمها الجميع." },
        lines: [{ text: "HTML و XML تصفان الهيكل بعلامات، ولا تحسبان مثل برنامج إجرائي. وسم الفقرة يحدد بدايتها ونهايتها. و XML يناسب نقل البيانات بين أنظمة غير متوافقة، ورموز المطارات مثال على بيانات محايدة.", cov: "A3-MARK" }],
        codes: [{ code: "<p>فقرة قصيرة</p>", cov: "A3-HTML", label: "HTML" }, { code: "<airport code=\"AMM\"></airport>", cov: "A3-XML", label: "XML" }],
        terms: [["markup-language", "لغة الترميز"], ["html", "HTML"], ["xml", "XML"]],
        art: function (api) {
          const s = A.box(20, 20, 250, 130, C.teal, { fo: 0.06 }) + A.text(145, 50, "<p>", { en: true, size: 18, color: C.teal, cls: "mono" }) +
            A.text(145, 90, "فقرة قصيرة", { size: 17 }) + A.text(145, 130, "</p>", { en: true, size: 18, color: C.teal, cls: "mono" }) +
            A.text(145, 178, "بداية ← محتوى ← نهاية", { size: 13, color: C.mute }) +
            A.box(300, 20, 240, 130, C.amber, { fo: 0.06 }) + A.icon("plane", 395, 36, 50, C.amber) + A.text(420, 120, 'code="AMM"', { en: true, size: 15, cls: "mono" }) +
            A.icon("server", 310, 210, 50, C.sky) + A.icon("laptop", 395, 210, 50, C.vio) + A.icon("phone", 480, 210, 50, C.rose) +
            A.arrow(420, 152, 335, 208, C.amber) + A.arrow(420, 152, 420, 208, C.amber) + A.arrow(420, 152, 505, 208, C.amber) +
            A.text(420, 290, "أنظمة مختلفة تقرأ الصيغة نفسها", { size: 13, color: C.mute });
          api.art(A.svg(560, 300, s, "وسم HTML ورمز مطار بصيغة XML"), "العلامة تصف الهيكل، ولا تنفّذ حسابًا");
        },
        quiz: {
          id: "a3-mark", cov: "A3-MARK-Q",
          prompt: "ماذا يحدد وسم الفقرة؟",
          choices: [
            { id: "a", text: "بداية الفقرة ونهايتها.", ok: true },
            { id: "b", text: "سرعة المعالج.", ok: false }
          ],
          why: "العلامة تصف الهيكل. و XML ينقل بيانات منظمة بين أنظمة لا تشترك في قاعدة واحدة."
        }
      }),
      L({
        part: P2, cov: ["A3-SCR", "A3-RUBY", "A3-SCR-Q", "A3-H-SCR-LANGS"],
        titleAr: "اللغات النصية",
        titleEn: "Scripting languages",
        story: { icon: "gear", color: C.lime, who: "موظف تقنية في مدرسة", text: "كل صباح كان ينسخ ملفات الحضور يدويًا. كتب سكربتًا قصيرًا يفعل ذلك وحده عند الساعة السابعة." },
        lines: [{ text: "JavaScript تؤتمت صفحة الويب وتضيف تفاعلها. و PHP تعمل على الخادم للمتاجر. و Ruby و Perl تربطان مهامًا كانت تُشغَّل منفصلة. المثال يعرض أول 255 بايتًا من ملف محدد.", cov: "A3-SCR" }],
        codes: [{ code: "file = File.open(path, \"rb\")\nbytes = file.read(255)\nfile.close", cov: "A3-RUBY", label: "Ruby" }],
        terms: [["scripting", "البرمجة النصية"], ["javascript", "JavaScript"], ["php", "PHP"]],
        hints: [{ cov: "A3-H-SCR-LANGS", label: "Perl و Ruby و PHP", text: "مع JavaScript تُذكر هذه اللغات في البرمجة النصية." }],
        art: A.flow([
          { icon: "file", label: "افتح الملف", sub: "File.open", subEn: true, c: C.teal },
          { icon: "eye", label: "اقرأ 255 بايتًا", sub: "read(255)", subEn: true, c: C.amber },
          { icon: "lock", label: "أغلق الملف", sub: "close", subEn: true, c: C.vio }
        ], { label: "سكربت يربط ثلاث مهام" }),
        caption: "مهام كانت منفصلة، يربطها سكربت قصير",
        quiz: {
          id: "a3-scr", cov: "A3-SCR-Q",
          prompt: "ماذا يعرض مثال Ruby؟",
          choices: [
            { id: "a", text: "أول 255 بايتًا من ملف.", ok: true },
            { id: "b", text: "جدول الحقيقة كاملًا.", ok: false }
          ],
          why: "القراءة الثنائية لأول 255 بايتًا مهمة نصية تربط فتح الملف بعرض جزء منه."
        }
      }),
      { part: P2, cov: ["A3-PICK", "A3-PICK-Q"], titleAr: "اختر النموذج المناسب", titleEn: "Choosing a type of language for a problem", render: pick },
      L({
        part: P3, cov: ["A3-CHOOSE", "A3-CHOOSE-Q", "A3-H-C-PLAT", "A3-H-VS", "A3-H-XCODE", "A3-H-WORA", "A3-H-XNA", "A3-H-LOC"],
        titleAr: "عوامل المقارنة بين اللغات",
        titleEn: "Factors to compare and contrast in programming languages",
        lines: [
          { text: "حين تقارن بين اللغات تنظر إلى ستة عوامل: العتاد والبرمجيات اللازمة، والأجهزة الخاصة، والأداء، ومجال التطبيق المفضل، ووقت التطوير، وسهولة التطوير.", cov: "A3-CHOOSE" },
          "وقت التطوير يصعب قياسه. إن قيس بعدد الأسطر فقد يُكتب كود أطول من الحاجة. والمقياس طريقة مقارنة متفق عليها."
        ],
        terms: [["metric", "المقياس"], ["loc", "عدد الأسطر"], ["verbose", "مطوّل"], ["wora", "WORA"]],
        hints: [
          { cov: "A3-H-C-PLAT", label: "منصات C", text: "C متعددة المنصات منذ 1972. من بيئات تطويرها Mac OS X و Windows و Linux." },
          { cov: "A3-H-VS", label: "Visual Studio", text: "Visual Basic .NET تُطوَّر في Visual Studio وتعمل على Windows." },
          { cov: "A3-H-XCODE", label: "Xcode", text: "Objective-C تُطوَّر في Xcode على Mac OS X وتستهدف أجهزة آبل." },
          { cov: "A3-H-WORA", label: "WORA", text: "Java للويب ولأندرويد، وتظهر أيضًا في أجهزة استقبال التلفاز ومشغلات بلو راي." },
          { cov: "A3-H-XNA", label: "XNA", text: "C# للألعاب على Windows وبعض الأجهزة، وساعدتها أدوات XNA." },
          { cov: "A3-H-LOC", label: "عدد الأسطر", text: "LOC يحصي الأسطر وقد يتجاهل الأخطاء. إن صار هدفًا فقد يطول الكود بلا فائدة. و Verbose يعني كودًا أكثر مما يلزم." }
        ],
        art: function (api) {
          api.art(A.tiles([
            { icon: "laptop", label: "العتاد والبرمجيات", sub: "Hardware and software", subEn: true },
            { icon: "plug", label: "أجهزة خاصة", sub: "Special devices", subEn: true },
            { icon: "bolt", label: "الأداء", sub: "Performance", subEn: true },
            { icon: "target", label: "مجال التطبيق", sub: "Application areas", subEn: true },
            { icon: "clock", label: "وقت التطوير", sub: "Development time", subEn: true },
            { icon: "hand", label: "سهولة التطوير", sub: "Ease of development", subEn: true }
          ], { cols: 3, th: 112, label: "ستة عوامل للمقارنة" }), "ستة عوامل تقارن بها بين أي لغتين");
          api.bins({
            id: "g-a3-area",
            title: "مجال التطبيق المفضل: انسب كل لغة إلى مجالها",
            bins: [{ id: "game", label: "ألعاب" }, { id: "android", label: "تطبيقات Android" }, { id: "web", label: "متجر على الخادم" }, { id: "dev", label: "جهاز إلكتروني" }, { id: "ios", label: "تطبيقات iPhone" }],
            items: [{ text: "C#", bin: "game" }, { text: "Java", bin: "android" }, { text: "PHP", bin: "web" }, { text: "C", bin: "dev" }, { text: "Objective-C", bin: "ios" }],
            why: "C# للألعاب مع أدوات XNA، و Java لأندرويد، و PHP للمتاجر على الخادم، و C للأجهزة القريبة من العتاد، و Objective-C لأجهزة آبل."
          });
        },
        quiz: {
          id: "a3-choose", cov: "A3-CHOOSE-Q",
          prompt: "لماذا قد يضر قياس الإنتاجية بعدد الأسطر وحده؟",
          choices: [
            { id: "a", text: "لأنه قد يدفع إلى كتابة أطول من الحاجة ويتجاهل الأخطاء.", ok: true },
            { id: "b", text: "لأن الأسطر لا تُحفظ في الملفات.", ok: false }
          ],
          why: "المقياس الجيد يقارن بإنصاف. عدد الأسطر وحده لا يرى الخلل وقد يشجع التطويل. الأدوات الغنية تعد بتقليل الوقت، لكن الاتفاق على المقياس صعب."
        }
      }),
      { part: P3, cov: ["A3-H-SYNTAX", "A3-H-DEBUG", "A3-H-DRAG", "A3-H-VIRT", "A3-H-JTAG"], titleAr: "أدوات التطوير والأجهزة الخاصة", titleEn: "Development tools and special devices", render: tools },
      { part: P3, cov: ["A3-GC", "A3-GC-Q"], titleAr: "الذاكرة والتسرب", titleEn: "Garbage collection and memory leaks", render: memory },
      L({
        part: P3, cov: ["A3-PRO", "A3-PRO-Q"],
        titleAr: "السلوك المهني",
        titleEn: "Professional behaviour",
        story: { icon: "users", color: C.teal, who: "فريق مشروع التخرج", text: "قال المستخدمون إن الشاشة مزدحمة. غضبت سارة أولًا، ثم جلس الفريق وقارن الهدف بما بنوه، وأعادوا التصميم في يومين." },
        lines: [{ text: "السلوك المهني لا يتبع لغة واحدة: انضباط بأهداف واضحة وجداول قابلة للتنفيذ، واحترام للملاحظات خصوصًا إن قالت إن البرنامج لا يطابق الحاجة، وتقييم النتائج لتبرير قرار التصميم، ومقارنة الهدف بالناتج لتحسين العمل التالي.", cov: "A3-PRO" }],
        points: ["في الفريق: دعم الزملاء وتوزيع العبء.", "رد بنّاء على الاعتراض.", "وضوح ما يُتوقع من صاحب الطلب."],
        art: A.tiles([
          { icon: "clock", label: "الانضباط", sub: "أهداف وجداول" },
          { icon: "chat", label: "احترام الملاحظات", sub: "حتى الصعبة منها" },
          { icon: "chart", label: "تقييم النتائج", sub: "لتبرير القرار" },
          { icon: "users", label: "عمل الفريق", sub: "دعم وتوزيع" }
        ], { cols: 2, th: 116, label: "أربع عادات مهنية" }),
        caption: "عادات تبقى مهما تغيّرت اللغة أو الأداة",
        quiz: {
          id: "a3-pro", cov: "A3-PRO-Q",
          prompt: "ماذا تفيد مقارنة الهدف بالناتج؟",
          choices: [
            { id: "a", text: "تحسين العمل في المرة التالية.", ok: true },
            { id: "b", text: "إخفاء الملاحظات عن الفريق.", ok: false }
          ],
          why: "الانضباط والاحترام والتقييم والمقارنة وعمل الفريق تبقى مهما تغيرت الأداة. المقارنة تكشف ما يلزم تحسينه."
        }
      })
    ]
  });
})();
