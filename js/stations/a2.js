(function () {
  const L = UI.lesson;
  const A = window.ART;
  const C = A.C;

  function effects(pos, neg, label) {
    return A.duo(
      { icon: "heart", title: "أثر إيجابي", c: C.teal, lines: pos },
      { icon: "warn", title: "أثر سلبي", c: C.rose, lines: neg },
      { mid: "⚖", label: label || "الآثار الإيجابية والسلبية", h: 300 }
    );
  }

  const CATS = [
    { id: "game", label: "الألعاب" },
    { id: "ent", label: "الترفيه" },
    { id: "prod", label: "الإنتاجية" },
    { id: "store", label: "تخزين المعلومات" },
    { id: "risk", label: "المهام الخطرة أو المكررة" },
    { id: "soc", label: "التواصل الاجتماعي" },
    { id: "search", label: "محركات البحث" }
  ];
  const APPS = [
    { name: "Minecraft", icon: "game", cat: "game" },
    { name: "Kindle", icon: "book", cat: "ent" },
    { name: "Excel", icon: "chart", cat: "prod" },
    { name: "Google Drive", icon: "cloud", cat: "store" },
    { name: "مراقبة منجم", icon: "pick", cat: "risk" },
    { name: "WhatsApp", icon: "chat", cat: "soc" },
    { name: "محرك بحث", icon: "search", cat: "search" },
    { name: "معالج نصوص", icon: "file", cat: "prod" },
    { name: "مشغّل موسيقى", icon: "music", cat: "ent" },
    { name: "نماذج عمل", icon: "window", cat: "prod" }
  ];

  function ten(api) {
    api.story({
      icon: "phone", color: C.amber, who: "شاشة هاتفك الآن",
      text: "افتح هاتفك وعدّ التطبيقات: لعبة، وقارئ كتب، ومحادثات، وتخزين صور. كل واحد منها بُني ليحل مشكلة محددة، وله أثر إيجابي وآخر سلبي."
    });
    api.p("اختر تطبيقًا، ثم حدّد فئته، واكتب المشكلة التي يحلها وأثرًا إيجابيًا وأثرًا سلبيًا. كرّر ذلك حتى عشرة تطبيقات.");
    api.lab({
      title: "عشرة تطبيقات",
      line: "اختر تطبيقًا، وصنّفه، واكتب أثرين. جملة الربط تُكتب لك تلقائيًا.",
      cov: "A2-TEN",
      build: function (body) {
        let saved = [];
        try { saved = UI.recall("ten") || []; } catch (err) { saved = []; }
        let pick = null;
        let cat = null;
        const grid = UI.el("div", { class: "apps" });
        const catRow = UI.el("div", { class: "row" });
        const verdict = UI.el("p", { class: "readout", hidden: true });
        const problem = UI.el("input", { type: "text", placeholder: "المشكلة التي يحلها" });
        const up = UI.el("input", { type: "text", placeholder: "أثر إيجابي" });
        const down = UI.el("input", { type: "text", placeholder: "أثر سلبي" });
        const add = UI.el("button", { type: "button", class: "btn", text: "أضف إلى الدفتر" });
        const count = UI.el("p", { class: "game-line" });
        const ledger = UI.el("ol", { class: "ledger" });
        const link = UI.el("p", { class: "linkline", hidden: true });
        const clear = UI.el("button", { type: "button", class: "btn ghost small", text: "امسح الدفتر" });

        function drawApps() {
          grid.replaceChildren();
          APPS.forEach(function (app) {
            const done = saved.some(function (s) { return s.name === app.name; });
            const b = UI.el("button", { type: "button", class: "app" + (done ? " done" : ""), "aria-pressed": pick === app ? "true" : "false" });
            b.appendChild(UI.fromMarkup(A.svg(48, 48, A.icon(app.icon, 0, 0, 48, done ? C.teal : C.amber), app.name)));
            b.appendChild(UI.el("span", { dir: "auto", text: app.name }));
            b.addEventListener("click", function () { pick = app; cat = null; verdict.hidden = true; drawApps(); drawCats(); });
            grid.appendChild(b);
          });
        }
        function drawCats() {
          catRow.replaceChildren();
          CATS.forEach(function (c) {
            const b = UI.el("button", { type: "button", class: "chip", "aria-pressed": cat === c.id ? "true" : "false", text: c.label });
            b.addEventListener("click", function () {
              if (!pick) { verdict.hidden = false; verdict.className = "readout bad"; verdict.textContent = "اختر تطبيقًا أولًا."; return; }
              cat = c.id;
              const ok = pick.cat === c.id;
              verdict.hidden = false;
              verdict.className = "readout" + (ok ? "" : " bad");
              verdict.textContent = ok ? "إجابتك صحيحة: " + pick.name + " من فئة " + c.label + "." : "ليس تمامًا، فكّر مرة أخرى";
              drawCats();
            });
            catRow.appendChild(b);
          });
        }
        function drawLedger() {
          ledger.replaceChildren();
          saved.forEach(function (s) { ledger.appendChild(UI.el("li", { text: s.name + " — " + s.cat + " — " + s.problem })); });
          count.textContent = "في الدفتر " + UI.ar(saved.length) + " من 10.";
          const last = saved[saved.length - 1];
          link.hidden = !last;
          if (last) link.textContent = "لأن " + last.name + " يحل مشكلة " + last.problem + "، فإن فئته " + last.cat + "، لذلك أثره الإيجابي " + last.up + " وأثره السلبي " + last.down + ".";
        }
        add.addEventListener("click", function () {
          verdict.hidden = false;
          if (saved.length >= 10) { verdict.className = "readout bad"; verdict.textContent = "الدفتر ممتلئ بعشرة تطبيقات."; return; }
          if (!pick || !cat || !problem.value.trim() || !up.value.trim() || !down.value.trim()) {
            verdict.className = "readout bad";
            verdict.textContent = "اختر التطبيق والفئة، واكتب المشكلة والأثرين.";
            return;
          }
          const label = CATS.filter(function (c) { return c.id === cat; })[0].label;
          saved = saved.filter(function (s) { return s.name !== pick.name; });
          saved.push({ name: pick.name, cat: label, problem: problem.value.trim(), up: up.value.trim(), down: down.value.trim() });
          UI.store("ten", saved);
          problem.value = up.value = down.value = "";
          verdict.className = "readout";
          verdict.textContent = "أُضيف " + pick.name + " إلى الدفتر.";
          pick = null; cat = null;
          drawApps(); drawCats(); drawLedger();
        });
        clear.addEventListener("click", function () { saved = []; UI.store("ten", saved); drawApps(); drawLedger(); });

        body.appendChild(UI.el("p", { class: "zone-label", text: "1. اختر تطبيقًا" }));
        body.appendChild(grid);
        body.appendChild(UI.el("p", { class: "zone-label", text: "2. اختر فئته" }));
        body.appendChild(catRow);
        body.appendChild(verdict);
        body.appendChild(UI.el("p", { class: "zone-label", text: "3. اكتب المشكلة والأثرين" }));
        body.appendChild(problem);
        body.appendChild(UI.el("div", { class: "grid2" }, up, down));
        body.appendChild(UI.el("div", { class: "row" }, add, clear));
        body.appendChild(count);
        body.appendChild(ledger);
        body.appendChild(link);
        drawApps(); drawCats(); drawLedger();
      }
    });
    api.quiz({
      id: "a2-ten",
      cov: "A2-TEN-Q",
      prompt: "ما الذي يجب أن يصحب اسم التطبيق؟",
      choices: [
        { id: "a", text: "الفئة، والمشكلة، وأثر إيجابي، وأثر سلبي.", ok: true },
        { id: "b", text: "عدد التنزيلات فقط.", ok: false }
      ],
      why: "التصنيف المفيد يذكر الفئة والمشكلة والأثرين. جملة الربط تجمع هذه الأربعة في نتيجة واحدة."
    });
  }

  UI.register({
    id: "a2",
    badge: "A2",
    tone: "amber",
    short: "الاستخدامات",
    shortEn: "Uses of software",
    titleAr: "استخدامات التطبيقات البرمجية",
    titleEn: "Uses of software applications",
    blurb: "تصنيف التطبيق، والمشكلة التي يحلها، وأثره.",
    screens: [
      L({
        cov: ["A2-CLASS", "A2-CLASS-Q", "A2-H-FREE", "A2-H-COMMERCIAL", "A2-H-OTHERLIC"],
        titleAr: "التصنيف بالترخيص",
        titleEn: "Classifying applications by licence",
        story: { icon: "store", color: C.amber, who: "متجر التطبيقات على هاتف لين", text: "تطبيق بجانبه زر «تثبيت» مجانًا، وآخر بجانبه سعر 2.99 دينار. الفرق هنا في حق الاستخدام وثمنه، لا في المهمة." },
        lines: [
          { text: "التطبيق يُبنى لمهمة ومشكلة وحاجة. أما الترخيص فيصف حق الاستخدام: مجاني، أو تجاري، أو ترخيص آخر.", cov: "A2-CLASS" }
        ],
        hints: [
          { cov: "A2-H-FREE", label: "مجاني", text: "ترخيص يتيح الاستخدام بلا ثمن شراء." },
          { cov: "A2-H-COMMERCIAL", label: "تجاري", text: "ترخيص تدفع مقابله كلفة." },
          { cov: "A2-H-OTHERLIC", label: "ترخيص آخر", text: "قد يكون الترخيص تعليميًا أو مفتوح المصدر أو محدود المدة." }
        ],
        art: A.tiles([
          { icon: "tag", label: "مجاني", sub: "Free", subEn: true, c: C.teal },
          { icon: "money", label: "تجاري", sub: "Commercial", subEn: true, c: C.amber },
          { icon: "key", label: "ترخيص آخر", sub: "Other licence", subEn: true, c: C.vio }
        ], { cols: 3, th: 120, label: "ثلاثة أنواع من الترخيص" }),
        caption: "الترخيص يجيب عن سؤال: بأي حق وبأي ثمن؟",
        quiz: {
          id: "a2-class", cov: "A2-CLASS-Q",
          prompt: "أي تصنيف ينظر إلى المهمة لا إلى ثمن البرنامج؟",
          choices: [
            { id: "a", text: "التصنيف بنوع الاستخدام.", ok: true },
            { id: "b", text: "التصنيف بالترخيص فقط.", ok: false }
          ],
          why: "الترخيص يصف الثمن وحق الاستخدام. المنصة تصف الجهاز. الاستخدام يصف المهمة والأثر."
        }
      }),
      L({
        cov: ["A2-PLAT", "A2-PLAT-Q", "A2-H-DESK", "A2-H-MOBILE", "A2-H-OTHERPLAT"],
        titleAr: "التصنيف بالمنصة",
        titleEn: "Classifying applications by platform",
        story: { icon: "laptop", color: C.sky, who: "مختبر الحاسوب ثم الطريق إلى البيت", text: "تكتب تقريرك على حاسوب المختبر، ثم تكمله على هاتفك في الحافلة. المهمة نفسها، والجهاز مختلف." },
        lines: [{ text: "المنصة هي الجهاز الذي يعمل عليه التطبيق: حاسوب مكتب، أو جهاز محمول، أو منصة أخرى.", cov: "A2-PLAT" }],
        hints: [
          { cov: "A2-H-DESK", label: "مكتبي", text: "يعمل على حاسوب مكتب." },
          { cov: "A2-H-MOBILE", label: "محمول", text: "يعمل على هاتف أو جهاز لوحي." },
          { cov: "A2-H-OTHERPLAT", label: "منصة أخرى", text: "قد يعمل على خادم أو جهاز مخصص." }
        ],
        art: A.tiles([
          { icon: "laptop", label: "مكتب", sub: "Desktop", subEn: true, c: C.sky },
          { icon: "phone", label: "محمول", sub: "Mobile", subEn: true, c: C.teal },
          { icon: "server", label: "منصة أخرى", sub: "Server, device", subEn: true, c: C.vio }
        ], { cols: 3, th: 120, label: "ثلاث منصات" }),
        caption: "المنصة تجيب عن سؤال: على أي جهاز؟",
        quiz: {
          id: "a2-plat", cov: "A2-PLAT-Q",
          prompt: "تطبيق يعمل على الهاتف. أي تصنيف هذا؟",
          choices: [
            { id: "a", text: "منصة محمولة.", ok: true },
            { id: "b", text: "ترخيص تجاري حتمًا.", ok: false }
          ],
          why: "المنصة تصف الجهاز، والهاتف منصة محمولة. الترخيص شأن آخر، فقد يكون التطبيق المحمول مجانيًا أو تجاريًا."
        }
      }),
      L({
        cov: ["A2-GAME", "A2-GAME-Q", "A2-H-COD", "A2-H-MASS", "A2-H-AC", "A2-H-BEJ", "A2-H-GAME-HEALTH", "A2-H-GAME-ADDICT"],
        titleAr: "الألعاب",
        titleEn: "Gaming and entertainment: gaming",
        story: { icon: "game", color: C.vio, who: "بعد امتحان الرياضيات", text: "يلعب كريم Minecraft نصف ساعة ليرتاح. في العطلة صار يلعب ست ساعات متصلة، ولم يعد يخرج مع أصدقائه." },
        lines: [{ text: "ألعاب الحاسوب للترفيه، أو التعليم، أو التعافي بعد صدمة. مثال: Minecraft. أثرها الإيجابي الاسترخاء، والسلبي العزلة الاجتماعية.", cov: "A2-GAME" }],
        hints: [
          { cov: "A2-H-COD", label: "Call of Duty", text: "مثال من Activision على ألعاب التنافس." },
          { cov: "A2-H-MASS", label: "Mass Effect", text: "مثال من BioWare على ألعاب القصة." },
          { cov: "A2-H-AC", label: "Assassin's Creed", text: "مثال من Ubisoft على ألعاب العالم المفتوح." },
          { cov: "A2-H-BEJ", label: "Bejeweled", text: "مثال من PopCap على الألغاز القصيرة." },
          { cov: "A2-H-GAME-HEALTH", label: "النشاط البدني", text: "أثر محتمل: قلة الحركة تؤثر في الصحة." },
          { cov: "A2-H-GAME-ADDICT", label: "الإدمان", text: "أثر محتمل: صعوبة التوقف عن اللعب." }
        ],
        art: effects(["استرخاء", "تعلّم بالتجربة", "تعافٍ بعد صدمة"], ["عزلة اجتماعية", "قلة الحركة", "صعوبة التوقف"], "آثار الألعاب"),
        caption: "التطبيق نفسه له وجهان، والفرق في طريقة الاستخدام",
        quiz: {
          id: "a2-game", cov: "A2-GAME-Q",
          prompt: "أي أثر سلبي ذُكر للألعاب؟",
          choices: [
            { id: "a", text: "العزلة الاجتماعية.", ok: true },
            { id: "b", text: "انخفاض كلفة المصنع.", ok: false }
          ],
          why: "العزلة أثر سلبي، والاسترخاء أثر إيجابي. الصحة البدنية والإدمان تفصيلان إضافيان في التلميح."
        }
      }),
      L({
        cov: ["A2-ENT", "A2-ENT-Q", "A2-H-ITUNES", "A2-H-WMP"],
        titleAr: "الترفيه",
        titleEn: "Gaming and entertainment: entertainment",
        story: { icon: "music", color: C.sky, who: "في سيارة الأجرة إلى الزرقاء", text: "تسمع سلمى أغانيها بالبث، وتقرأ رواية على Kindle. لا تلعب، بل تستهلك محتوى جاهزًا متى شاءت." },
        lines: [{ text: "ترفيه الموسيقى والفيديو والكتب يصل بالتنزيل أو البث أو الاثنين. مثال: Kindle. أثره الإيجابي استهلاك مرن عند الطلب، والسلبي عزلة محتملة.", cov: "A2-ENT" }],
        hints: [
          { cov: "A2-H-ITUNES", label: "iTunes", text: "مثال من Apple لشراء الموسيقى والوسائط." },
          { cov: "A2-H-WMP", label: "Media Player", text: "مثال من Microsoft لتشغيل الوسائط." }
        ],
        art: A.duo(
          { icon: "music", title: "الترفيه", c: C.sky, lines: ["محتوى جاهز", "موسيقى وفيديو وكتب", "تنزيل أو بث"] },
          { icon: "game", title: "الألعاب", c: C.vio, lines: ["لعب تفاعلي", "قواعد ونتيجة", "اللاعب يقرر"] },
          { mid: "≠", label: "الترفيه والألعاب فئتان منفصلتان" }
        ),
        caption: "فئتان قريبتان، لكن كل واحدة مستقلة",
        quiz: {
          id: "a2-ent", cov: "A2-ENT-Q",
          prompt: "ما الذي يفصل الترفيه عن الألعاب هنا؟",
          choices: [
            { id: "a", text: "الترفيه موسيقى وفيديو وكتب، والألعاب لعب تفاعلي.", ok: true },
            { id: "b", text: "الفئتان اسم واحد.", ok: false }
          ],
          why: "الفئتان منفصلتان. الترفيه يوزّع محتوى جاهزًا. الألعاب تفاعل له قواعد ونتيجة."
        }
      }),
      L({
        cov: ["A2-PROD", "A2-PROD-Q", "A2-H-OO", "A2-H-ADOBE", "A2-H-GDRIVE", "A2-H-PROD-SKILL", "A2-H-PROD-IDEA", "A2-H-PROD-COST"],
        titleAr: "الإنتاجية",
        titleEn: "Productivity",
        story: { icon: "chart", color: C.teal, who: "مكتب صغير في الشميساني", text: "كانت السكرتيرة تجمع فواتير الشهر بالآلة الحاسبة في يومين. بجدول بيانات صار العمل ساعة واحدة." },
        lines: [{ text: "أدوات العمل الإداري: جداول بيانات، وقواعد بيانات، ونصوص، وعروض. مثال: Microsoft Office. أثرها الإيجابي إنتاج أعلى وكفاءة أكبر.", cov: "A2-PROD" }],
        hints: [
          { cov: "A2-H-OO", label: "OpenOffice", text: "حزمة مكتبية من Apache." },
          { cov: "A2-H-ADOBE", label: "Adobe Creative Suite", text: "أدوات تصميم وإنتاج وسائط." },
          { cov: "A2-H-GDRIVE", label: "Google Drive", text: "تطبيقات عمل عبر المتصفح." },
          { cov: "A2-H-PROD-SKILL", label: "مهارات جديدة", text: "أثر: تعلّم طرق عمل لم تكن مستخدمة." },
          { cov: "A2-H-PROD-IDEA", label: "أفكار", text: "أثر: أساليب جديدة لحل المشكلات." },
          { cov: "A2-H-PROD-COST", label: "كلفة أقل", text: "أثر: إنجاز العمل بكلفة تشغيل أقل." }
        ],
        art: A.tiles([
          { icon: "chart", label: "جداول بيانات", c: C.teal },
          { icon: "db", label: "قواعد بيانات", c: C.sky },
          { icon: "file", label: "معالجة نصوص", c: C.amber },
          { icon: "window", label: "عروض تقديمية", c: C.vio },
          { icon: "bolt", label: "إنتاج أعلى", c: C.lime },
          { icon: "target", label: "كفاءة أكبر", c: C.rose }
        ], { cols: 3, th: 104, label: "أدوات الإنتاجية وآثارها" }),
        caption: "أربع أدوات في الصف الأول، وأثران في الصف الثاني",
        quiz: {
          id: "a2-prod", cov: "A2-PROD-Q",
          prompt: "جدول الحسابات من أي فئة؟",
          choices: [
            { id: "a", text: "الإنتاجية.", ok: true },
            { id: "b", text: "الألعاب.", ok: false }
          ],
          why: "جداول البيانات والنصوص والعروض أدوات إنتاجية. أثرها رفع الإنتاج والكفاءة، مع مهارات وأفكار جديدة وكلفة أقل."
        }
      }),
      L({
        cov: ["A2-STORE", "A2-STORE-Q", "A2-H-DROP", "A2-H-ICLOUD", "A2-H-STORE-DUP"],
        titleAr: "تخزين المعلومات وإدارتها",
        titleEn: "Information storage and management",
        story: { icon: "cloud", color: C.sky, who: "هاتف سقط في الماء", text: "سقط هاتف ريم في الماء. حزنت، ثم تذكرت أن صورها محفوظة في Google Drive، ففتحتها من حاسوب البيت." },
        lines: [{ text: "تطبيقات التخزين تحفظ البيانات بأمان وتسترجعها بسرعة، وغالبًا عبر الشبكة. مثال: Google Drive. أثرها الإيجابي خطر فقدان أقل، ووصول مرن من أكثر من جهاز.", cov: "A2-STORE" }],
        hints: [
          { cov: "A2-H-DROP", label: "Dropbox", text: "مثال على حفظ الملفات ومزامنتها." },
          { cov: "A2-H-ICLOUD", label: "iCloud", text: "مثال من Apple على التخزين السحابي." },
          { cov: "A2-H-STORE-DUP", label: "تكرار البيانات", text: "أثر: النسخ المتعدد قد يكرر الملف نفسه في أكثر من موضع." }
        ],
        art: function (api) {
          const s = '<g class="pulse">' + A.icon("cloud", 220, 10, 120, C.sky) + '</g>' + A.text(280, 140, "نسخة واحدة على الشبكة", { size: 14, color: C.mute }) +
            A.icon("phone", 40, 190, 80, C.teal) + A.icon("laptop", 240, 200, 80, C.amber) + A.icon("server", 440, 190, 80, C.vio) +
            A.arrow(260, 110, 100, 190, C.teal) + A.arrow(280, 150, 280, 198, C.amber) + A.arrow(300, 110, 460, 190, C.vio) +
            A.text(80, 295, "الهاتف", { size: 14 }) + A.text(280, 295, "حاسوب البيت", { size: 14 }) + A.text(480, 295, "حاسوب المدرسة", { size: 14 });
          api.art(A.svg(560, 310, s, "الملف محفوظ على الشبكة ويصل إليه أكثر من جهاز"), "فقدان أقل، ووصول من أي جهاز");
        },
        quiz: {
          id: "a2-store", cov: "A2-STORE-Q",
          prompt: "ما الأثر الإيجابي الأوضح للتخزين السحابي؟",
          choices: [
            { id: "a", text: "انخفاض خطر فقدان الملفات.", ok: true },
            { id: "b", text: "إلغاء الحاجة إلى أي تصنيف.", ok: false }
          ],
          why: "التخزين يحفظ ويسترجع. فقدان أقل ووصول مرن أثران إيجابيان. أما تكرار الملف في أكثر من موضع فأثر يجب الانتباه له."
        }
      }),
      L({
        cov: ["A2-RISK", "A2-RISK-Q", "A2-H-ENERGY", "A2-H-MINE", "A2-H-CAR", "A2-H-RISK-SAT", "A2-H-RISK-SKILL", "A2-H-RISK-COST"],
        titleAr: "المهام الخطرة أو المكررة",
        titleEn: "Repetitive tasks or dangerous tasks",
        story: { icon: "factory", color: C.rose, who: "مصنع كيماويات قرب العقبة", text: "كان العامل يخلط المواد بيده ويتنفس أبخرتها. الآن يراقب شاشة من غرفة التحكم، والبرنامج يدير الخلط." },
        lines: [{ text: "البرمجيات تؤتمت البيئة الخطرة أو العمل اليدوي الرتيب. مثال: المعالجة الكيميائية. أثرها الإيجابي خطر جسدي أقل وإنتاج أعلى.", cov: "A2-RISK" }],
        hints: [
          { cov: "A2-H-ENERGY", label: "قطاع الطاقة", text: "مثال على أتمتة منشآت الطاقة." },
          { cov: "A2-H-MINE", label: "شاحنات التعدين", text: "مثال: شاحنات تسير دون سائق داخل المنجم." },
          { cov: "A2-H-CAR", label: "تصنيع السيارات", text: "مثال: خطوط إنتاج تؤتمت المهام المتكررة." },
          { cov: "A2-H-RISK-SAT", label: "رضا العمل", text: "أثر: ابتعاد الإنسان عن المهمة المرهقة قد يرفع رضاه." },
          { cov: "A2-H-RISK-SKILL", label: "مهارات جديدة", text: "أثر: تشغيل النظام الآلي يحتاج مهارة مختلفة." },
          { cov: "A2-H-RISK-COST", label: "كلفة أقل", text: "أثر: الأتمتة قد تخفض كلفة التشغيل." }
        ],
        art: A.flow([
          { icon: "warn", label: "مهمة خطرة", sub: "أبخرة وحرارة", c: C.rose },
          { icon: "robot", label: "برنامج يؤتمتها", sub: "يدير الخلط", c: C.amber },
          { icon: "shield", label: "إنسان آمن", sub: "يراقب من بعيد", c: C.teal }
        ], { label: "من مهمة خطرة إلى إنسان آمن" }),
        caption: "البرنامج يتحمل الخطر أو التكرار، والإنسان يراقب",
        quiz: {
          id: "a2-risk", cov: "A2-RISK-Q",
          prompt: "لماذا تُؤتمت المعالجة الكيميائية؟",
          choices: [
            { id: "a", text: "لتقليل تعرض الإنسان للخطر.", ok: true },
            { id: "b", text: "لزيادة العزلة الاجتماعية.", ok: false }
          ],
          why: "هذه الفئة تستبدل العمل الخطر أو الرتيب. الأثر الأوضح خطر جسدي أقل، مع إنتاج أعلى. التعدين وتصنيع السيارات أمثلة إضافية."
        }
      }),
      L({
        cov: ["A2-SOC", "A2-SOC-Q", "A2-H-FB", "A2-H-SNAP", "A2-H-WA", "A2-H-PIN", "A2-H-IG", "A2-H-WP", "A2-H-BLOG", "A2-H-SOC-SKILL", "A2-H-SOC-TALK", "A2-H-SOC-MINOR", "A2-H-SOC-ADDICT", "A2-H-SOC-CAUSE"],
        titleAr: "التواصل الاجتماعي",
        titleEn: "Social media",
        story: { icon: "chat", color: C.vio, who: "حملة جمع تبرعات في المدرسة", text: "نشر طلاب الصف الثاني عشر صورة الحملة، فوصلت إلى مئات الناس في يوم واحد. وفي اليوم نفسه وصلت رسالة مشبوهة تطلب كلمة مرور." },
        lines: [{ text: "تطبيقات التواصل تربط الناس وتشارك الأفكار والأحداث والصور والفيديو. مثال: X. أثرها الإيجابي تبادل الأفكار، والسلبي مخاطر أمنية.", cov: "A2-SOC" }],
        hints: [
          { cov: "A2-H-FB", label: "Facebook", text: "مثال على شبكة تصل الأصدقاء والصفحات." },
          { cov: "A2-H-SNAP", label: "Snapchat", text: "مثال على مشاركة قصيرة بالصورة." },
          { cov: "A2-H-WA", label: "WhatsApp", text: "مثال على الرسائل والمجموعات." },
          { cov: "A2-H-PIN", label: "Pinterest", text: "مثال على جمع الصور والأفكار." },
          { cov: "A2-H-IG", label: "Instagram", text: "مثال على الصور والفيديو القصير." },
          { cov: "A2-H-WP", label: "WordPress", text: "مثال على نشر المقالات." },
          { cov: "A2-H-BLOG", label: "Blogger", text: "مثال آخر على التدوين." },
          { cov: "A2-H-SOC-SKILL", label: "مهارة التواصل", text: "أثر: طريقة الكلام قد تتغير مع المنصة." },
          { cov: "A2-H-SOC-TALK", label: "نقاش المشكلات", text: "أثر: الناس يناقشون مشكلاتهم ويشاركونها." },
          { cov: "A2-H-SOC-MINOR", label: "القُصّر", text: "أثر: خطر على القُصّر والبالغين الأكثر عرضة للأذى." },
          { cov: "A2-H-SOC-ADDICT", label: "الإدمان", text: "أثر محتمل: صعوبة ترك المنصة." },
          { cov: "A2-H-SOC-CAUSE", label: "قضية عامة", text: "أثر إيجابي: المساهمة في قضية مهمة." }
        ],
        art: A.hub({ icon: "users", label: "الناس", c: C.vio }, [
          { icon: "chat", label: "رسائل", c: C.teal },
          { icon: "eye", label: "صور", c: C.amber },
          { icon: "file", label: "مقالات", c: C.sky },
          { icon: "heart", label: "قضية عامة", c: C.lime },
          { icon: "lock", label: "مخاطر أمنية", c: C.rose }
        ], { label: "التواصل الاجتماعي يربط الناس بالمحتوى" }),
        caption: "شبكة واحدة، فيها فائدة وفيها خطر",
        quiz: {
          id: "a2-soc", cov: "A2-SOC-Q",
          prompt: "أي أثر سلبي يظهر في تطبيقات التواصل؟",
          choices: [
            { id: "a", text: "مخاطر أمنية.", ok: true },
            { id: "b", text: "انخفاض أجر الساعة.", ok: false }
          ],
          why: "تبادل الأفكار أثر إيجابي، والمخاطر الأمنية أثر سلبي. القُصّر والإدمان والمساهمة في القضايا تفاصيل إضافية."
        }
      }),
      L({
        cov: ["A2-SEARCH", "A2-SEARCH-Q"],
        titleAr: "محركات البحث",
        titleEn: "Search engines",
        tag: "إضافي",
        story: { icon: "search", color: C.amber, who: "واجب عن البتراء", text: "كتب عمر «تاريخ البتراء» فظهرت آلاف الصفحات في ثانية. بعضها من مصادر موثوقة، وبعضها منتدى لا يُعرف كاتبه." },
        lines: [{ text: "فئة إضافية. مثال واحد: محرك بحث عام على الويب. أثر إيجابي واحد: الوصول السريع إلى المعلومات. أثر سلبي واحد: ظهور صفحات غير موثوقة.", cov: "A2-SEARCH" }],
        art: A.flow([
          { icon: "question", label: "سؤال", sub: "تاريخ البتراء", c: C.amber },
          { icon: "search", label: "محرك البحث", sub: "في ثانية", c: C.sky },
          { icon: "check", label: "صفحة موثوقة", c: C.teal },
          { icon: "warn", label: "صفحة مشكوك فيها", c: C.rose }
        ], { bw: 120, label: "من السؤال إلى النتائج" }),
        caption: "سرعة الوصول أثر إيجابي، والصفحات غير الموثوقة أثر سلبي",
        quiz: {
          id: "a2-search", cov: "A2-SEARCH-Q",
          prompt: "كم أثرًا يُعرض لهذه الفئة؟",
          choices: [
            { id: "a", text: "أثر إيجابي واحد وأثر سلبي واحد.", ok: true },
            { id: "b", text: "كل آثار الألعاب والتواصل.", ok: false }
          ],
          why: "محركات البحث فئة إضافية بمثال واحد وأثرين فقط. الإيجابي سرعة الوصول، والسلبي الصفحات غير الموثوقة."
        }
      }),
      { cov: ["A2-TEN", "A2-TEN-Q"], titleAr: "عشرة تطبيقات: الفئة والأثر", titleEn: "Uses and implications of software applications", render: ten }
    ]
  });
})();
