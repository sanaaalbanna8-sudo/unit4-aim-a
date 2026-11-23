(function () {
  const A = window.ART;
  const C = A.C;

  const csharp = [
    "const int OrderLimit = 50;",
    "const int DistanceLimit = 26;",
    "",
    "bool IsFree(double order, double distance) {",
    "    return order > OrderLimit && distance < DistanceLimit;",
    "}",
    "",
    "double[] orders = { 80, 40, 55 };",
    "double[] distances = { 10, 30, 20 };",
    "",
    "for (int i = 0; i < orders.Length; i++) {",
    "    string line = IsFree(orders[i], distances[i]) ? \"free\" : \"paid\";",
    "    File.AppendAllText(\"shipping.txt\", line + \"\\n\");",
    "}"
  ];

  const ccode = [
    "const int ORDER_LIMIT = 50;",
    "const int DISTANCE_LIMIT = 26;",
    "",
    "int is_free(double order, double distance) {",
    "    return order > ORDER_LIMIT && distance < DISTANCE_LIMIT;",
    "}",
    "",
    "double orders[3] = { 80, 40, 55 };",
    "double distances[3] = { 10, 30, 20 };",
    "",
    "FILE *file = fopen(\"shipping.txt\", \"a\");",
    "for (int i = 0; i < 3; i++) {",
    "    if (file) fprintf(file, \"%s\\n\",",
    "        is_free(orders[i], distances[i]) ? \"free\" : \"paid\");",
    "}",
    "if (file) fclose(file);"
  ];

  function codeBox(lines, marks, diffs) {
    const box = UI.el("div", { class: "codebox" });
    lines.forEach(function (t, i) {
      const ln = UI.el("span", { class: "ln" + (marks && marks.indexOf(i) >= 0 ? " hl" : ""), "data-line": String(i) }, t || " ");
      if (diffs && diffs[i]) ln.appendChild(UI.el("span", { class: "diff", text: String(diffs[i]) }));
      box.appendChild(ln);
    });
    return box;
  }

  const CONSTRUCTS = [
    ["var", "متغير", [7, 8, 10, 11]],
    ["const", "ثابت", [0, 1]],
    ["sel", "اختيار", [4, 11]],
    ["iter", "تكرار", [10]],
    ["unit", "وحدة", [3, 4, 5]],
    ["arr", "مصفوفة", [7, 8]],
    ["file", "ملف", [12]]
  ];

  function program(api) {
    api.story({ icon: "truck", color: C.teal, who: "متجر إلكتروني في عمّان", text: "صاحبة المتجر تريد برنامجًا صغيرًا يقرر لكل طلب: شحن مجاني أم مدفوع؟ ويكتب القرار في ملف تراجعه آخر اليوم." });
    api.p("البرنامج يقرر الشحن المجاني. حد الطلب 50 وحد المسافة 26. يكون الشحن مجانيًا إذا تجاوز الطلب الحد وكانت المسافة أقل من الحد، والمسافة 26 نفسها ليست مجانية.");
    api.example("النتائج الثلاث: 80 مع 10 مجاني، و 40 مع 30 مدفوع، و 55 مع 20 مجاني.");
    api.p("اضغط كل بنية لترى أسطرها في الكود. البنى السبع كلها موجودة.", "FIN-CONST");
    api.lab({
      title: "شغّل البرنامج وعلّم البنى",
      line: "«شغّل» ينفذ الحلقة طلبًا طلبًا. وأزرار البنى تضيء أسطرها.",
      cov: "FIN-PROG",
      build: function (body) {
        let box = codeBox(csharp);
        const holder = UI.el("div", null, box);
        const chips = UI.el("div", { class: "row" });
        const file = UI.el("ol", { class: "ledger", dir: "ltr" });
        const out = UI.el("p", { class: "readout", text: "shipping.txt فارغ." });
        CONSTRUCTS.forEach(function (c) {
          const b = UI.el("button", { type: "button", class: "chip", "aria-pressed": "false", text: c[1] });
          b.addEventListener("click", function () {
            chips.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
            box.querySelectorAll(".ln").forEach(function (ln) { ln.classList.toggle("hl", c[2].indexOf(Number(ln.dataset.line)) >= 0); ln.classList.remove("run"); });
          });
          chips.appendChild(b);
        });
        const orders = [80, 40, 55], dists = [10, 30, 20];
        let i = 0;
        const run = UI.el("button", { type: "button", class: "btn", text: "▶ شغّل الطلب التالي" });
        run.addEventListener("click", function () {
          if (i >= 3) return;
          const free = orders[i] > 50 && dists[i] < 26;
          box.querySelectorAll(".ln").forEach(function (ln) { ln.classList.remove("hl"); ln.classList.toggle("run", [4, 11, 12].indexOf(Number(ln.dataset.line)) >= 0); });
          file.appendChild(UI.el("li", { style: "font-family:var(--mono)", text: (free ? "free" : "paid") + "   // order " + orders[i] + ", distance " + dists[i] }));
          out.textContent = "الطلب " + UI.ar(i + 1) + ": " + orders[i] + " و" + " " + dists[i] + " ← " + (free ? "مجاني" : "مدفوع") + (i === 2 ? ". انتهت الحلقة." : "");
          i += 1;
          run.disabled = i >= 3;
        });
        body.appendChild(holder);
        body.appendChild(chips);
        body.appendChild(UI.el("div", { class: "row" }, run));
        body.appendChild(UI.el("p", { class: "zone-label", text: "shipping.txt" }));
        body.appendChild(file);
        body.appendChild(out);
      }
    });
    api.quiz({
      id: "fin-const",
      cov: "FIN-CONST-Q",
      mode: "multi",
      prompt: "أي البنى ظاهرة في برنامج الشحن؟",
      choices: [
        { id: "var", text: "متغير", ok: true },
        { id: "const", text: "ثابت", ok: true },
        { id: "sel", text: "اختيار", ok: true },
        { id: "iter", text: "تكرار", ok: true },
        { id: "unit", text: "وحدة", ok: true },
        { id: "arr", text: "مصفوفة", ok: true },
        { id: "file", text: "ملف", ok: true }
      ],
      why: "OrderLimit و DistanceLimit ثابتان. order و distance و i و line متغيرات. الشرط داخل IsFree اختيار. الحلقة تكرار. IsFree وحدة. orders و distances مصفوفتان. والكتابة في shipping.txt ملف."
    });
  }

  function thinking(api) {
    api.p("البنى نفسها تُقرأ بأدوات التفكير الحاسوبي: التفكيك قسّم الشحن إلى فحص ثم قرار ثم كتابة. والنمط: القاعدة نفسها تُطبق على كل طلب. والتعميم: القاعدة تصلح لأي متجر يضع الحدّين. والتجريد: الدالة تخفي الشرط، والمستدعي يرى النتيجة فقط.");
    api.term("computational-thinking", "التفكير الحاسوبي");
    api.term("decomposition", "التفكيك");
    api.term("pattern-recognition", "تعرّف الأنماط");
    api.term("abstraction", "التجريد");
    api.art(A.tiles([
      { icon: "layers", label: "التفكيك", sub: "فحص ← قرار ← كتابة", c: C.teal },
      { icon: "eye", label: "النمط", sub: "القاعدة لكل طلب", c: C.amber },
      { icon: "sparkle", label: "التعميم", sub: "لأي متجر بحدّين", c: C.vio },
      { icon: "filter", label: "التجريد", sub: "IsFree تخفي الشرط", subEn: false, c: C.rose }
    ], { cols: 2, th: 116, label: "برنامج الشحن بعين التفكير الحاسوبي" }), "المهارات الأربع من A1، في برنامج حقيقي");
    api.bins({
      id: "g-fin-ct",
      title: "انسب كل ملاحظة إلى مهارتها",
      bins: [{ id: "dec", label: "التفكيك" }, { id: "pat", label: "النمط" }, { id: "gen", label: "التعميم" }, { id: "abs", label: "التجريد" }],
      items: [
        { text: "فحص ثم قرار ثم كتابة", bin: "dec" },
        { text: "الشرط نفسه يتكرر لكل طلب", bin: "pat" },
        { text: "يصلح لأي متجر بتغيير الحدّين", bin: "gen" },
        { text: "المستدعي يرى «مجاني» فقط", bin: "abs" }
      ],
      why: "التقسيم تفكيك، وتكرار القاعدة نمط، وصلاحها لمتجر آخر تعميم، وإخفاء الشرط داخل الدالة تجريد."
    });
    api.link("لأن الفحص معزول في دالة، فإن التفاصيل تختفي عن المستدعي، لذلك هذا تجريد بعد تفكيك.", "FIN-CT");
    api.quiz({
      id: "fin-ct",
      cov: "FIN-CT-Q",
      prompt: "إخفاء الشرط داخل IsFree مثال على ماذا؟",
      choices: [
        { id: "a", text: "التجريد.", ok: true },
        { id: "b", text: "تغيير حد المسافة إلى 260.", ok: false }
      ],
      why: "التقسيم تفكيك، وتكرار القاعدة على كل طلب نمط، وصلاحها لمتجر آخر تعميم، وإخفاء الشرط داخل الدالة تجريد."
    });
  }

  function radar(api) {
    api.p("هنا سبعة محاور. السابع: تلبية متطلبات المستخدم، أي هل يقرر البرنامج الشحن بشكل صحيح ومفهوم لصاحبة المتجر. حرّك المحاور ولاحظ أن رفع محور قد يكلف آخر.");
    api.term("user-requirements", "متطلبات المستخدم");
    window.RadarLab(api, {
      title: "رادار برنامج الشحن",
      line: "قيّم برنامج الشحن على سبعة محاور، أو جرّب نسخة جاهزة.",
      cov: "FIN-RADAR",
      color: C.vio,
      labels: ["الكفاءة", "قابلية الصيانة", "قابلية النقل", "الموثوقية", "المتانة", "سهولة الاستخدام", "تلبية متطلبات المستخدم"],
      presets: [
        ["نسخة C#", [4, 4, 3, 5, 3, 4, 5], "ثوابت مسماة ودالة واضحة: صيانة أسهل وقرار صحيح."],
        ["نسخة C", [5, 3, 5, 5, 3, 4, 5], "أسرع وأوسع نقلًا، لكن عليك إغلاق الملف بيدك."],
        ["نسخة بأرقام سحرية", [4, 1, 3, 4, 2, 4, 3], "50 و 26 مكررة بلا أسماء: تعديل الحد يصبح مخاطرة."]
      ]
    });
    api.link("لأن المتطلبات تطلب قرارًا صحيحًا وملفًا واضحًا، فإن الموثوقية وسهولة القراءة ترتفعان معًا، لذلك لا يُضحّى بهما من أجل سرعة شكلية.");
    api.quiz({
      id: "fin-radar",
      cov: "FIN-RADAR-Q",
      prompt: "ما المحور الذي لا يوجد في رادار الصفات الست؟",
      choices: [
        { id: "a", text: "تلبية متطلبات المستخدم.", ok: true },
        { id: "b", text: "الموثوقية.", ok: false }
      ],
      why: "رادار A6 فيه ست صفات. وهنا يُضاف محور سابع: هل يلبي البرنامج ما يحتاجه المستخدم، وهو هنا قرار شحن صحيح ومفهوم."
    });
  }

  function languages(api) {
    api.p("المنطق نفسه بلغتين. ثلاثة فروق فقط: الكتابة القوية مقابل التحويل الضمني، وغياب النوع المنطقي في C، وجمع البيانات المهملة في C# مقابل الإغلاق اليدوي في C.");
    api.add(UI.el("div", { class: "example", "data-cov": "FIN-DIFF" },
      UI.el("span", { class: "ex-tag", text: "الفروق الثلاثة" }),
      UI.el("p", null, UI.el("strong", { text: "1. الكتابة: " }), "C# تصرّح بالنوع وترفض الخلط الصامت، و C قد تحوّل القيمة ضمنيًا."),
      UI.el("p", null, UI.el("strong", { text: "2. النوع المنطقي: " }), "C# تستخدم bool، والمثال في C يستخدم int لأن النوع المنطقي غير متاح في C الكلاسيكية."),
      UI.el("p", null, UI.el("strong", { text: "3. الذاكرة والملف: " }), "C# تترك جمع البيانات المهملة للمنصة، و C تغلق الملف بـ fclose بيدك.")
    ));
    api.term("strongly-typed", "كتابة قوية");
    api.term("boolean", "قيمة منطقية");
    api.term("garbage-collection", "جمع البيانات المهملة");
    api.term("csharp", "C#");
    api.term("c", "C");
    api.lab({
      title: "مفتاح اللغتين",
      line: "بدّل بين C# و C. الأرقام الدائرية تشير إلى الفروق الثلاثة فقط.",
      cov: "FIN-LANG",
      build: function (body) {
        let lang = "cs";
        const holder = UI.el("div");
        const bar = UI.el("div", { class: "row" });
        const cs = UI.el("button", { type: "button", class: "chip", text: "C#" });
        const cc = UI.el("button", { type: "button", class: "chip", text: "C" });
        const test = UI.el("div", { class: "grid2" });
        const ord = UI.el("input", { type: "number", value: "55", "aria-label": "قيمة الطلب" });
        const dis = UI.el("input", { type: "number", value: "26", "aria-label": "المسافة" });
        const out = UI.el("p", { class: "readout" });
        function draw() {
          cs.setAttribute("aria-pressed", lang === "cs" ? "true" : "false");
          cc.setAttribute("aria-pressed", lang === "c" ? "true" : "false");
          holder.replaceChildren(lang === "cs" ? codeBox(csharp, null, { 3: 2, 11: 1, 12: 3 }) : codeBox(ccode, null, { 3: 2, 13: 1, 15: 3 }));
          const o = Number(ord.value) || 0, d = Number(dis.value) || 0;
          const free = o > 50 && d < 26;
          out.replaceChildren(UI.el("span", { dir: "ltr", style: "font-family:var(--mono)", text: (lang === "cs" ? "IsFree(" + o + ", " + d + ") = " + (free ? "true" : "false") : "is_free(" + o + ", " + d + ") = " + (free ? "1" : "0")) }), " ← " + (free ? "مجاني" : "مدفوع") + ". القرار نفسه في اللغتين.");
        }
        cs.addEventListener("click", function () { lang = "cs"; draw(); });
        cc.addEventListener("click", function () { lang = "c"; draw(); });
        ord.addEventListener("input", draw);
        dis.addEventListener("input", draw);
        bar.appendChild(cs); bar.appendChild(cc);
        test.appendChild(UI.el("label", { class: "field" }, UI.el("span", { text: "قيمة الطلب" }), ord));
        test.appendChild(UI.el("label", { class: "field" }, UI.el("span", { text: "المسافة" }), dis));
        body.appendChild(bar);
        body.appendChild(holder);
        body.appendChild(test);
        body.appendChild(out);
        draw();
      }
    });
    api.quiz({
      id: "fin-lang",
      cov: "FIN-LANG-Q",
      prompt: "أي جملة تقيّم الفرق في الذاكرة؟",
      choices: [
        { id: "a", text: "C# تجمع البيانات المهملة، و C تغلق الملف يدويًا.", ok: true },
        { id: "b", text: "اللغتان بلا أي فرق في الأنواع أو الذاكرة.", ok: false }
      ],
      why: "الفروق ثلاثة لا أكثر: كتابة قوية مقابل تحويل ضمني، و bool مقابل int، وجمع تلقائي مقابل fclose. والمنطق الشرطي واحد: الطلب فوق 50 والمسافة تحت 26."
    });
  }

  function draft(api) {
    api.p("اكتب أربع جمل عن برنامج الشحن. المسودة تُحفظ في المتصفح وأنت تكتب، وزر النسخ يجمع الجمل الأربع.");
    api.points(["اشرح: صف القرار.", "اربط: صِل الدالة بمهارة.", "حلّل وقارن: لغتان في الأنواع والذاكرة.", "قيّم: احكم واختر."]);
    api.lab({
      title: "أربع جمل",
      tag: "مسودة",
      line: "اكتب جملة كاملة في كل خانة، ثم انسخها.",
      cov: "FIN-DRAFT",
      build: function (body) {
        const keys = [
          ["explain", "اشرح", "اشرح قرار الشحن بجملة واحدة."],
          ["link", "اربط", "اربط الدالة IsFree بالتجريد."],
          ["compare", "حلّل وقارن", "قارن C# و C في الأنواع والذاكرة."],
          ["judge", "قيّم", "قيّم: أي اللغتين أقرب إلى جهاز بلا جمع تلقائي؟"]
        ];
        let saved = {};
        try { saved = JSON.parse(UI.loadDraft() || "{}") || {}; } catch (err) { saved = {}; }
        const areas = {};
        const note = UI.el("p", { class: "readout", text: "المسودة تُحفظ مع الكتابة." });
        function store() {
          const data = {};
          keys.forEach(function (k) { data[k[0]] = areas[k[0]].value; });
          UI.saveDraft(JSON.stringify(data));
          note.textContent = "حُفظت المسودة في المتصفح.";
        }
        keys.forEach(function (k) {
          const area = UI.el("textarea", { rows: "2", placeholder: k[2], "aria-label": k[2] });
          area.value = saved[k[0]] || "";
          area.addEventListener("input", store);
          areas[k[0]] = area;
          body.appendChild(UI.el("label", { class: "field", "data-cov": "FIN-" + k[0].toUpperCase() }, UI.el("span", { text: k[1] + " — " + k[2] }), area));
        });
        const copy = UI.el("button", { type: "button", class: "btn", text: "انسخ الجمل الأربع" });
        copy.addEventListener("click", function () {
          const text = keys.map(function (k) { return k[1] + ": " + areas[k[0]].value.trim(); }).join("\n");
          function fallback() {
            const helper = document.createElement("textarea");
            helper.value = text;
            document.body.appendChild(helper);
            helper.select();
            try { document.execCommand("copy"); note.textContent = "نُسخت الجمل."; } catch (err) { note.textContent = "تعذّر النسخ. حدّد النص بنفسك."; }
            helper.remove();
          }
          try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(function () { note.textContent = "نُسخت الجمل."; }).catch(fallback);
              return;
            }
          } catch (err) {}
          fallback();
        });
        body.appendChild(UI.el("div", { class: "row" }, copy));
        body.appendChild(note);
      }
    });
    api.quiz({
      id: "fin-draft",
      cov: "FIN-DRAFT-Q",
      prompt: "عمَّ تسأل جملة «قيّم» في هذا البرنامج؟",
      choices: [
        { id: "a", text: "أي اللغتين أقرب إلى جهاز بلا جمع تلقائي.", ok: true },
        { id: "b", text: "لون زر الشحن.", ok: false }
      ],
      why: "«اشرح» تعرض القرار. و«اربط» تصل الدالة بالتجريد. و«حلّل وقارن» تعرض نوعي الكتابة والذاكرة. و«قيّم» تختار اللغة الأقرب إلى التحرير اليدوي، وهي C في هذا المثال."
    });
  }

  UI.register({
    id: "final",
    badge: "محلّل",
    tone: "violet",
    short: "محلل البرنامج",
    shortEn: "Analyser",
    titleAr: "محلل البرنامج",
    titleEn: "Program analyser",
    blurb: "اقرأ برنامج الشحن وبرنامج إدارة الطلاب، ثم اربطهما بالبنى والتفكير والجودة.",
    screens: [].concat([
      { cov: ["FIN-PROG", "FIN-CONST", "FIN-CONST-Q"], titleAr: "برنامج الشحن المجاني", titleEn: "Constructs in a real program", render: program },
      { cov: ["FIN-CT", "FIN-CT-Q"], titleAr: "الربط بالتفكير الحاسوبي", titleEn: "Link to computational thinking skills", render: thinking },
      { cov: ["FIN-RADAR", "FIN-RADAR-Q"], titleAr: "رادار بسبعة محاور", titleEn: "Quality of software applications + user requirements", render: radar },
      { cov: ["FIN-LANG", "FIN-DIFF", "FIN-LANG-Q"], titleAr: "المنطق نفسه بلغتين", titleEn: "The same logic in C# and C", render: languages },
    ], window.FINAL_CASES || [], [
      { cov: ["FIN-DRAFT", "FIN-EXPLAIN", "FIN-LINK", "FIN-COMPARE", "FIN-JUDGE", "FIN-DRAFT-Q"], titleAr: "أربع جمل", titleEn: "Explain, link, compare, evaluate", render: draft }
    ])
  });
})();
