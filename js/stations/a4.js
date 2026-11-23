(function () {
  const L = UI.lesson;
  const A = window.ART;
  const C = A.C;

  /* ---------- الهياكل الثلاثة ---------- */
  function flow(api) {
    api.story({ icon: "truck", color: C.teal, who: "متجر إلكتروني أردني", text: "الشحن مجاني إذا تجاوز الطلب 50 دينارًا وكانت المسافة أقل من 26 كيلومترًا. البرنامج يقرأ، ثم يفحص، ثم يكرر ذلك لكل طلب." });
    api.p("التسلسل ينفذ خطوة بعد خطوة. والاختيار يمضي في فرع حسب شرط. والتكرار يعيد العمل حتى يتحقق شرط التوقف. إن غاب الفرع فهو تسلسل، وإن وُجد شرط فهو اختيار، وإن عاد العمل فهو تكرار.");
    api.example("شحن مجاني إن تجاوز الطلب 50 وكانت المسافة أقل من 26. العامل المنطقي AND يطلب الشرطين معًا.");
    api.code("IF order > 50 AND distance < 26 THEN\n    output \"free shipping\"\nEND IF", "A4-SHIP", "text", "شبه كود");
    api.term("sequence", "التسلسل");
    api.term("selection", "الاختيار");
    api.term("iteration", "التكرار");
    api.term("logical-operator", "العامل المنطقي");
    api.hint("A4-H-EQ", "= و ==", "في Visual Basic .NET قد تفحص علامة = التساوي. في C و C++ و C# و PHP و Java يكون الفحص بـ == والتعيين بـ =.");
    api.lab({
      title: "جرّب الشرط",
      line: "حرّك قيمة الطلب والمسافة، وراقب الفرع الذي يسلكه البرنامج.",
      build: function (body) {
        const v = { order: 80, dist: 10 };
        const grid = UI.el("div", { class: "grid2" });
        [["order", "قيمة الطلب", 0, 120], ["dist", "المسافة (كم)", 0, 60]].forEach(function (f) {
          const r = UI.el("input", { type: "range", min: String(f[2]), max: String(f[3]), value: String(v[f[0]]) });
          const o = UI.el("output", { text: String(v[f[0]]) });
          r.addEventListener("input", function () { v[f[0]] = Number(r.value); o.textContent = r.value; draw(); });
          grid.appendChild(UI.el("label", { class: "field" }, UI.el("span", { text: f[1] }), r, o));
        });
        const pic = UI.el("div");
        function draw() {
          const a = v.order > 50, b = v.dist < 26, free = a && b;
          const s = A.box(150, 6, 260, 44, C.sky) + A.text(280, 34, "اقرأ الطلب والمسافة", { size: 15 }) + A.arrow(280, 52, 280, 76, C.sky) +
            '<path d="M280 80 L430 125 L280 170 L130 125 Z" fill="' + C.amber + '" fill-opacity=".12" stroke="' + C.amber + '"/>' +
            A.text(280, 118, "order > 50 AND distance < 26", { en: true, size: 13, cls: "mono" }) +
            A.text(280, 142, (a ? "✓" : "✗") + " " + v.order + " > 50   " + (b ? "✓" : "✗") + " " + v.dist + " < 26", { en: true, size: 12, color: C.mute }) +
            A.arrow(430, 125, 470, 190, free ? C.teal : C.mute, { anim: free }) + A.arrow(130, 125, 90, 190, free ? C.mute : C.rose, { anim: !free }) +
            A.box(400, 192, 150, 48, C.teal, { fo: free ? 0.35 : 0.05, so: free ? 1 : 0.3 }) + A.text(475, 222, "شحن مجاني", { size: 15, opacity: free ? null : 0.45 }) +
            A.box(10, 192, 150, 48, C.rose, { fo: free ? 0.05 : 0.35, so: free ? 0.3 : 1 }) + A.text(85, 222, "شحن مدفوع", { size: 15, opacity: free ? 0.45 : null }) +
            A.text(450, 165, "نعم", { size: 13, color: C.teal }) + A.text(110, 165, "لا", { size: 13, color: C.rose });
          pic.innerHTML = A.svg(560, 250, s, "مخطط شرط الشحن المجاني");
        }
        body.appendChild(grid);
        body.appendChild(pic);
        draw();
      }
    });
    api.order({
      id: "g-a4-flow",
      cov: "A4-FLOW",
      title: "رتّب مسار برنامج الشحن",
      items: ["اقرأ قيمة الطلب", "اقرأ المسافة", "افحص الشرطين معًا", "أظهر نتيجة الشحن"],
      start: [2, 0, 3, 1],
      why: "تسلسل: قراءة ثم قراءة. ثم اختيار: فحص الشرطين. ثم إظهار النتيجة. والتكرار يعيد المسار نفسه لكل طلب."
    });
    api.link("لأن الطلب يجب أن يتجاوز الحد والمسافة يجب أن تبقى داخل المدى، فإن الشرطين يُفحصان معًا، لذلك لا يكفي تحقق واحد.");
    api.quiz({
      id: "a4-flow",
      cov: "A4-FLOW-Q",
      prompt: "طلب 40 ومسافة 10. هل الشحن مجاني؟",
      choices: [
        { id: "a", text: "لا. الطلب لم يتجاوز 50.", ok: true },
        { id: "b", text: "نعم. المسافة وحدها تكفي.", ok: false }
      ],
      why: "الشرطان لازمان. 40 لا تتجاوز 50، فلا تنقذ المسافة الطلب. التسلسل يقرأ القيمتين، والاختيار يفحصهما."
    });
  }

  /* ---------- الوحدات ---------- */
  function units(api) {
    api.story({ icon: "cup", color: C.amber, who: "آلة القهوة في الكافتيريا", text: "تضع النقود وتضغط زرًا، فتخرج القهوة. لا ترى ما يحدث في الداخل، ويمكن لأي شخص أن يستخدمها مرة بعد مرة." });
    api.p("الوحدة كتلة لها اسم وغرض واحد، وغالبًا تكون بين 5 و 50 سطرًا. الدالة تُرجع قيمة، والإجراء يؤدي عملًا. الاسم يختلف بين اللغات، والفكرة واحدة.");
    api.term("subroutine", "الروتين الفرعي");
    api.term("function", "الدالة");
    api.term("procedure", "الإجراء");
    api.code("double CircleArea(double radius) {\n    const double Pi = 3.14159;\n    return Pi * radius * radius;\n}", null, "text", "C#");
    api.lab({
      title: "آلة الدالة",
      line: "أدخل نصف القطر، فتُرجع الدالة المساحة.",
      cov: "A4-SUB",
      build: function (body) {
        const r = UI.el("input", { type: "range", min: "1", max: "10", value: "3" });
        const pic = UI.el("div");
        function draw() {
          const v = Number(r.value);
          const area = (3.14159 * v * v).toFixed(2);
          const s = A.box(180, 40, 200, 120, C.vio, { fo: 0.2 }) + A.text(280, 92, "CircleArea", { en: true, size: 18, weight: 700, cls: "mono" }) +
            A.text(280, 124, "Pi × r × r", { en: true, size: 14, color: C.mute }) + '<g class="pulse">' + A.icon("gear", 256, 128, 48, C.vio) + "</g>" +
            A.box(20, 70, 120, 60, C.teal) + A.text(80, 98, "r = " + v, { en: true, size: 18 }) + A.text(80, 120, "مدخل", { size: 12, color: C.mute }) +
            A.arrow(142, 100, 176, 100, C.teal) + A.arrow(384, 100, 418, 100, C.amber) +
            A.box(420, 70, 130, 60, C.amber, { fo: 0.25 }) + A.text(485, 98, area, { en: true, size: 18 }) + A.text(485, 120, "يُرجع", { size: 12, color: C.mute }) +
            '<circle cx="280" cy="230" r="' + (v * 4) + '" fill="' + C.amber + '" fill-opacity=".2" stroke="' + C.amber + '" style="transition:r .3s"/>';
          pic.innerHTML = A.svg(560, 280, s, "دالة تأخذ نصف القطر وتُرجع المساحة");
        }
        r.addEventListener("input", draw);
        body.appendChild(UI.el("label", { class: "field" }, UI.el("span", { text: "نصف القطر" }), r));
        body.appendChild(pic);
        draw();
      }
    });
    api.link("لأن حساب المساحة غرض واحد، فإن وضعه في دالة يسهّل اختباره، لذلك يُستدعى من أي برنامج يحتاج الدائرة.");
    api.quiz({
      id: "a4-sub",
      cov: "A4-SUB-Q",
      prompt: "ما فائدة حصر المساحة في دالة؟",
      choices: [
        { id: "a", text: "غرض واحد يمكن استدعاؤه وإعادة استخدامه.", ok: true },
        { id: "b", text: "إخفاء الناتج عن كل البرامج.", ok: false }
      ],
      why: "الوحدة تسهّل الكتابة والقراءة والتصحيح، ويمكن لأكثر من شخص أن يعمل على وحدات مختلفة في الوقت نفسه."
    });
  }

  /* ---------- المصفوفات ---------- */
  function arrays(api) {
    api.story({ icon: "sun", color: C.amber, who: "محطة أرصاد في معان", text: "تسجل المحطة درجة الحرارة كل يوم، سبعة أيام في الأسبوع، لثلاثة أسابيع. أين تحفظ 21 قراءة من نوع واحد؟ في مصفوفة." });
    api.p("المصفوفة مواضع مرقمة من نوع واحد، والفهرس يبدأ من صفر. المصفوفة ذات البعدين صفوف وأعمدة: الصف أولًا ثم العمود.");
    api.p("ثلاثة أسابيع في سبعة أعمدة. week[1][4] هي الصف 1 والعمود 4، وتساوي 21.00، أي تقاطع العمود 4 مع الصف 1.", "A4-2D");
    api.term("array", "المصفوفة");
    api.term("index", "الفهرس");
    api.code("double[] days = {12.50, 10.45, 12.30, 14.60, 17.70, 11.20, 12.50};\ndouble seen = days[4];      // 17.70\ndouble cell = week[1][4];   // 21.00", null, "text", "C#");
    api.hint("A4-H-3D", "ثلاثي الأبعاد", "كل محطة لها 21 قراءة، أي 3 أسابيع × 7 أيام. البعد الثالث لخمس محطات يعني خمس شبكات من هذا النوع.");
    api.hint("A4-H-SPLIT", "تقسيم ودمج", "يمكن تقسيم المصفوفة أو دمجها. قص السلسلة ووصلها تطبيق عملي على الصفوف.");
    api.hint("A4-H-CHARRAY", "مصفوفة رموز", "بعض اللغات تمثل السلسلة بمصفوفة رموز ثابتة الطول.");
    api.lab({
      title: "شبكة القراءات",
      line: "اضغط أي خانة لترى عنوانها، أو استخدم الزرين للوصول مباشرة.",
      cov: "A4-1D",
      build: function (body) {
        const week = [
          [12.5, 10.45, 12.3, 14.6, 17.7, 11.2, 12.5],
          [12.22, 11, 10, 20, 21, 14, 15.5],
          [13, 14, 14.5, 14.6, 12.3, 14, 14.6]
        ];
        const grid = UI.el("div", { class: "grid7" });
        const out = UI.el("p", { class: "readout", text: "اضغط خانة." });
        const cells = [];
        grid.appendChild(UI.el("span", { class: "gh" }));
        for (let c = 0; c < 7; c++) grid.appendChild(UI.el("span", { class: "gh", text: "[" + c + "]" }));
        week.forEach(function (row, r) {
          grid.appendChild(UI.el("span", { class: "gh", text: r === 0 ? "days / [0]" : "[" + r + "]" }));
          cells[r] = [];
          row.forEach(function (value, c) {
            const b = UI.el("button", { type: "button", class: "cell", text: value.toFixed(2) });
            b.addEventListener("click", function () { show(r, c); });
            cells[r][c] = b;
            grid.appendChild(b);
          });
        });
        function show(r, c) {
          cells.forEach(function (row, i) { row.forEach(function (b, j) { b.classList.toggle("cross", i === r || j === c); b.classList.toggle("hot", i === r && j === c); }); });
          const v = week[r][c].toFixed(2);
          out.replaceChildren(UI.el("span", { dir: "ltr", style: "font-family:var(--mono)", text: (r === 0 ? "days[" + c + "] = week[0][" + c + "]" : "week[" + r + "][" + c + "]") + " = " + v }), " — الصف " + r + " والعمود " + c + ".");
        }
        const b1 = UI.el("button", { type: "button", class: "chip", dir: "ltr", text: "days[4]" });
        b1.addEventListener("click", function () { show(0, 4); });
        const b2 = UI.el("button", { type: "button", class: "chip", dir: "ltr", text: "week[1][4]" });
        b2.addEventListener("click", function () { show(1, 4); });
        body.appendChild(grid);
        body.appendChild(UI.el("div", { class: "row" }, b1, b2));
        body.appendChild(out);
      }
    });
    api.link("لأن الفهرس يبدأ من صفر، فإن الخانة 4 في الأسبوع الأول هي 17.70، لذلك week[1][4] هي 21.00 لا خانة أخرى.");
    api.quiz({
      id: "a4-arr",
      cov: "A4-ARR-Q",
      prompt: "كم تساوي week[1][4] في هذا الإعلان؟",
      choices: [
        { id: "a", text: "21.00", ok: true },
        { id: "b", text: "12.50", ok: false }
      ],
      why: "ترتيب الفهرس يتبع ترتيب الإعلان: الصف ثم العمود. الصف 1 والعمود 4 يساويان 21.00. أما days[4] في الأسبوع الأول فتساوي 17.70."
    });
  }

  /* ---------- المكدس والطابور ---------- */
  function stackQueue(api) {
    api.story({ icon: "plate", color: C.amber, who: "مطبخ المطعم، ومخبز الحي", text: "في المطبخ تُكدَّس الصحون، فيأخذ العامل الصحن الأعلى دائمًا. وفي المخبز يقف الناس في طابور، ويُخدم من وصل أولًا." });
    api.p("المكدس: آخر داخل أول خارج. والطابور: أول داخل أول خارج. إن لم تلمس إلا الطرف الأخير فهو مكدس، وإن خرج الأقدم فهو طابور.");
    api.example("المكدس أساس في نظام التشغيل وفي الاستدعاء الذاتي. والطابور يدير المهام، مثل طابور الطباعة.");
    api.code("stack.Push(\"A\");\nstack.Push(\"B\");\nstring top = stack.Pop();     // B\nqueue.Enqueue(\"job\");\nstring front = queue.Dequeue();", null, "text", "C#");
    api.term("stack", "المكدس");
    api.term("lifo", "LIFO");
    api.term("push", "الدفع");
    api.term("pop", "السحب");
    api.term("queue", "الطابور");
    api.term("fifo", "FIFO");
    api.term("enqueue", "الإدراج");
    api.term("dequeue", "الإزالة");
    api.term("data-structure", "هيكل البيانات");
    api.hint("A4-H-REC", "الاستدعاء الذاتي", "الخوارزمية التي تستدعي نفسها تستمر حتى تبلغ حالة نهائية، والمكدس يحفظ مواضع العودة. وعمليات المكدس غالبًا تأتي من مكتبة اللغة.");
    const colors = ["#2dd4bf", "#fbbf24", "#a78bfa", "#fb7185", "#38bdf8", "#a3e635"];
    api.lab({
      title: "مكدس الصحون",
      line: "ادفع صحنًا ثم اسحب: الصحن الذي يخرج هو الأحدث دائمًا.",
      cov: "A4-STACK",
      build: function (body) {
        const stack = [];
        let n = 0;
        const col = UI.el("div", { class: "stack-col" });
        const out = UI.el("p", { class: "readout", text: "المكدس فارغ." });
        function draw(anim) {
          col.replaceChildren();
          stack.forEach(function (p, i) {
            const d = UI.el("div", { class: "plate" + (i === stack.length - 1 ? " top" : ""), style: "background:" + p.c + ";width:" + (96 - (p.id % 3) * 4) + "%;margin:0 auto" + (anim || i !== stack.length - 1 ? ";animation:none" : ""), text: "صحن " + UI.ar(p.id) });
            col.appendChild(d);
          });
        }
        const push = UI.el("button", { type: "button", class: "btn", text: "Push ادفع" });
        const pop = UI.el("button", { type: "button", class: "btn ghost", text: "Pop اسحب" });
        push.addEventListener("click", function () {
          if (stack.length >= 6) { out.textContent = "المكدس ممتلئ في هذا المثال."; return; }
          n += 1; stack.push({ id: n, c: colors[n % colors.length] }); draw();
          out.textContent = "دُفع صحن " + UI.ar(n) + " إلى القمة.";
        });
        pop.addEventListener("click", function () {
          if (!stack.length) { out.textContent = "لا يوجد صحن لتسحبه."; return; }
          const topEl = col.lastElementChild;
          const p = stack.pop();
          topEl.classList.add("out");
          out.textContent = "خرج صحن " + UI.ar(p.id) + "، وهو آخر ما دخل.";
          setTimeout(function () { draw(true); }, 380);
        });
        const scene = UI.el("div", { class: "stack-scene" }, col);
        body.appendChild(scene);
        body.appendChild(UI.el("div", { class: "row" }, push, pop));
        body.appendChild(out);
      }
    });
    api.lab({
      title: "طابور المخبز",
      line: "أدرج زبائن ثم أزل: من يخرج هو الأقدم في الطابور.",
      cov: "A4-QUEUE",
      build: function (body) {
        const q = [];
        let n = 0;
        const names = ["سامي", "ليلى", "رامي", "هند", "عمر", "دانة", "يزن"];
        const row = UI.el("div", { class: "queue-row" });
        const out = UI.el("p", { class: "readout", text: "الطابور فارغ." });
        function person(p, front) {
          return UI.el("div", { class: "person-tok" + (front ? " front" : "") }, UI.fromMarkup(A.svg(48, 48, A.icon("user", 0, 0, 48, front ? C.amber : C.sky), p)), UI.el("span", { text: p }));
        }
        function draw() {
          row.replaceChildren();
          q.forEach(function (p, i) { row.appendChild(person(p, i === 0)); });
        }
        const enq = UI.el("button", { type: "button", class: "btn", text: "Enqueue أدرج" });
        const deq = UI.el("button", { type: "button", class: "btn ghost", text: "Dequeue أزل" });
        enq.addEventListener("click", function () {
          if (q.length >= 6) { out.textContent = "الطابور طويل بما يكفي."; return; }
          const p = names[n % names.length]; n += 1; q.push(p); draw();
          out.textContent = p + " وقف في آخر الطابور.";
        });
        deq.addEventListener("click", function () {
          if (!q.length) { out.textContent = "لا أحد في الطابور."; return; }
          row.firstElementChild.classList.add("out");
          const p = q.shift();
          out.textContent = "خُدم " + p + "، لأنه وصل أولًا.";
          setTimeout(draw, 400);
        });
        body.appendChild(UI.el("div", { class: "queue-scene" }, UI.el("div", { class: "scene-label" }, UI.el("span", { text: "المقدمة: يُخدم أولًا" }), UI.el("span", { text: "المؤخرة: يدخل من هنا" })), row));
        body.appendChild(UI.el("div", { class: "row" }, enq, deq));
        body.appendChild(out);
      }
    });
    api.link("لأن السحب يأخذ آخر ما دُفع، فإن القمة هي الأحدث، لذلك لا يُفتح المكدس من الوسط كما تُفتح المصفوفة.");
    api.quiz({
      id: "a4-stack",
      cov: "A4-STACK-Q",
      prompt: "دُفع أ ثم ب. ماذا يخرج عند أول سحب؟",
      choices: [
        { id: "a", text: "ب", ok: true },
        { id: "b", text: "أ", ok: false }
      ],
      why: "المكدس يُخرج الأحدث، والطابور يُخرج الأقدم. والاستدعاء الذاتي يعتمد على المكدس حتى يبلغ الحالة النهائية."
    });
  }

  /* ---------- السلسلة ---------- */
  function strings(api) {
    api.story({ icon: "calc", color: C.sky, who: "تقويم على هاتفك", text: "يعرض التطبيق «Jan» بدل January لأن المساحة ضيقة. لقد أخذ سلسلة فرعية من أول ثلاثة رموز." });
    api.p("السلسلة رموز متتالية، وكل رمز يحتاج بايتًا على الأقل. قد يكون طولها ثابتًا، أو تنتهي بعلامة نهاية تسمح بالمرونة. في Earth الفهرس 2 هو r لأن العد يبدأ من صفر، و Ear سلسلة فرعية.", "A4-STR");
    api.example("طول January هو 7. والفهرس 3 هو u. والاستخراج من 3 بطول 2 يعطي ua. والدمج بـ + يصل January بعبارة has 31 days.");
    api.code("string month = \"January\";\nint length = month.Length;           // 7\nchar mark = month[3];                // u\nstring part = month.Substring(3, 2); // ua\nstring line = month + \" has 31 days\";", null, "text", "C#");
    api.term("string", "السلسلة");
    api.term("character", "الرمز");
    api.term("substring", "السلسلة الفرعية");
    api.term("concatenation", "الدمج");
    api.term("terminator", "رمز النهاية");
    api.lab({
      title: "مقصّ السلاسل",
      line: "اضغط حرفًا لترى فهرسه، وحرّك البداية والطول لتقص سلسلة فرعية.",
      build: function (body) {
        const word = "January";
        let start = 3, len = 2;
        const row = UI.el("div", { class: "bytes" });
        const out = UI.el("p", { class: "readout" });
        const s1 = UI.el("input", { type: "range", min: "0", max: "6", value: "3" });
        const s2 = UI.el("input", { type: "range", min: "1", max: "7", value: "2" });
        function draw(picked) {
          if (start + len > word.length) len = word.length - start;
          s2.value = String(len);
          row.replaceChildren();
          Array.from(word).forEach(function (ch, i) {
            const inPart = i >= start && i < start + len;
            const b = UI.el("button", { type: "button", class: "byte", style: "cursor:pointer;" + (inPart ? "background:rgba(45,212,191,.2);border-color:#2dd4bf" : "") + (picked === i ? ";box-shadow:0 0 0 2px #fbbf24" : "") },
              UI.el("span", { class: "ch", text: ch }), UI.el("span", { class: "hx", text: String(i) }), UI.el("span", { class: "bn", text: "index" }));
            b.addEventListener("click", function () { draw(i); });
            row.appendChild(b);
          });
          const part = word.substr(start, len);
          out.replaceChildren(UI.el("span", { dir: "ltr", style: "font-family:var(--mono)", text: (picked != null ? "month[" + picked + "] = " + word[picked] + "   ·   " : "") + "Substring(" + start + ", " + len + ") = " + part + "   ·   Length = " + word.length }));
        }
        s1.addEventListener("input", function () { start = Number(s1.value); draw(); });
        s2.addEventListener("input", function () { len = Number(s2.value); draw(); });
        body.appendChild(row);
        body.appendChild(UI.el("div", { class: "grid2" }, UI.el("label", { class: "field" }, UI.el("span", { text: "البداية" }), s1), UI.el("label", { class: "field" }, UI.el("span", { text: "الطول" }), s2)));
        body.appendChild(out);
        draw();
      }
    });
    api.quiz({
      id: "a4-str", cov: "A4-STR-Q",
      prompt: "ما الرمز في الفهرس 3 من January؟",
      choices: [
        { id: "a", text: "u", ok: true },
        { id: "b", text: "J", ok: false }
      ],
      why: "J عند صفر، و a عند 1، و n عند 2، و u عند 3. والاستخراج من هناك بطول 2 يعطي ua."
    });
  }

  /* ---------- الكتابة القوية ---------- */
  function strong(api) {
    api.story({ icon: "money", color: C.amber, who: "تطبيق مصروف شخصي", text: "أدخل مالك 10.9 دنانير. في لغة حفظ البرنامج القيمة 10 فقط، وضاع 90 قرشًا دون أي تحذير." });
    api.p("Java قوية: العدد الصحيح لا يقبل نصًا أو كسرًا إلا بتحويل صريح، وإلا ظهر خطأ. و C أضعف في التحويل: قد تتحول القيمة ضمنيًا، وهذا مريح لكنه قد يفاجئك، فيُقتطع الكسر ويختل حساب المال.", "A4-STRONG");
    api.term("strongly-typed", "كتابة قوية");
    api.term("weakly-typed", "كتابة ضعيفة");
    api.lab({
      title: "ضع الكسر في عدد صحيح",
      line: "اكتب مبلغًا بكسر، وراقب كيف تتصرف كل لغة.",
      build: function (body) {
        const input = UI.el("input", { type: "number", step: "0.1", value: "10.9" });
        const pic = UI.el("div");
        function draw() {
          const v = Number(input.value) || 0;
          const whole = Number.isInteger(v);
          const s = A.box(10, 10, 260, 200, C.teal, { fo: 0.06 }) + A.text(140, 40, "Java: كتابة قوية", { size: 15, color: C.teal, weight: 700 }) +
            A.text(140, 80, "int amount = " + v + ";", { en: true, size: 14, cls: "mono" }) +
            (whole ? A.icon("check", 116, 105, 48, C.teal) + A.text(140, 185, "مقبول: عدد صحيح", { size: 14 }) : A.icon("cross", 116, 105, 48, C.rose) + A.text(140, 185, "خطأ: يلزم تحويل صريح", { size: 14, color: C.rose })) +
            A.box(290, 10, 260, 200, C.amber, { fo: 0.06 }) + A.text(420, 40, "C: تحويل ضمني", { size: 15, color: C.amber, weight: 700 }) +
            A.text(420, 80, "int amount = " + v + ";", { en: true, size: 14, cls: "mono" }) +
            A.text(420, 140, "amount = " + Math.trunc(v), { en: true, size: 22, color: whole ? C.ink : C.rose, weight: 700 }) +
            A.text(420, 185, whole ? "لا شيء ضاع" : "ضاع " + (v - Math.trunc(v)).toFixed(2) + " بصمت", { size: 14, color: whole ? C.mute : C.rose });
          pic.innerHTML = A.svg(560, 220, s, "مقارنة الكتابة القوية والتحويل الضمني");
        }
        input.addEventListener("input", draw);
        body.appendChild(UI.el("label", { class: "field" }, UI.el("span", { text: "المبلغ" }), input));
        body.appendChild(pic);
        draw();
      }
    });
    api.quiz({
      id: "a4-strong", cov: "A4-STRONG-Q",
      prompt: "ما خطر اقتطاع الكسر في تطبيق مال؟",
      choices: [
        { id: "a", text: "المبلغ يفقد جزءه العشري فيختل الحساب.", ok: true },
        { id: "b", text: "اللغة تتوقف عن حفظ الأسماء.", ok: false }
      ],
      why: "الكتابة القوية تمنع الخلط الصامت. والتحويل الضمني قد يحوّل 10.9 إلى 10، وفي المال هذا خطأ كبير."
    });
  }

  /* ---------- الملفات ---------- */
  function files(api) {
    api.story({ icon: "folder", color: C.amber, who: "سجل الحضور اليومي", text: "يفتح البرنامج ملف الحضور كل صباح ويقرأ الأسماء سطرًا بسطر. في يوم حُذف الملف خطأ، فلم ينهَر البرنامج، بل ظهرت رسالة واضحة." });
    api.p("يُفتح الملف للقراءة أو للكتابة ثم يُغلق. في C تفتح الدالة fopen وتغلق fclose. تقرأ النص سطرًا بسطر بحلقة while، وإن غاب الملف فمعالجة الاستثناء تمنع الانهيار.", "A4-FILE");
    api.code("try {\n    string[] lines = File.ReadAllLines(path);\n    foreach (string line in lines) Console.WriteLine(line);\n} catch (FileNotFoundException) {\n    Console.WriteLine(\"file not found\");\n}", null, "text", "C#");
    api.term("exception-handling", "معالجة الاستثناء");
    api.hint("A4-H-FOPEN", "fopen و fclose", "في C تفتح fopen وتغلق fclose. الإغلاق بعد الانتهاء يمنع بقاء الملف محجوزًا.");
    api.lab({
      title: "افتح، اقرأ، اكتب، أغلق",
      line: "جرّب الترتيب الصحيح، ثم احذف الملف وجرّب القراءة.",
      build: function (body) {
        let exists = true, open = false;
        const lines = ["سامي", "ليلى", "رامي"];
        const log = UI.el("ol", { class: "ledger" });
        const pic = UI.el("div");
        function say(t, bad) { log.insertBefore(UI.el("li", { style: bad ? "border-color:#fb7185" : "", text: t }), log.firstChild); while (log.children.length > 5) log.removeChild(log.lastChild); draw(); }
        function draw() {
          const c = !exists ? C.rose : open ? C.teal : C.mute;
          pic.innerHTML = A.svg(560, 130, (exists ? A.icon("file", 230, 10, 100, c) : A.icon("cross", 240, 20, 80, C.rose)) +
            A.text(430, 60, !exists ? "الملف مفقود" : open ? "الملف مفتوح" : "الملف مغلق", { size: 16, color: c }) +
            A.text(430, 90, exists ? UI.ar(lines.length) + " أسطر" : "", { size: 13, color: C.mute }), "حالة الملف");
        }
        const bOpen = UI.el("button", { type: "button", class: "chip", text: "open افتح" });
        const bRead = UI.el("button", { type: "button", class: "chip", text: "read اقرأ" });
        const bWrite = UI.el("button", { type: "button", class: "chip", text: "write اكتب" });
        const bClose = UI.el("button", { type: "button", class: "chip", text: "close أغلق" });
        const bDel = UI.el("button", { type: "button", class: "chip bad", text: "احذف الملف" });
        bOpen.addEventListener("click", function () {
          if (!exists) { say("catch: file not found — رسالة واضحة، والبرنامج ما زال يعمل.", true); return; }
          open = true; say("فُتح الملف.");
        });
        bRead.addEventListener("click", function () {
          if (!exists) { say("catch: file not found — لا انهيار.", true); return; }
          if (!open) { say("افتح الملف أولًا.", true); return; }
          say("قراءة سطرًا بسطر: " + lines.join("، "));
        });
        bWrite.addEventListener("click", function () {
          if (!exists || !open) { say("افتح الملف أولًا.", true); return; }
          lines.push("طالب " + UI.ar(lines.length + 1)); say("كُتب سطر جديد.");
        });
        bClose.addEventListener("click", function () { open = false; say("أُغلق الملف، ولم يعد محجوزًا."); });
        bDel.addEventListener("click", function () { exists = false; open = false; say("حُذف الملف."); });
        body.appendChild(pic);
        body.appendChild(UI.el("div", { class: "row" }, bOpen, bRead, bWrite, bClose, bDel));
        body.appendChild(log);
        draw();
      }
    });
    api.quiz({
      id: "a4-file", cov: "A4-FILE-Q",
      prompt: "ماذا يمنع التقاط غياب الملف؟",
      choices: [
        { id: "a", text: "انهيار البرنامج.", ok: true },
        { id: "b", text: "حاجة البرنامج إلى اسم.", ok: false }
      ],
      why: "الفتح للقراءة أو الكتابة، ثم الإغلاق. والاستثناء مسار بديل عند الفشل بدل التوقف المفاجئ."
    });
  }

  /* ---------- قاعدة البيانات ---------- */
  function database(api) {
    api.story({ icon: "db", color: C.sky, who: "نظام مدرسة كبيرة", text: "ألفا طالب، ولكل طالب صف ومعلمون ودرجات. لو حُفظ ذلك في ملف نصي واحد لصار البحث بطيئًا ومربكًا." });
    api.p("C# و PHP و Ruby تتصل بقاعدة بيانات علائقية مثل MySQL أو Microsoft SQL حين لا يكفي ملف نصي. القاعدة تخزن جداول مترابطة وتجيب عن أسئلة SQL.", "A4-DB");
    api.code("SELECT first, last FROM Student WHERE enrolled = 1;", null, "text", "SQL");
    api.term("sql", "SQL");
    api.term("relational-database", "قاعدة علائقية");
    api.term("mysql", "MySQL");
    api.lab({
      title: "نفّذ الاستعلام",
      line: "اضغط «نفّذ» لترى الصفوف التي يطابقها الشرط enrolled = 1.",
      build: function (body) {
        const rows = [["2001", "Mayla", "Preston", 1], ["2002", "Omar", "Haddad", 0], ["2003", "Lina", "Saleh", 1], ["2004", "Yazan", "Nasser", 0]];
        const table = UI.el("table", { class: "truth" });
        let ran = false;
        function draw() {
          table.replaceChildren();
          const head = UI.el("tr");
          ["id", "first", "last", "enrolled"].forEach(function (h) { head.appendChild(UI.el("th", { text: h })); });
          table.appendChild(head);
          rows.forEach(function (r) {
            const tr = UI.el("tr", { class: ran && r[3] === 1 ? "now" : "", style: ran && r[3] !== 1 ? "opacity:.3" : "" });
            r.forEach(function (v) { tr.appendChild(UI.el("td", { text: String(v) })); });
            table.appendChild(tr);
          });
        }
        const run = UI.el("button", { type: "button", class: "btn", text: "▶ نفّذ" });
        const out = UI.el("p", { class: "readout", text: "الجدول Student كاملًا." });
        run.addEventListener("click", function () { ran = true; draw(); out.textContent = "النتيجة صفّان: Mayla Preston و Lina Saleh."; });
        body.appendChild(table);
        body.appendChild(UI.el("div", { class: "row" }, run));
        body.appendChild(out);
        draw();
      }
    });
    api.quiz({
      id: "a4-db", cov: "A4-DB-Q",
      prompt: "متى تُفضَّل القاعدة على ملف نصي قصير؟",
      choices: [
        { id: "a", text: "حين تترابط الجداول ويكثر البحث.", ok: true },
        { id: "b", text: "حين يكون المطلوب سطرًا واحدًا بلا علاقات.", ok: false }
      ],
      why: "القاعدة العلائقية تخزن جداول مترابطة وتجيب عن أسئلة SQL. والملف يكفي للنص البسيط."
    });
  }

  UI.register({
    id: "a4",
    badge: "A4",
    tone: "coral",
    short: "البنى والتقنيات",
    shortEn: "Constructs",
    titleAr: "البنى والتقنيات وتطبيقها في اللغات",
    titleEn: "Constructs and techniques and their implementation in different languages",
    blurb: "البيانات والتحكم والوحدات والملفات.",
    screens: [
      L({
        cov: ["A4-INTRO", "A4-INTRO-Q"],
        titleAr: "لبنات مشتركة بين اللغات",
        titleEn: "Programming languages, constructs and techniques",
        story: { icon: "car", color: C.sky, who: "رخصة القيادة", text: "إن تعلّمت القيادة على سيارة، تستطيع قيادة أخرى من نوع مختلف. المقود والفرامل في كل السيارات، وإن اختلف شكلها." },
        lines: [{ text: "البنى لبنات، والتقنيات طرق استخدامها. كثير منها مشترك بين اللغات، فتنتقل معرفتك من لغة إلى أخرى. الأمثلة الأطول هنا بلغة C#، ويمكنك نقل الفكرة إلى غيرها.", cov: "A4-INTRO" }],
        art: function (api) {
          api.art(A.codeWin([
            { t: "C#:      if (age >= 18) { ... }", c: C.teal },
            { t: "Python:  if age >= 18:", c: C.amber },
            { t: "VB.NET:  If age >= 18 Then", c: C.vio },
            { t: "" },
            { t: "C#:      for (int i = 0; i < 3; i++)", c: C.teal },
            { t: "Python:  for i in range(3):", c: C.amber },
            { t: "VB.NET:  For i = 0 To 2", c: C.vio }
          ], { title: "same idea, different words", label: "الاختيار والتكرار في ثلاث لغات" }), "الاختيار والتكرار نفسهما في ثلاث لغات");
        },
        quiz: {
          id: "a4-intro", cov: "A4-INTRO-Q",
          prompt: "لماذا يفيدك تعلّم البنية أكثر من حفظ اسم لغة واحدة؟",
          choices: [
            { id: "a", text: "لأن الفكرة تتكرر في لغات كثيرة.", ok: true },
            { id: "b", text: "لأن كل لغة تخترع بنى لا تشبه غيرها.", ok: false }
          ],
          why: "المتغير والاختيار والتكرار والوحدة تظهر في لغات كثيرة. تغيّر الأسماء لا يغيّر الدور."
        }
      }),
      L({
        cov: ["A4-KEY", "A4-KEY-Q"],
        titleAr: "الكلمات المحجوزة",
        titleEn: "Command words (reserved keywords)",
        story: { icon: "taxi", color: C.amber, who: "لافتة «تاكسي»", text: "لا تستطيع أن تكتب «تاكسي» على سيارتك الخاصة. الكلمة محجوزة لنوع معين. وفي اللغة كلمات محجوزة للأوامر، مثل if و while." },
        lines: [{ text: "الكلمة المحجوزة أمر للغة، مثل فتح ملف أو إظهار نص، ولا تصلح اسمًا لمتغير. يختلف عدد الكلمات وغرضها بين اللغات، والخبرة تكشف أن المفاهيم تتكرر وإن تغيّر اللفظ.", cov: "A4-KEY" }],
        terms: [["reserved-keyword", "الكلمة المحجوزة"]],
        game: {
          kind: "bins", id: "g-a4-key",
          title: "كلمة محجوزة أم اسم تختاره أنت؟",
          bins: [{ id: "kw", label: "كلمة محجوزة" }, { id: "name", label: "اسم مسموح" }],
          items: [{ text: "if", bin: "kw" }, { text: "while", bin: "kw" }, { text: "return", bin: "kw" }, { text: "class", bin: "kw" }, { text: "totalPrice", bin: "name" }, { text: "userAge", bin: "name" }],
          why: "if و while و return و class أوامر محجوزة في كثير من اللغات. أما totalPrice و userAge فأسماء يختارها المبرمج."
        },
        quiz: {
          id: "a4-key", cov: "A4-KEY-Q",
          prompt: "لماذا يُرفض استخدام if اسمًا لمتغير في كثير من اللغات؟",
          choices: [
            { id: "a", text: "لأنها كلمة أمر محجوزة.", ok: true },
            { id: "b", text: "لأن الأسماء يجب أن تكون أرقامًا.", ok: false }
          ],
          why: "المحجوز للأوامر لا للتسمية. القائمة تختلف من لغة إلى أخرى، والفكرة واحدة."
        }
      }),
      L({
        cov: ["A4-NAME", "A4-NAME-Q"],
        titleAr: "الأسماء والنطاق",
        titleEn: "Constants and variables, local and global variables",
        lines: [
          { text: "المعرّف اسم لقيمة في الذاكرة. الاسم الواضح مثل username أفضل من اختصار غامض. camelCase يبدأ صغيرًا ثم يكبّر أول كل كلمة بعده: userAge. و snake_case كلمات صغيرة تصلها شرطة سفلية: user_age.", cov: "A4-NAME" },
          "يُرفض الاسم المحجوز، والاسم الذي فيه فراغ، والاسم الذي يبدأ برقم. المتغير العالمي ظاهر في البرنامج كله، والمحلي محصور في كتلته، مثل الدالة."
        ],
        terms: [["identifier", "المعرّف"], ["scope", "النطاق"], ["camel-case", "camelCase"], ["snake-case", "snake_case"], ["global-variable", "متغير عالمي"], ["local-variable", "متغير محلي"]],
        art: function (api) {
          const s = A.box(10, 10, 540, 250, C.sky, { fo: 0.05 }) + A.text(530, 40, "البرنامج كله", { anchor: "right", size: 15, color: C.sky }) +
            A.text(30, 40, "taxRate = 0.16", { anchor: "left", en: true, size: 14, cls: "mono", color: C.sky }) + A.text(530, 66, "متغير عالمي: يُرى في كل مكان", { anchor: "right", size: 13, color: C.mute }) +
            A.box(40, 90, 230, 150, C.amber, { fo: 0.08 }) + A.text(155, 116, "CalcTax()", { en: true, size: 14, cls: "mono", color: C.amber }) + A.text(155, 150, "price", { en: true, size: 14, cls: "mono" }) + A.text(155, 180, "متغير محلي", { size: 13, color: C.mute }) + A.text(155, 220, "يرى taxRate ✓", { size: 13, color: C.teal }) +
            A.box(290, 90, 230, 150, C.vio, { fo: 0.08 }) + A.text(405, 116, "PrintBill()", { en: true, size: 14, cls: "mono", color: C.vio }) + A.text(405, 150, "يرى taxRate ✓", { size: 13, color: C.teal }) + A.text(405, 185, "لا يرى price ✗", { size: 13, color: C.rose });
          api.art(A.svg(560, 270, s, "النطاق العالمي والمحلي"), "المحلي يبقى داخل كتلته، والعالمي يُرى في كل مكان");
          api.bins({
            id: "g-a4-name",
            title: "اسم مقبول أم مرفوض؟",
            bins: [{ id: "ok", label: "مقبول" }, { id: "no", label: "مرفوض" }],
            items: [{ text: "userAge", bin: "ok" }, { text: "user_age", bin: "ok" }, { text: "2user", bin: "no" }, { text: "user age", bin: "no" }, { text: "while", bin: "no" }, { text: "totalPrice", bin: "ok" }],
            why: "userAge و totalPrice بصيغة camelCase، و user_age بصيغة snake_case. أما 2user فيبدأ برقم، و user age فيه فراغ، و while كلمة محجوزة."
          });
        },
        quiz: {
          id: "a4-name", cov: "A4-NAME-Q",
          prompt: "أي اسم مقبول لمتغير العمر؟",
          choices: [
            { id: "a", text: "userAge", ok: true },
            { id: "b", text: "2user age", ok: false }
          ],
          why: "userAge يتبع camelCase. و 2user age يبدأ برقم وفيه فراغ. و user_age صيغة أخرى مقبولة. والنطاق يحدد أين يُرى الاسم."
        }
      }),
      L({
        cov: ["A4-TYPE", "A4-TYPE-Q"],
        titleAr: "أنواع البيانات",
        titleEn: "Data types: character, string, integer, real, Boolean",
        story: { icon: "box", color: C.lime, who: "علب المطبخ", text: "علبة للسكر، وأخرى للملح، وثالثة للأرز. لا تضع الأرز في علبة الملح الصغيرة. وكذلك لكل قيمة نوع يناسبها." },
        lines: [{ text: "النوع يحدد القيمة والعمليات المسموحة: رمز واحد، أو سلسلة، أو عدد صحيح، أو عدد حقيقي بكسر، أو قيمة منطقية صواب أو خطأ. والقيمة المنطقية منسوبة إلى جورج بول. في Visual Basic .NET تُعلن بـ Dim، وفي C القديمة قد لا يوجد نوع منطقي فيُستخدم عدد.", cov: "A4-TYPE" }],
        codes: [{ code: "char initial;     // 'L'\nstring username;  // \"Lina\"\nint age;          // 17\ndouble price;     // 2.75\nbool valid;       // true", label: "C#" }],
        terms: [["data-type", "نوع البيانات"], ["character", "رمز"], ["string", "سلسلة"], ["integer", "عدد صحيح"], ["float", "عدد بكسر"], ["boolean", "قيمة منطقية"]],
        game: {
          kind: "bins", id: "g-a4-type",
          title: "ضع كل قيمة في نوعها",
          bins: [{ id: "char", label: "Character" }, { id: "str", label: "String" }, { id: "int", label: "Integer" }, { id: "real", label: "Real" }, { id: "bool", label: "Boolean" }],
          items: [{ text: "'L'", bin: "char" }, { text: "\"Lina\"", bin: "str" }, { text: "17", bin: "int" }, { text: "2.75", bin: "real" }, { text: "true", bin: "bool" }, { text: "\"0790000000\"", bin: "str" }],
          why: "'L' رمز واحد، و\"Lina\" سلسلة، و 17 عدد صحيح، و 2.75 عدد حقيقي، و true قيمة منطقية. ورقم الهاتف سلسلة لأنك لا تجري عليه حسابًا، ويبدأ بصفر."
        },
        quiz: {
          id: "a4-type", cov: "A4-TYPE-Q",
          prompt: "أي نوع يناسب سعرًا فيه كسور؟",
          choices: [
            { id: "a", text: "عدد حقيقي بكسر، مثل double.", ok: true },
            { id: "b", text: "قيمة منطقية.", ok: false }
          ],
          why: "الصحيح بلا كسر، والسلسلة للنص، والمنطقية لصواب أو خطأ. السعر يحتاج نوعًا يقبل الكسر، مع الحذر من تقريب المال."
        }
      }),
      { cov: ["A4-STRONG", "A4-STRONG-Q"], titleAr: "الكتابة القوية والضعيفة", titleEn: "Strongly and weakly typed languages", render: strong },
      L({
        cov: ["A4-IO", "A4-IO-Q", "A4-H-SEMI"],
        titleAr: "التعيين والإدخال والإخراج",
        titleEn: "Statements: assignment, input and output",
        lines: [{ text: "التعيين يخزن قيمة. والإدخال يأتي من لوحة المفاتيح أو من ملف. والإخراج يذهب إلى الشاشة أو إلى ملف أو طابعة. اللغات الثلاث في الأمثلة حساسة لحالة الأحرف: الأمر المكتوب بحرف كبير خطأ إن كانت اللغة تنتظر حرفًا صغيرًا.", cov: "A4-IO" }],
        codes: [
          { code: "userAge = 17\nuserName = gets\nputs \"Hello\"", label: "Ruby" },
          { code: "userAge = 17;\ncin >> userName;\ncout << \"Hello\";", label: "C++" },
          { code: "userAge = 17;\nuserName = Console.ReadLine();\nConsole.WriteLine(\"Hello\");", label: "C#" }
        ],
        terms: [["assignment", "التعيين"], ["input", "الإدخال"], ["output", "الإخراج"], ["case-sensitive", "حساس لحالة الأحرف"]],
        hints: [{ cov: "A4-H-SEMI", label: "الفاصلة المنقوطة", text: "بعض اللغات تنهي الجملة بفاصلة منقوطة، وبعضها لا يحتاجها. أما الحساسية لحالة الأحرف فمشتركة في الأمثلة الثلاثة." }],
        art: A.flow([
          { icon: "terminal", label: "إدخال", sub: "ReadLine", subEn: true, c: C.teal },
          { icon: "box", label: "تعيين", sub: "userName = …", subEn: true, c: C.amber },
          { icon: "window", label: "إخراج", sub: "WriteLine", subEn: true, c: C.vio }
        ], { label: "إدخال ثم تعيين ثم إخراج" }),
        caption: "القيمة تدخل، وتُخزَّن في اسم، ثم تخرج",
        quiz: {
          id: "a4-io", cov: "A4-IO-Q",
          prompt: "ماذا يحدث إن كتبت Puts بدل puts في Ruby؟",
          choices: [
            { id: "a", text: "خطأ، لأن اللغة تفرّق بين الحرف الكبير والصغير.", ok: true },
            { id: "b", text: "لا شيء، فحالة الأحرف لا تُقرأ.", ok: false }
          ],
          why: "الأمثلة الثلاثة حساسة لحالة الأحرف. الفاصلة المنقوطة ليست قاعدة في كل لغة. التعيين يخزن، والإدخال يقرأ، والإخراج يعرض."
        }
      }),
      { cov: ["A4-FLOW", "A4-SHIP", "A4-FLOW-Q", "A4-H-EQ"], titleAr: "التسلسل والاختيار والتكرار", titleEn: "Statements: sequence, selection, iteration; logical operations", render: flow },
      { cov: ["A4-SUB", "A4-SUB-Q"], titleAr: "الوحدات: الدوال والإجراءات", titleEn: "Subroutines, functions and procedures", render: units },
      L({
        cov: ["A4-LIB", "A4-LIB-Q"],
        titleAr: "المكتبات",
        titleEn: "Library functions",
        story: { icon: "book", color: C.vio, who: "مكتبة المدرسة", text: "لا تكتب قاموسًا جديدًا كلما احتجت معنى كلمة. تأخذه من الرف. والمبرمج كذلك: يأخذ الدوال الجاهزة من مكتبة اللغة." },
        lines: [{ text: "المكتبة دوال جاهزة لمهام شائعة: تنسيق، وطول سلسلة، ومربع عدد. ومكتبة طرف ثالث موثوق تضيف قدرة لا تأتي مع اللغة، أما المصدر غير الموثوق فمخاطرة.", cov: "A4-LIB" }],
        codes: [{ code: "int n = name.Length;          // طول السلسلة\ndouble sq = Math.Pow(5, 2);   // 25\nstring s = price.ToString(\"F2\");", label: "C#" }],
        art: A.tiles([
          { icon: "book", label: "Length", sub: "طول السلسلة", c: C.teal },
          { icon: "calc", label: "Math.Pow", sub: "مربع عدد", c: C.amber },
          { icon: "tag", label: "ToString", sub: "تنسيق", c: C.vio },
          { icon: "box", label: "طرف ثالث", sub: "موثوق فقط", c: C.rose }
        ], { cols: 2, th: 112, label: "رف المكتبة" }),
        caption: "دوال جاهزة على الرف، لا تعيد كتابتها من الصفر",
        quiz: {
          id: "a4-lib", cov: "A4-LIB-Q",
          prompt: "بأي شيء يُحسب طول السلسلة عادة؟",
          choices: [
            { id: "a", text: "بدالة من المكتبة.", ok: true },
            { id: "b", text: "بإعادة كتابة المعالج.", ok: false }
          ],
          why: "المهام الشائعة موجودة في المكتبة حتى لا تُكتب من الصفر. والطرف الثالث يوسّع اللغة إن كان مصدره موثوقًا."
        }
      }),
      { cov: ["A4-STR", "A4-STR-Q"], titleAr: "معالجة السلاسل", titleEn: "String handling: single characters and substrings", render: strings },
      { cov: ["A4-ARR", "A4-1D", "A4-2D", "A4-ARR-Q", "A4-H-3D", "A4-H-SPLIT", "A4-H-CHARRAY"], titleAr: "المصفوفات", titleEn: "Arrays: two-dimensional and three-dimensional", render: arrays },
      { cov: ["A4-STACK", "A4-QUEUE", "A4-STACK-Q", "A4-H-REC"], titleAr: "المكدس والطابور", titleEn: "Data structures: stack and queue", render: stackQueue },
      L({
        cov: ["A4-STRUCT", "A4-STRUCT-Q"],
        titleAr: "السجل",
        titleEn: "Data structures: records",
        story: { icon: "user", color: C.teal, who: "بطاقة الطالب", text: "على بطاقة مايلا: رقمها، واسمها، ولقبها، وعمرها، وهل هي مسجّلة. خمسة حقول بأنواع مختلفة، تحت اسم واحد." },
        lines: [{ text: "السجل يجمع حقولًا من أنواع مختلفة تحت اسم واحد، والمصفوفة لا تفعل ذلك. ومصفوفة من هذا السجل تحفظ أكثر من طالب، ويمكن أن تكون أساس جدول أو ملف ثنائي.", cov: "A4-STRUCT" }],
        codes: [{ code: "struct Student {\n    int id;          // 2001\n    string first;    // Mayla\n    string last;     // Preston\n    int age;         // 21\n    bool enrolled;   // true\n};", label: "C#" }],
        terms: [["record", "السجل"], ["structure", "الهيكل"]],
        art: function (api) {
          const fields = [["id", "2001", "Integer", C.teal], ["first", "Mayla", "String", C.amber], ["last", "Preston", "String", C.amber], ["age", "21", "Integer", C.teal], ["enrolled", "true", "Boolean", C.vio]];
          let s = A.box(60, 10, 440, 300, C.sky, { fo: 0.07 }) + A.icon("user", 80, 26, 56, C.sky) + A.text(480, 56, "Student", { en: true, size: 20, anchor: "right", weight: 700, color: C.sky });
          fields.forEach(function (f, i) {
            const y = 100 + i * 40;
            s += '<g class="rise" style="animation-delay:' + (i * 0.08) + 's">' + A.box(80, y - 22, 400, 32, f[3], { r: 8 }) +
              A.text(100, y, f[0], { anchor: "left", en: true, size: 14, cls: "mono" }) + A.text(280, y, f[1], { en: true, size: 14 }) +
              A.text(460, y, f[2], { anchor: "right", en: true, size: 13, color: f[3] }) + "</g>";
          });
          api.art(A.svg(560, 320, s, "سجل طالب بخمسة حقول"), "خمسة حقول، ثلاثة أنواع، واسم واحد");
        },
        quiz: {
          id: "a4-struct", cov: "A4-STRUCT-Q",
          prompt: "لماذا لا تكفي مصفوفة أعداد لبيانات مايلا؟",
          choices: [
            { id: "a", text: "لأن الاسم سلسلة، والعمر عدد، والتسجيل قيمة منطقية.", ok: true },
            { id: "b", text: "لأن السجل لا يقبل إلا نوعًا واحدًا.", ok: false }
          ],
          why: "2001 والعمر عددان، والاسم واللقب سلسلتان، والتسجيل قيمة منطقية. هذا سجل، ومصفوفة السجلات تحفظ عدة طلاب."
        }
      }),
      { cov: ["A4-FILE", "A4-FILE-Q", "A4-H-FOPEN"], titleAr: "التعامل مع الملفات", titleEn: "File handling: open, read, write, close", render: files },
      { cov: ["A4-DB", "A4-DB-Q"], titleAr: "قاعدة البيانات", titleEn: "File handling: database", render: database },
      L({
        cov: ["A4-EVT", "A4-EVT-Q"],
        titleAr: "معالجة الأحداث والواجهات",
        titleEn: "Event handling",
        story: { icon: "clock", color: C.amber, who: "ساعة على شاشة الحاسوب", text: "كل ثانية تعلن الساعة: «مرّت ثانية». الشاشة مشتركة في هذا الإعلان، فتحدّث الرقم في الزاوية العليا اليسرى." },
        lines: [{ text: "الحدث يأتي من المستخدم أو من النظام، مثل ضغط زر أو رسالة عند تغيير دقة الشاشة. في مثال الساعة: الناشر يحدد الحدث والمفوّض، والمشترك يُبلَّغ ويقدّم المعالج. الواجهة الرسومية نوافذ وأيقونات ومؤشر، وسطر الأوامر نص وأوامر.", cov: "A4-EVT" }],
        terms: [["gui", "واجهة رسومية"], ["cli", "سطر الأوامر"], ["publisher-subscriber", "الناشر والمشترك"], ["delegate", "المفوّض"]],
        art: function (api) {
          api.art(A.flow([
            { icon: "clock", label: "الناشر", sub: "Tick", subEn: true, c: C.amber },
            { icon: "mail", label: "المفوّض", sub: "delegate", subEn: true, c: C.vio },
            { icon: "window", label: "المشترك", sub: "يعرض الوقت", c: C.teal }
          ], { label: "الناشر يعلن والمشترك يستجيب" }), "الناشر يعلن الحدث، والمشترك يقدّم المعالج");
          api.shot("gui-login", "شاهد الرسم: نافذة دخول رسومية");
          api.shot("cli-clock", "شاهد الرسم: ساعة في سطر الأوامر");
        },
        quiz: {
          id: "a4-evt", cov: "A4-EVT-Q",
          prompt: "من يقدّم معالج حدث الساعة؟",
          choices: [
            { id: "a", text: "المشترك، بعد أن يبلّغه الناشر.", ok: true },
            { id: "b", text: "ملف النص المغلق.", ok: false }
          ],
          why: "الناشر يملك الحدث والمفوّض. والمشترك يتلقى النداء ويعرض الساعة. والواجهة الرسومية وسطر الأوامر طريقان لعرض السلوك نفسه."
        }
      }),
      L({
        cov: ["A4-DOC", "A4-DOC-Q", "A4-H-HTMLDOC"],
        titleAr: "توثيق الكود",
        titleEn: "Documentation of code",
        story: { icon: "file", color: C.teal, who: "زميل يكمل مشروعك", text: "سافرت، فأكمل زميلك برنامجك. وجد الرقم 0.16 في عشرة أماكن بلا شرح. لو كتبت ثابتًا اسمه TaxRate وتعليقًا واحدًا لوفّرت عليه يومًا." },
        lines: [{ text: "التوثيق للقراءة والفهم والتصحيح والصيانة، خصوصًا إن أكمل شخص آخر العمل. الاسم يشرح الغرض، وتعليق السطر يشرح سطرًا، والتعليق الأطول يقدّم دالة أو إجراءً أو فئة، والثابت يحل محل قيمة تتكرر.", cov: "A4-DOC" }],
        terms: [["documentation", "التوثيق"], ["comment", "التعليق"]],
        hints: [{ cov: "A4-H-HTMLDOC", label: "وثائق من التعليقات", text: "بعض الأدوات تولّد صفحات من التعليقات. ومعايير التسمية المنشورة، ومنها توثيق Microsoft، تنصح بأسماء بلا اختصار غامض." }],
        art: function (api) {
          api.art(A.codeWin([
            { t: "const double TaxRate = 0.16; // this year's rate", hl: C.teal },
            { t: "" },
            { t: "/* Calculates the bill total", c: "#7f8db8" },
            { t: "   from price and quantity. */", c: "#7f8db8" },
            { t: "double BillTotal(double price, int qty) {" },
            { t: "    return price * qty * (1 + TaxRate);", hl: C.amber },
            { t: "}" }
          ], { title: "documented code", label: "كود موثّق بثابت وتعليقات" }), "ثابت مسمّى، وتعليق للسطر، وتعليق يقدّم الدالة");
        },
        quiz: {
          id: "a4-doc", cov: "A4-DOC-Q",
          prompt: "لماذا يُستبدل الرقم المتكرر بثابت مسمّى؟",
          choices: [
            { id: "a", text: "ليتغير من مكان واحد ويبقى معناه واضحًا.", ok: true },
            { id: "b", text: "ليصعب على القارئ معرفة الغرض.", ok: false }
          ],
          why: "التعليق يشرح ما لا يقوله الاسم. والثابت يلغي تكرار القيمة الغامضة. والتوثيق يساعد من يصون البرنامج لاحقًا."
        }
      })
    ]
  });
})();
