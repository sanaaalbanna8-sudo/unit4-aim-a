/* شاشات تحليل إضافية في المحلل: برنامج إدارة الطلاب بأربع لغات، ونمط مشترك في ثلاثة أنظمة، وتقييم الجودة. */
(function () {
  const A = window.ART;
  const C = A.C;

  const cs = [
    "const int PASS_MARK = 50;",
    "const string DATA_FILE = \"students_cs.txt\";",
    "",
    "static Dictionary<string, Student> students = new Dictionary<string, Student>();",
    "static Queue<string> markQueue = new Queue<string>();",
    "static Stack<string> reportStack = new Stack<string>();",
    "",
    "struct StudentResult { public double Average; public string Status; }",
    "",
    "static void AddStudent() {",
    "    string id = Console.ReadLine();",
    "    string name = Console.ReadLine();",
    "    students[id] = new Student { Name = name };",
    "    markQueue.Enqueue(id);",
    "}",
    "",
    "static void AddMarks() {",
    "    if (markQueue.Count == 0) return;",
    "    string id = markQueue.Dequeue();",
    "    for (int i = 1; i <= 3; i++)",
    "        students[id].Marks.Add(int.Parse(Console.ReadLine()));",
    "}",
    "",
    "static StudentResult CalculateResult(string id) {",
    "    double total = 0;",
    "    foreach (int m in students[id].Marks) total += m;",
    "    double avg = total / students[id].Marks.Count;",
    "    return new StudentResult { Average = avg,",
    "        Status = avg >= PASS_MARK ? \"PASS\" : \"FAIL\" };",
    "}",
    "",
    "static void GenerateReport(string id) {",
    "    StudentResult r = CalculateResult(id);",
    "    string report = $\"{students[id].Name} {r.Average:0.0} {r.Status}\";",
    "    reportStack.Push(report);",
    "}",
    "",
    "static void ViewLastReport() {",
    "    if (reportStack.Count > 0) Console.WriteLine(reportStack.Peek());",
    "}",
    "",
    "static void Save() {",
    "    using (StreamWriter sw = new StreamWriter(DATA_FILE))",
    "        foreach (var s in students)",
    "            sw.WriteLine($\"{s.Key}|{s.Value.Name}|{string.Join(\",\", s.Value.Marks)}\");",
    "}",
    "",
    "// Main: while (true) { ... if (c == \"5\") { Save(); break; } }"
  ];

  const PARTS = [
    ["ثابت", [0, 1]],
    ["متغير", [10, 11, 24, 26, 32, 33]],
    ["طابور Queue", [4, 13, 17, 18]],
    ["مكدس Stack", [5, 34, 38]],
    ["سجل struct", [7, 27, 28, 32]],
    ["دالة وإجراء", [9, 16, 23, 31, 37, 41]],
    ["اختيار", [17, 28, 38]],
    ["تكرار", [19, 25, 43, 47]],
    ["إدخال وإخراج", [10, 11, 20, 38]],
    ["ملف", [1, 42, 44]]
  ];

  function codeBox(lines) {
    const box = UI.el("div", { class: "codebox tall" });
    lines.forEach(function (t, i) { box.appendChild(UI.el("span", { class: "ln", "data-line": String(i) }, t || " ")); });
    return box;
  }
  function light(box, list, cls) {
    box.querySelectorAll(".ln").forEach(function (ln) {
      ln.classList.remove("hl", "run");
      if (list.indexOf(Number(ln.dataset.line)) >= 0) ln.classList.add(cls || "hl");
    });
    const first = box.querySelector(".ln." + (cls || "hl"));
    if (first) box.scrollTop = Math.max(0, first.offsetTop - 40);
  }

  /* ---------- 1. برنامج إدارة الطلاب ---------- */
  function students(api) {
    api.story({
      icon: "user", color: C.vio, who: "أول أسبوع في شركة برمجيات صغيرة",
      text: "يسلّمك المشرف ملفًا فيه برامج جاهزة، ويقول: «الأسبوع القادم نزور كلية ونشرح البرمجة. حلّل هذه البرامج وافهم كيف بُنيت». أول برنامج: نظام لإدارة الطلاب وعلاماتهم."
    });
    api.p("البرنامج يضيف الطلاب، ثم يُدخل علامات كل طالب بالترتيب، ويحسب المعدل والحالة، ويحفظ التقارير، ثم يكتب كل شيء في ملف حتى لا يضيع عند الإغلاق.");
    api.points([
      "طابور Queue: الطلاب الذين ينتظرون إدخال علاماتهم. أول من أُضيف أول من تُدخل علاماته.",
      "مكدس Stack: التقارير. آخر تقرير أُنشئ هو أول ما تراه.",
      "سجل struct: ملخص النتيجة، المعدل والحالة معًا.",
      "ملف: يحفظ البيانات بين مرة تشغيل وأخرى."
    ]);
    api.example("طابور المخبز صباح الجمعة: من وصل أولًا يأخذ خبزه أولًا. وكومة الصحون في المطبخ: آخر صحن وُضع هو أول صحن يُرفع.", null, "من حياتك");
    api.lab({
      title: "اقرأ الكود وعلّم البنى (C#)",
      tag: "كود",
      line: "مختصر من البرنامج الأصلي. اضغط أي بنية لتضيء أسطرها.",
      build: function (body) {
        const box = codeBox(cs);
        const chips = UI.el("div", { class: "row" });
        PARTS.forEach(function (p) {
          const b = UI.el("button", { type: "button", class: "chip", "aria-pressed": "false", text: p[0] });
          b.addEventListener("click", function () {
            chips.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
            light(box, p[1]);
          });
          chips.appendChild(b);
        });
        body.appendChild(chips);
        body.appendChild(box);
      }
    });
    api.lab({
      title: "شغّل الطابور والمكدس",
      tag: "مختبر",
      line: "أضف طلابًا، ثم أدخل علاماتهم، ثم أنشئ التقارير. راقب من يخرج أولًا من كل بنية.",
      build: function (body) {
        const pool = [
          { id: "S1", name: "سارة", marks: [80, 72, 90] },
          { id: "S2", name: "عمر", marks: [40, 55, 38] },
          { id: "S3", name: "ليث", marks: [65, 70, 48] }
        ];
        let added = 0;
        const queue = [];
        const marked = [];
        const stack = [];
        const qEl = UI.el("div", { class: "qs-queue" });
        const sEl = UI.el("div", { class: "qs-stack" });
        const out = UI.el("p", { class: "readout", text: "الطابور فارغ، والمكدس فارغ." });
        function draw(flash) {
          qEl.replaceChildren();
          if (!queue.length) qEl.appendChild(UI.el("span", { class: "empty", text: "لا أحد ينتظر" }));
          queue.forEach(function (s, i) { qEl.appendChild(UI.el("span", { class: "qs-item" + (i === 0 ? " front" : "") + (flash === "q" && i === queue.length - 1 ? " pop-in" : ""), text: s.name })); });
          sEl.replaceChildren();
          if (!stack.length) sEl.appendChild(UI.el("span", { class: "empty", text: "لا تقارير" }));
          stack.slice().reverse().forEach(function (r, i) { sEl.appendChild(UI.el("span", { class: "qs-item" + (i === 0 ? " top" : "") + (flash === "s" && i === 0 ? " pop-in" : "") + (flash === "peek" && i === 0 ? " peek" : ""), text: r })); });
        }
        const btn = function (t) { return UI.el("button", { type: "button", class: "btn small", text: t }); };
        const bAdd = btn("1 أضف طالبًا"), bMarks = btn("2 أدخل العلامات"), bRep = btn("3 أنشئ تقريرًا"), bPeek = btn("4 آخر تقرير");
        bAdd.addEventListener("click", function () {
          if (added >= pool.length) { out.textContent = "أُضيف الطلاب الثلاثة."; return; }
          const s = pool[added++];
          queue.push(s);
          draw("q");
          out.textContent = "Enqueue: دخل " + s.name + " آخر الطابور.";
        });
        bMarks.addEventListener("click", function () {
          if (!queue.length) { out.textContent = "markQueue.Count == 0: لا أحد في الطابور."; return; }
          const s = queue.shift();
          marked.push(s);
          draw();
          out.textContent = "Dequeue: خرج " + s.name + " من مقدمة الطابور، وعلاماته " + s.marks.join(" و ") + ".";
        });
        bRep.addEventListener("click", function () {
          if (!marked.length) { out.textContent = "لا يوجد طالب أُدخلت علاماته بعد."; return; }
          const s = marked.shift();
          const avg = s.marks.reduce(function (a, b) { return a + b; }, 0) / s.marks.length;
          const status = avg >= 50 ? "PASS" : "FAIL";
          stack.push(s.name + ": ⁦" + avg.toFixed(1) + " " + status + "⁩");
          draw("s");
          out.textContent = "Push: المعدل " + avg.toFixed(1) + (avg >= 50 ? " ≥ 50، فالحالة PASS." : " < 50، فالحالة FAIL.") + " والتقرير صار في قمة المكدس.";
        });
        bPeek.addEventListener("click", function () {
          if (!stack.length) { out.textContent = "reportStack.Count == 0: لا تقارير."; return; }
          draw("peek");
          out.textContent = "Peek: آخر تقرير هو «" + stack[stack.length - 1] + "»، ولا يُحذف من المكدس.";
        });
        body.appendChild(UI.el("div", { class: "row" }, bAdd, bMarks, bRep, bPeek));
        body.appendChild(UI.el("div", { class: "qs-wrap" },
          UI.el("div", null, UI.el("p", { class: "zone-label", text: "طابور العلامات: يخرج من المقدمة" }), qEl),
          UI.el("div", null, UI.el("p", { class: "zone-label", text: "مكدس التقارير: القمة في الأعلى" }), sEl)));
        body.appendChild(out);
        draw();
      }
    });
    api.quiz({
      id: "case-queue",
      prompt: "لماذا استخدم المبرمج طابورًا لإدخال العلامات؟",
      choices: [
        { id: "a", text: "لأن أول طالب أُضيف يجب أن تُدخل علاماته أولًا.", ok: true },
        { id: "b", text: "لأن آخر طالب أُضيف يجب أن تُدخل علاماته أولًا.", ok: false },
        { id: "c", text: "لأن الطابور يحفظ البيانات في ملف.", ok: false }
      ],
      why: "الطابور يعمل بمبدأ الأول يدخل الأول يخرج. أما آخر من يدخل أول من يخرج فهذا المكدس، والملف هو الذي يحفظ البيانات."
    });
  }

  /* ---------- 2. البرنامج نفسه بأربع لغات ---------- */
  const LANGS = ["C#", "VB.NET", "Java", "Ruby"];
  const ROWS = [
    ["ثابت", "const int PASS_MARK = 50;", "Const PASS_MARK As Integer = 50", "static final int PASS_MARK = 50;", "PASS_MARK = 50"],
    ["سجل", "struct StudentResult { … }", "Structure StudentResult … End Structure", "static class StudentResult { … }", "Struct.new(:average, :status)"],
    ["إضافة إلى الطابور", "markQueue.Enqueue(id);", "markQueue.Enqueue(id)", "markQueue.add(id);", "$mark_queue << id"],
    ["إخراج من الطابور", "markQueue.Dequeue()", "markQueue.Dequeue()", "markQueue.poll()", "$mark_queue.shift"],
    ["دفع إلى المكدس", "reportStack.Push(report);", "reportStack.Push(report)", "reportStack.push(report);", "$report_stack.push(report)"],
    ["قراءة القمة", "reportStack.Peek()", "reportStack.Peek()", "reportStack.peek()", "$report_stack.last"],
    ["تكرار ثلاث مرات", "for (int i = 1; i <= 3; i++)", "For i As Integer = 1 To 3", "for (int i = 1; i <= 3; i++)", "3.times do |i|"],
    ["اختيار من القائمة", "if (c == \"1\") … else if …", "Select Case c", "switch (choice)", "case choice when \"1\""],
    ["كتابة الملف", "new StreamWriter(DATA_FILE)", "Using sw As New StreamWriter(DATA_FILE)", "new BufferedWriter(new FileWriter(DATA_FILE))", "File.open(DATA_FILE, \"w\")"]
  ];
  const NOTES = [
    "C#: لغة كائنية على منصة .NET. الكلمة const للثابت، و struct للسجل، والأقواس تحدد الكتل.",
    "VB.NET: على المنصة نفسها، فأسماء الطابور والمكدس نفسها: Enqueue و Peek. لكن الكتل تُغلق بكلمات مثل End Structure، والاختيار بـ Select Case.",
    "Java: لا يوجد struct، فيستخدم المبرمج class صغيرة بدلًا منه. والطابور LinkedList، وإخراج أوله بـ poll.",
    "Ruby: لغة نصية مختصرة. لا يوجد صنف طابور هنا، فالمصفوفة تعمل طابورًا: << تضيف في الآخر، و shift تأخذ من الأول."
  ];

  function fourLangs(api) {
    api.p("الملف نفسه فيه البرنامج مكتوبًا بأربع لغات. المنطق واحد: طابور، ومكدس، وسجل، وملف. الذي يتغير هو طريقة الكتابة.");
    api.example("كما تقول «شكرًا» بالعربية، و Thank you بالإنجليزية، و Merci بالفرنسية: المعنى واحد والكلمات مختلفة.", null, "من حياتك");
    api.points([
      "C# و VB.NET تعملان على منصة .NET نفسها، لذلك تتشابه أسماء الأدوات.",
      "Java تحتاج class حين لا يوجد struct.",
      "Ruby أقصر، والمصفوفة فيها تقوم بعمل الطابور والمكدس."
    ]);
    api.lab({
      title: "بدّل اللغة وقارن",
      tag: "مقارنة",
      line: "اختر لغة لترى كل بنية مكتوبة بها، أو اعرض الجدول كاملًا.",
      build: function (body) {
        let lang = 0;
        const tabs = UI.el("div", { class: "row" });
        const list = UI.el("div", { class: "lang-list" });
        const note = UI.el("p", { class: "readout" });
        function draw() {
          tabs.querySelectorAll(".chip").forEach(function (t, i) { t.setAttribute("aria-pressed", i === lang ? "true" : "false"); });
          list.replaceChildren();
          if (lang === 4) {
            const table = UI.el("table", { class: "lang-table" });
            const head = UI.el("tr", null, UI.el("th", { text: "البنية" }));
            LANGS.forEach(function (l) { head.appendChild(UI.el("th", { dir: "ltr", text: l })); });
            table.appendChild(head);
            ROWS.forEach(function (r) {
              const tr = UI.el("tr", null, UI.el("th", { text: r[0] }));
              for (let k = 1; k <= 4; k++) tr.appendChild(UI.el("td", { dir: "ltr" }, UI.el("code", { text: r[k] })));
              table.appendChild(tr);
            });
            list.appendChild(UI.el("div", { class: "table-scroll" }, table));
            note.textContent = "اقرأ كل صف: البنية نفسها بأربع طرق كتابة.";
            return;
          }
          ROWS.forEach(function (r, i) {
            list.appendChild(UI.el("div", { class: "lang-row", style: "animation-delay:" + (i * 0.04) + "s" },
              UI.el("span", { class: "lang-k", text: r[0] }),
              UI.el("code", { dir: "ltr", text: r[lang + 1] })));
          });
          note.textContent = NOTES[lang];
        }
        LANGS.concat(["الجدول كاملًا"]).forEach(function (l, i) {
          const t = UI.el("button", { type: "button", class: "chip", dir: i < 4 ? "ltr" : null, text: l });
          t.addEventListener("click", function () { lang = i; draw(); });
          tabs.appendChild(t);
        });
        body.appendChild(tabs);
        body.appendChild(list);
        body.appendChild(note);
        draw();
      }
    });
    api.quiz({
      id: "case-ruby",
      prompt: "في نسخة Ruby، ما الذي يقوم بعمل الطابور؟",
      choices: [
        { id: "a", text: "مصفوفة: << تضيف في آخرها، و shift تأخذ من أولها.", ok: true },
        { id: "b", text: "صنف Queue جاهز مثل C#.", ok: false },
        { id: "c", text: "الملف students_rb.txt.", ok: false }
      ],
      why: "Ruby في هذا البرنامج لا تستخدم صنف طابور. المصفوفة تعمل طابورًا: الإضافة في الآخر، والأخذ من الأول. أما الملف فللحفظ فقط."
    });
  }

  /* ---------- 3. ثلاثة برامج، نمط واحد ---------- */
  const SYSTEMS = [
    { name: "إدارة الطلاب", c: C.teal, v: ["طالب جديد", "طلاب ينتظرون العلامات", "StudentResult: المعدل والحالة", "آخر التقارير", "students_cs.txt"] },
    { name: "متجر التجزئة", c: C.amber, v: ["منتج وطلب بيع", "طلبات بيع تنتظر المخزون", "ProductSummary: الكمية والقيمة", "آخر عمليات البيع والإرجاع", "retail_products.txt"] },
    { name: "إدارة مكتبة", c: C.sky, v: ["نسخة جديدة وطلب إعارة", "إعارات تنتظر نسخة متاحة", "BookSummary: النسخ المتاحة", "آخر الكتب المعادة", "library_books.txt"] }
  ];
  const SLOTS = [["إدخال", "pen"], ["طابور Queue", "users"], ["سجل struct", "box"], ["مكدس Stack", "layers"], ["ملف", "file"]];

  function patterns(api) {
    api.p("في الملف ثلاثة أنظمة مختلفة: طلاب، ومتجر، ومكتبة. لكن إن نظرت إلى الهيكل لا إلى الأسماء، تجد القالب نفسه في الثلاثة.");
    api.p("هذا تعرّف الأنماط ثم التعميم: تلاحظ ما يتكرر، ثم تبني قالبًا عامًا تملؤه في كل مرة بتفاصيل جديدة.");
    api.example("بطاقة الهوية وجواز السفر ورخصة القيادة: كلها فيها اسم، ورقم، وتاريخ، وصورة. القالب واحد، والمحتوى يختلف.", null, "من حياتك");
    api.lab({
      title: "القالب العام",
      tag: "رسم",
      line: "اختر نظامًا، وراقب القالب نفسه يُملأ بتفاصيل جديدة.",
      build: function (body) {
        const tabs = UI.el("div", { class: "row" });
        const holder = UI.el("div", { class: "motion" });
        const out = UI.el("p", { class: "readout" });
        function draw(k) {
          const sys = SYSTEMS[k];
          let s = "";
          const W = 560, bw = 170, bh = 92;
          const pos = [[370, 20], [190, 20], [10, 20], [10, 160], [190, 160]];
          for (let i = 0; i < 4; i++) {
            const a = pos[i], b = pos[i + 1];
            if (i === 2) s += A.arrow(a[0] + bw / 2, a[1] + bh, b[0] + bw / 2, b[1], sys.c, { anim: true });
            else if (i < 2) s += A.arrow(a[0], a[1] + bh / 2, b[0] + bw, b[1] + bh / 2, sys.c, { anim: true });
            else s += A.arrow(a[0] + bw, a[1] + bh / 2, b[0], b[1] + bh / 2, sys.c, { anim: true });
          }
          SLOTS.forEach(function (slot, i) {
            const p = pos[i];
            s += '<g class="rise" style="animation-delay:' + (i * 0.08) + 's">' + A.box(p[0], p[1], bw, bh, sys.c, { fo: 0.14, sw: 1.8 }) +
              A.text(p[0] + bw / 2, p[1] + 30, slot[0], { size: 15, weight: 700, color: sys.c }) +
              A.text(p[0] + bw / 2, p[1] + 60, sys.v[i], { size: 12, en: /^[A-Za-z]/.test(sys.v[i]) && i === 4 }) + "</g>";
          });
          s += A.text(470, 220, sys.name, { size: 20, weight: 700 });
          s += A.text(470, 245, "القالب نفسه", { size: 13, color: C.mute });
          holder.innerHTML = A.svg(W, 270, s, "قالب عام يتكرر في البرامج الثلاثة");
          tabs.querySelectorAll(".chip").forEach(function (t, i) { t.setAttribute("aria-pressed", i === k ? "true" : "false"); });
          out.textContent = "في " + sys.name + ": الطابور = " + sys.v[1] + "، والمكدس = " + sys.v[3] + ".";
        }
        SYSTEMS.forEach(function (sys, i) {
          const t = UI.el("button", { type: "button", class: "chip", text: sys.name });
          t.addEventListener("click", function () { draw(i); });
          tabs.appendChild(t);
        });
        body.appendChild(tabs);
        body.appendChild(holder);
        body.appendChild(out);
        draw(0);
      }
    });
    api.link("لأن البرامج الثلاثة تشترك في القالب نفسه، فإن المبرمج الذي فهم واحدًا منها يبني الآخرَين أسرع، لذلك يوفّر التعميم الوقت ويقلل الأخطاء.");
    api.quiz({
      id: "case-pattern",
      prompt: "ما النمط المشترك في البرامج الثلاثة؟",
      choices: [
        { id: "a", text: "طابور لما ينتظر، ومكدس لآخر عملية، وسجل للملخص، وملف للحفظ.", ok: true },
        { id: "b", text: "كلها مكتوبة بلغة واحدة فقط.", ok: false },
        { id: "c", text: "كلها لا تحفظ البيانات.", ok: false }
      ],
      why: "الأنظمة الثلاثة تختلف في الأسماء والبيانات، لكنها تشترك في الهيكل: طابور، ومكدس، وسجل، وملف. وكل نظام مكتوب بأكثر من لغة."
    });
  }

  /* ---------- 4. أين يضعف البرنامج؟ ---------- */
  const ISSUES = [
    { line: 20, code: "int.Parse(Console.ReadLine())", f: "المتانة", fe: "Robustness",
      p: "إذا كتب المعلم «ثمانون» بدل 80، يتوقف البرنامج كله.", fix: "استخدام int.TryParse ورسالة تطلب رقمًا صحيحًا." },
    { line: 47, code: "if (c == \"5\") { Save(); break; }", f: "الموثوقية", fe: "Reliability",
      p: "الحفظ يحدث عند الخروج فقط. لو انقطعت الكهرباء ضاعت علامات اليوم كله.", fix: "الحفظ بعد كل إضافة أو تعديل." },
    { line: 12, code: "students[id] = new Student { Name = name };", f: "الموثوقية", fe: "Reliability",
      p: "إدخال رقم طالب مكرر يمحو الطالب القديم وعلاماته دون أي تحذير.", fix: "فحص ContainsKey قبل الإضافة." },
    { line: 4, code: "static Queue<string> markQueue", f: "تلبية متطلبات المستخدم", fe: "User requirements",
      p: "الملف يحفظ الطلاب فقط. بعد إعادة التشغيل يضيع الطابور والتقارير.", fix: "حفظ الطابور والتقارير أيضًا، أو إعادة بنائهما عند التحميل." },
    { line: 17, code: "if (markQueue.Count == 0) return;", f: "المتانة", fe: "Robustness",
      p: "نقطة قوة: البرنامج يفحص الطابور الفارغ قبل الإخراج، فلا ينهار.", fix: "تبقى كما هي، ويُضاف لها رسالة واضحة للمستخدم.", good: true },
    { line: 0, code: "const int PASS_MARK = 50;", f: "قابلية الصيانة", fe: "Maintainability",
      p: "نقطة قوة: لو تغيّر حد النجاح يُعدَّل سطر واحد فقط.", fix: "تبقى كما هي.", good: true }
  ];

  function quality(api) {
    api.p("التحليل لا يكتمل بوصف البنى فقط. اسأل: ماذا يحدث لو أخطأ المستخدم؟ لو انقطعت الكهرباء؟ لو تغيّر حد النجاح؟");
    api.p("كل ملاحظة تربطها بصفة جودة: المتانة، أو الموثوقية، أو قابلية الصيانة، أو تلبية متطلبات المستخدم.");
    api.example("سيارة جميلة لكن مكابحها ضعيفة ليست سيارة جيدة. والبرنامج الذي يعمل حين يُدخل كل شيء صحيحًا فقط ليس برنامجًا جيدًا.", null, "من حياتك");
    api.lab({
      title: "افحص السطر",
      tag: "تقييم",
      line: "اضغط كل سطر لترى ما المشكلة أو نقطة القوة فيه، وأي صفة جودة يمسّ.",
      build: function (body) {
        const list = UI.el("div", { class: "issue-list" });
        const card = UI.el("div", { class: "issue-card", hidden: "" });
        let seen = 0;
        const count = UI.el("p", { class: "readout" });
        function upd() { count.textContent = "فحصت " + seen + " من " + ISSUES.length + " أسطر."; }
        ISSUES.forEach(function (it) {
          const b = UI.el("button", { type: "button", class: "issue-btn" + (it.good ? " good" : "") },
            UI.el("code", { dir: "ltr", text: it.code }));
          b.addEventListener("click", function () {
            list.querySelectorAll(".issue-btn").forEach(function (x) { x.classList.toggle("on", x === b); });
            if (!b.dataset.seen) { b.dataset.seen = "1"; seen++; upd(); }
            card.hidden = false;
            card.className = "issue-card" + (it.good ? " good" : "");
            card.replaceChildren(
              UI.el("p", { class: "issue-tag" }, UI.el("strong", { text: (it.good ? "✓ " : "⚠ ") + it.f }), " ", UI.el("span", { lang: "en", dir: "ltr", text: it.fe })),
              UI.el("p", { text: it.p }),
              UI.el("p", { class: "issue-fix" }, UI.el("strong", { text: it.good ? "التعليق: " : "التحسين: " }), it.fix));
          });
          list.appendChild(b);
        });
        body.appendChild(list);
        body.appendChild(card);
        body.appendChild(count);
        upd();
      }
    });
    api.quiz({
      id: "case-quality",
      prompt: "المعلم كتب «ثمانون» بدل 80 فتوقف البرنامج. أي صفة جودة ضعيفة هنا؟",
      choices: [
        { id: "a", text: "المتانة.", ok: true },
        { id: "b", text: "قابلية النقل.", ok: false },
        { id: "c", text: "الكفاءة.", ok: false }
      ],
      why: "المتانة قدرة البرنامج على معالجة البيانات الخاطئة دون أن ينهار. و int.Parse ينهار مع النص، أما int.TryParse فيرفضه برسالة."
    });
  }

  window.FINAL_CASES = [
    { cov: [], titleAr: "برنامج إدارة الطلاب", titleEn: "Analysing a program: student records", render: students },
    { cov: [], titleAr: "البرنامج نفسه بأربع لغات", titleEn: "The same program in C#, VB.NET, Java and Ruby", render: fourLangs },
    { cov: [], titleAr: "ثلاثة برامج، نمط واحد", titleEn: "Pattern recognition and generalisation across programs", render: patterns },
    { cov: [], titleAr: "أين يضعف البرنامج؟", titleEn: "Evaluating quality in the code", render: quality }
  ];
})();
