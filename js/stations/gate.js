(function () {
  const A = window.ART;
  const C = A.C;

  function pipeline(api) {
    api.story({
      icon: "route", color: C.amber, who: "قبل فتح محرر الكود",
      text: "التطبيق الذي يُستخدم كل يوم بدأ بشخص رتّب الفكرة، ثم كتبها بلغة، ثم حوّلها الحاسوب إلى أصفار وواحدات."
    });
    api.p("أربع محطات مترابطة. اضغط البطاقة أو مرّر المؤشر عليها ليظهر التعريف ومثال قصير.", "GATE-PIPE");
    const steps = [
      { icon: "user", c: C.teal, ar: "المبرمج", en: "Programmer", term: "programmer",
        def: "يحلل المشكلة، ويصمم حلًا منطقيًا، ثم يكتب التعليمات.",
        ex: "يقرر ماذا يظهر في تطبيق الدرجات، ومن أين يأتي الرقم، وماذا يحدث عند الخطأ." },
      { icon: "layers", c: C.amber, ar: "البرنامج", en: "Program", term: "program",
        def: "تعليمات وأوامر مرتبة ينفذها الحاسوب لمهمة واحدة.",
        ex: "اقرأ الرقم، قارنه بحد النجاح، ثم أظهر «ناجح» أو «راسب»." },
      { icon: "code", c: C.vio, ar: "لغة البرمجة", en: "Programming language", term: "programming-language",
        def: "لغة وسيطة بقواعد بناء يفهمها الإنسان، ويمكن ترجمتها للحاسوب.",
        ex: "الأمر نفسه يُكتب في C# بطريقة وفي Python بطريقة، والفكرة واحدة." },
      { icon: "chip", c: C.rose, ar: "المترجم والمفسر", en: "Compiler / Interpreter", term: "compiler",
        def: "يحوّل الكود إلى لغة الآلة: أصفار وواحدات يفهمها المعالج.",
        ex: "المترجم الكلي يحوّل البرنامج كله قبل التشغيل. المفسر ينفذ السطر فور قراءته." }
    ];
    const row = api.el("div", { class: "pipe", "data-cov": "GATE-PIPE" });
    const note = api.el("p", { class: "readout", text: "اختر محطة من الرحلة." });
    steps.forEach(function (step, index) {
      const card = api.el("button", { type: "button", class: "pipe-card", "aria-expanded": "false" });
      card.appendChild(api.el("span", { class: "pipe-n", dir: "ltr", text: String(index + 1) }));
      card.appendChild(api.el("span", { class: "pipe-ico", html: A.badge(step.icon, step.c) }));
      card.appendChild(api.el("strong", { text: step.ar }));
      card.appendChild(api.el("span", { class: "pipe-en", lang: "en", dir: "ltr", text: step.en }));
      const more = api.el("span", { class: "pipe-more" });
      more.appendChild(api.el("span", { text: step.def }));
      more.appendChild(api.el("span", { class: "pipe-ex", text: step.ex }));
      card.appendChild(more);
      card.addEventListener("click", function () {
        const open = card.classList.toggle("open");
        card.setAttribute("aria-expanded", open ? "true" : "false");
        row.querySelectorAll(".pipe-card").forEach(function (other) {
          if (other !== card) { other.classList.remove("open"); other.setAttribute("aria-expanded", "false"); }
        });
        note.textContent = open ? step.ar + ": " + step.def : "اختر محطة من الرحلة.";
      });
      row.appendChild(card);
    });
    api.add(row);
    api.add(note);
    api.term("programmer", "المبرمج");
    api.term("program", "البرنامج");
    api.term("programming-language", "لغة البرمجة");
    api.term("syntax", "البناء");
    api.term("compiler", "المترجم");
    api.term("interpreter", "المفسر");
    api.link("لأن الإنسان يكتب بلغة يفهمها، فإن وسيطًا يحوّلها إلى لغة الآلة، لذلك يصل الأمر إلى المعالج.");
  }

  function languages(api) {
    api.p("ست لغات تكفي للانطلاق. صفِّ البطاقات، ثم اضغط البطاقة لترى أين تُستخدم.", "GATE-LANG");
    const items = [
      { id: "python", cat: "ai", ar: "تحليل وذكاء", en: "Python", term: "python", use: "الأكثر شيوعًا للمبتدئ. تُستخدم في الذكاء الاصطناعي، وتحليل البيانات، والأتمتة." },
      { id: "javascript", cat: "web", ar: "الويب", en: "JavaScript", term: "javascript", use: "لغة الويب الأولى. تبني الصفحات والتطبيقات التي تستجيب للنقر." },
      { id: "dart", cat: "phone", ar: "الهواتف", en: "Dart", term: "dart", use: "مع إطار Flutter تبني تطبيق أندرويد وآي أو إس من كود واحد." },
      { id: "csharp", cat: "game", ar: "ألعاب وأنظمة", en: "C#", term: "csharp", use: "قوية في ألعاب Unity، وتطبيقات سطح المكتب، والأنظمة في المؤسسات." },
      { id: "sql", cat: "data", ar: "البيانات", en: "SQL", term: "sql", use: "لغة السؤال عن قواعد البيانات: ماذا نريد، ومن أي جدول، وبأي شرط." },
      { id: "java", cat: "scale", ar: "أنظمة ضخمة", en: "Java", term: "java", use: "تُستخدم حيث يكثر المستخدمون، مثل الويب وأندرويد والأنظمة الكبيرة." },
      { id: "erlang", cat: "scale", ar: "ضغط عالٍ", en: "Erlang", term: "erlang", use: "تدير ملايين الاتصالات معًا، وتعزل الخطأ حتى لا يسقط النظام كله." }
    ];
    const filters = [
      ["all", "الكل"],
      ["ai", "ذكاء"],
      ["web", "ويب"],
      ["phone", "هواتف"],
      ["game", "ألعاب"],
      ["data", "بيانات"],
      ["scale", "أنظمة ضخمة"]
    ];
    const bar = api.el("div", { class: "lang-filters", "data-cov": "GATE-LANG" });
    const grid = api.el("div", { class: "lang-grid" });
    let current = "all";
    function paint() {
      grid.querySelectorAll(".lang-card").forEach(function (card) {
        card.hidden = current !== "all" && card.dataset.cat !== current;
      });
    }
    filters.forEach(function (pair) {
      const button = api.el("button", { type: "button", class: "btn" + (pair[0] === "all" ? " on" : ""), text: pair[1], "aria-pressed": pair[0] === "all" ? "true" : "false" });
      button.addEventListener("click", function () {
        current = pair[0];
        bar.querySelectorAll("button").forEach(function (b) {
          const on = b === button;
          b.classList.toggle("on", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        paint();
      });
      bar.appendChild(button);
    });
    items.forEach(function (item) {
      const card = api.el("button", { type: "button", class: "lang-card", "data-cat": item.cat, "aria-expanded": "false" });
      card.appendChild(api.el("strong", { class: "en", lang: "en", dir: "ltr", text: item.en }));
      card.appendChild(api.el("span", { text: item.ar }));
      card.appendChild(api.el("span", { class: "lang-use", text: item.use }));
      card.addEventListener("click", function () {
        const open = card.classList.toggle("open");
        card.setAttribute("aria-expanded", open ? "true" : "false");
      });
      grid.appendChild(card);
    });
    api.add(bar);
    api.add(grid);
    items.forEach(function (item) { api.term(item.term, item.en); });
    api.link("لأن كل لغة صُممت لنوع من المسائل، فإن اختيار اللغة يتبع المهمة، لذلك لا توجد لغة واحدة لكل التطبيقات.");
  }

  UI.register({
    id: "gate",
    badge: "0",
    tone: "violet",
    short: "بوابة الانطلاق",
    shortEn: "Launch gate",
    titleAr: "بوابة الانطلاق: من الفكرة إلى التطبيقات الذكية",
    titleEn: "From an idea to smart applications",
    blurb: "استرجاع المبرمج والبرنامج واللغة والمترجم.",
    screens: [
      { cov: ["GATE-PIPE"], titleAr: "رحلة الكود", titleEn: "The code journey", render: pipeline },
      { cov: ["GATE-LANG"], titleAr: "لغات تُستخدم كل يوم", titleEn: "Languages in daily use", render: languages },
      UI.lesson({
        cov: ["GATE-Q1"],
        titleAr: "من يكتب، وبأي لغة، ومن يترجم؟",
        titleEn: "Programmer, language, and translator",
        lines: ["سؤال واحد يربط المحطات الأربع."],
        quiz: {
          id: "gate-q1",
          cov: "GATE-Q1",
          prompt: "ما المسار الصحيح حتى يفهم المعالج الأمر؟",
          choices: [
            { id: "a", text: "المبرمج يكتب بلغة برمجة، ثم يحوّلها المترجم أو المفسر إلى لغة الآلة.", ok: true },
            { id: "b", text: "المعالج يكتب اللغة، والمبرمج يترجمها إلى كلمات بشرية.", ok: false }
          ],
          why: "المبرمج يصمم الحل ويكتبه بقواعد اللغة. المترجم يحوّل البرنامج كله قبل التشغيل، والمفسر ينفذ السطر عند قراءته. الناتج في الحالتين تعليمات يفهمها المعالج."
        }
      })
    ]
  });
})();
