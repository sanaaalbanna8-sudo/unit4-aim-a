(function () {
  const L = UI.lesson;
  const A = window.ART;
  const C = A.C;

  /* رادار مشترك: يستخدمه A6 بستة محاور والمحلل بسبعة */
  window.RadarLab = function (api, o) {
    api.lab({
      title: o.title,
      line: o.line,
      cov: o.cov,
      build: function (body) {
        const n = o.labels.length;
        const values = o.labels.map(function () { return 3; });
        let shown = values.slice();
        let raf = 0;
        const holder = UI.el("div");
        const sliders = UI.el("div", { class: "sliders" });
        const inputs = [];
        const W = 460, cx = 230, cy = 205, R = 130;
        function pt(i, r) {
          const a = -Math.PI / 2 + i * 2 * Math.PI / n;
          return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
        }
        function paint() {
          let s = "";
          for (let k = 1; k <= 5; k++) {
            s += '<polygon points="' + o.labels.map(function (_, i) { return pt(i, R * k / 5).map(function (v) { return v.toFixed(1); }).join(","); }).join(" ") + '" fill="none" stroke="' + C.ink + '" stroke-opacity="' + (k === 5 ? 0.25 : 0.1) + '"/>';
          }
          o.labels.forEach(function (label, i) {
            const e = pt(i, R);
            const t = pt(i, R + 34);
            s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" stroke="' + C.ink + '" stroke-opacity=".15"/>';
            const anchor = Math.abs(t[0] - cx) < 12 ? "middle" : t[0] > cx ? "left" : "right";
            s += A.text(t[0].toFixed(1), (t[1] + 5).toFixed(1), label, { size: 13, anchor: anchor, color: i === 6 ? C.amber : C.ink });
          });
          const poly = shown.map(function (v, i) { return pt(i, R * v / 5).map(function (x) { return x.toFixed(1); }).join(","); }).join(" ");
          s += '<polygon points="' + poly + '" fill="' + o.color + '" fill-opacity=".3" stroke="' + o.color + '" stroke-width="2.5" stroke-linejoin="round"/>';
          shown.forEach(function (v, i) { const p = pt(i, R * v / 5); s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="5" fill="' + o.color + '"/>'; });
          holder.innerHTML = A.svg(W, 410, s, "رادار الجودة");
        }
        function animate() {
          cancelAnimationFrame(raf);
          const from = shown.slice();
          const start = performance.now();
          function frame(now) {
            const k = Math.min(1, (now - start) / 350);
            const e = 1 - Math.pow(1 - k, 3);
            shown = from.map(function (f, i) { return f + (values[i] - f) * e; });
            paint();
            if (k < 1) raf = requestAnimationFrame(frame);
          }
          raf = requestAnimationFrame(frame);
        }
        o.labels.forEach(function (label, i) {
          const r = UI.el("input", { type: "range", min: "1", max: "5", value: "3", "aria-label": label });
          const out = UI.el("output", { text: UI.ar(3) });
          r.addEventListener("input", function () { values[i] = Number(r.value); out.textContent = UI.ar(r.value); animate(); });
          inputs.push([r, out]);
          sliders.appendChild(UI.el("label", null, UI.el("span", { text: label }), r, out));
        });
        const presets = UI.el("div", { class: "row" });
        (o.presets || []).forEach(function (p) {
          const b = UI.el("button", { type: "button", class: "chip", text: p[0] });
          b.addEventListener("click", function () {
            p[1].forEach(function (v, i) { values[i] = v; inputs[i][0].value = String(v); inputs[i][1].textContent = UI.ar(v); });
            note.textContent = p[2] || "";
            animate();
          });
          presets.appendChild(b);
        });
        const note = UI.el("p", { class: "game-line" });
        body.appendChild(holder);
        if (o.presets) { body.appendChild(presets); body.appendChild(note); }
        body.appendChild(sliders);
        paint();
      }
    });
  };

  function radar(api) {
    api.story({ icon: "phone", color: C.teal, who: "تطبيقان لحجز موعد طبيب", text: "الأول سريع جدًا لكنه ينهار إن كتبت التاريخ خطأ. الثاني أبطأ قليلًا لكنه لا ينهار ويفهمه كبار السن. أيهما أجود؟ يعتمد على ما تقيسه." });
    api.p("ست صفات تحكم بها على البرنامج: الكفاءة، وقابلية الصيانة، وقابلية النقل، والموثوقية، والمتانة، وسهولة الاستخدام. رفع صفة قد يكلف صفة أخرى، والتصميم والتنفيذ يغيّران الجودة.");
    api.points(["Efficiency / performance", "Maintainability", "Portability", "Reliability", "Robustness", "Usability"]);
    window.RadarLab(api, {
      title: "رادار الصفات الست",
      line: "حرّك المؤشرات أو اختر برنامجًا جاهزًا، وراقب شكل الجودة يتغير.",
      cov: "A6-RADAR",
      color: C.teal,
      labels: ["الكفاءة", "قابلية الصيانة", "قابلية النقل", "الموثوقية", "المتانة", "سهولة الاستخدام"],
      presets: [
        ["لعبة سريعة", [5, 2, 2, 3, 2, 4], "سرعة عالية على حساب الصيانة والنقل."],
        ["نظام مستشفى", [3, 4, 2, 5, 5, 4], "الموثوقية والمتانة في القمة لأن السلامة على المحك."],
        ["نموذج أولي", [2, 2, 3, 2, 1, 4], "يُبنى بسرعة ليرى المستخدم الشكل، لا ليصمد."]
      ]
    });
    api.link("لأن الوقت والذاكرة محدودان، فإن رفع الكفاءة قد يصعّب القراءة، لذلك تُوازن الصفات ولا تُطلب كلها في أقصى درجة.");
    api.quiz({
      id: "a6-radar",
      cov: "A6-RADAR-Q",
      prompt: "ماذا يظهر حين تتحرك المؤشرات؟",
      choices: [
        { id: "a", text: "مفاضلة بين الصفات، لا اجتماعها كلها في القمة.", ok: true },
        { id: "b", text: "أن كل البرامج متساوية مهما تغيّر التصميم.", ok: false }
      ],
      why: "التصميم والتنفيذ يغيّران الجودة. ويختلف الحل بين المبرمجين لأن اللغة مرنة والمسألة تحتمل أكثر من بناء."
    });
  }

  function efficiency(api) {
    api.story({ icon: "game", color: C.vio, who: "لعبة على هاتف قديم", text: "اللعبة تتقطع في المعارك. السبب ليس الهاتف وحده: الكود يعيد حساب أشياء لم تتغير في كل لقطة." });
    api.p("تُقاس الكفاءة بموارد النظام التي يستهلكها البرنامج: دورات الساعة، ووقت المعالج، والذاكرة المحجوزة، ومعدل القراءة والكتابة في التخزين. العملية المعقدة قد تثقل المعالج، ومراجعة الكود ليصير أقتصد تجعله أسرع وأقل استهلاكًا للذاكرة.", "A6-EFF");
    api.term("efficiency", "الكفاءة");
    api.term("performance", "الأداء");
    api.term("cpu", "المعالج");
    api.term("ram", "الذاكرة");
    api.hint("A6-H-FRAME", "الإطارات", "إن انخفض عدد الإطارات فغالبًا هناك عمل زائد في كل لقطة.");
    api.lab({
      title: "عدّاد الإطارات",
      line: "زد العمل الزائد في كل لقطة، وراقب الإطارات والموارد.",
      build: function (body) {
        const r = UI.el("input", { type: "range", min: "0", max: "10", value: "2" });
        const pic = UI.el("div");
        function draw() {
          const w = Number(r.value);
          const fps = Math.max(8, Math.round(60 - w * 5.2));
          const cpu = Math.min(100, 30 + w * 7);
          const mem = Math.min(100, 25 + w * 6);
          const c = fps >= 45 ? C.teal : fps >= 25 ? C.amber : C.rose;
          const bar = function (y, label, v, col) {
            return A.text(540, y + 16, label, { anchor: "right", size: 14 }) + A.box(90, y, 330, 22, C.mute, { fo: 0.06, so: 0.2, r: 11 }) +
              '<rect x="' + (420 - 3.3 * v) + '" y="' + y + '" width="' + (3.3 * v).toFixed(1) + '" height="22" rx="11" fill="' + col + '" fill-opacity=".8"/>' + A.text(80, y + 16, v + "%", { anchor: "left", en: true, size: 13 });
          };
          const s = '<circle cx="280" cy="80" r="62" fill="' + c + '" fill-opacity=".12" stroke="' + c + '" stroke-width="3"/>' +
            A.text(280, 88, String(fps), { en: true, size: 40, color: c, weight: 700 }) + A.text(280, 120, "إطار في الثانية", { size: 13, color: C.mute }) +
            bar(170, "وقت المعالج", cpu, C.amber) + bar(205, "الذاكرة", mem, C.vio) + bar(240, "قراءة التخزين", Math.min(100, 20 + w * 4), C.sky);
          pic.innerHTML = A.svg(560, 275, s, "الإطارات والموارد");
        }
        r.addEventListener("input", draw);
        body.appendChild(UI.el("label", { class: "field" }, UI.el("span", { text: "عمل زائد في كل لقطة" }), r));
        body.appendChild(pic);
        draw();
      }
    });
    api.quiz({
      id: "a6-eff", cov: "A6-EFF-Q",
      prompt: "أي مقياس يصف سرعة قراءة التخزين؟",
      choices: [
        { id: "a", text: "معدل القراءة والكتابة.", ok: true },
        { id: "b", text: "لون القائمة.", ok: false }
      ],
      why: "الكفاءة تنظر إلى المعالج والذاكرة والتخزين. مراجعة الكود تقلل العمل الزائد، والألعاب تكشف ذلك في سلاسة الصورة."
    });
  }

  function realtime(api) {
    api.story({ icon: "traffic", color: C.amber, who: "إشارة مرور عند دوار المدينة الرياضية", text: "الحاسوب قرر الصواب: أطفئ الأخضر الآن. لكنه نفّذ القرار بعد ثلاث ثوانٍ. القرار الصحيح المتأخر خطأ في هذا النوع من الأنظمة." });
    api.p("النظام الآني يجب أن يجيب ضمن حد زمني صارم. التأخير نفسه خطأ وإن كانت النتيجة صحيحة لاحقًا. ويكثر حيث يتصل البرنامج بعتاد خارجي والتوقيت حاسم.", "A6-RT");
    api.term("real-time-systems", "النظام الآني");
    api.hint("A6-H-TRAFFIC", "التحكم في المرور", "إشارة تتأخر عن وقتها قد تعطّل التقاطع وإن حسبت القرار الصحيح.");
    api.hint("A6-H-MISSILE", "أنظمة التوجيه", "نظام التوجيه الذي يجيب بعد فوات اللحظة لا يؤدي مهمته.");
    api.lab({
      title: "سباق مع الحد الزمني",
      line: "الحد 200 جزء من الثانية. حرّك زمن الاستجابة وانظر هل تصلح النتيجة.",
      build: function (body) {
        const r = UI.el("input", { type: "range", min: "50", max: "400", step: "10", value: "150" });
        const pic = UI.el("div");
        const out = UI.el("p", { class: "readout" });
        function draw() {
          const t = Number(r.value);
          const ok = t <= 200;
          const x = 40 + (t / 400) * 480;
          const s = A.box(40, 60, 480, 40, C.mute, { fo: 0.05, so: 0.2, r: 20 }) +
            '<rect x="' + (40 + 240) + '" y="60" width="240" height="40" rx="20" fill="' + C.rose + '" fill-opacity=".12"/>' +
            '<line x1="280" y1="40" x2="280" y2="120" stroke="' + C.rose + '" stroke-width="3" stroke-dasharray="6 5"/>' + A.text(280, 34, "الحد 200", { size: 13, color: C.rose }) +
            '<circle cx="' + x.toFixed(1) + '" cy="80" r="16" fill="' + (ok ? C.teal : C.rose) + '" style="transition:cx .2s"/>' +
            A.icon("traffic", 250, 130, 60, ok ? C.teal : C.rose) + A.text(280, 215, t + " ms", { en: true, size: 16 });
          pic.innerHTML = A.svg(560, 225, s, "زمن الاستجابة مقابل الحد");
          out.className = "readout" + (ok ? "" : " bad");
          out.textContent = ok ? "في الوقت: النتيجة صالحة للمهمة." : "متأخر: النتيجة صحيحة، لكنها لم تعد صالحة.";
        }
        r.addEventListener("input", draw);
        body.appendChild(UI.el("label", { class: "field" }, UI.el("span", { text: "زمن الاستجابة" }), r));
        body.appendChild(pic);
        body.appendChild(out);
        draw();
      }
    });
    api.quiz({
      id: "a6-rt", cov: "A6-RT-Q",
      prompt: "ماذا يعني فوات الحد الزمني في نظام آني؟",
      choices: [
        { id: "a", text: "النتيجة لم تعد صالحة للمهمة.", ok: true },
        { id: "b", text: "لا أهمية للوقت إن صحت النتيجة غدًا.", ok: false }
      ],
      why: "النظام الآني يربط الصحة بالوقت. المرور والتوجيه مثالان على حد لا يجوز تجاوزه."
    });
  }

  function robust(api) {
    api.story({ icon: "shield", color: C.teal, who: "نموذج تسجيل في نادٍ رياضي", text: "كتب أحدهم في خانة العمر «ألف». نموذج ضعيف انهار، ونموذج متين أظهر رسالة: «اكتب عمرك بالأرقام»، واستمر يعمل." });
    api.p("البرنامج المتين يعالج البيانات المتطرفة أو الخاطئة دون أن ينهار. وهذا يأتي من جودة الكتابة والاختبار.");
    api.term("robustness", "المتانة");
    api.lab({
      title: "اختبر حقل العمر",
      line: "اكتب قيمة أو جرّب قيمة جاهزة: متطرفة، أو خاطئة، أو صحيحة.",
      cov: "A6-ROBUST",
      build: function (body) {
        const input = UI.el("input", { type: "text", value: "ألف", "aria-label": "العمر" });
        const out = UI.el("p", { class: "readout" });
        const pic = UI.el("div");
        function check() {
          const raw = input.value.trim();
          const age = Number(raw);
          const ok = raw !== "" && Number.isInteger(age) && age >= 1 && age <= 120;
          let why = "";
          if (raw === "") why = "الحقل فارغ.";
          else if (!Number.isFinite(age)) why = "هذه ليست أرقامًا.";
          else if (!Number.isInteger(age)) why = "العمر عدد صحيح.";
          else if (age < 1 || age > 120) why = "القيمة خارج النطاق 1 إلى 120.";
          out.className = "readout" + (ok ? "" : " bad");
          out.textContent = ok ? "القيمة مقبولة." : "القيمة رُفضت برسالة (" + why + ")، والبرنامج ما زال يعمل.";
          pic.innerHTML = A.svg(560, 120, A.box(20, 20, 160, 70, C.sky) + A.text(100, 62, raw || "—", { size: 18 }) + A.arrow(185, 55, 235, 55, C.sky) +
            '<g class="pulse">' + A.icon("shield", 245, 20, 70, ok ? C.teal : C.amber) + "</g>" + A.arrow(325, 55, 375, 55, ok ? C.teal : C.amber) +
            A.box(380, 20, 160, 70, ok ? C.teal : C.amber) + A.text(460, 62, ok ? "حُفظ" : "رسالة لطيفة", { size: 16 }), "مسار القيمة عبر الفحص");
        }
        input.addEventListener("input", check);
        const row = UI.el("div", { class: "row" });
        ["ألف", "-5", "0", "999", "17.5", "21"].forEach(function (v) {
          const b = UI.el("button", { type: "button", class: "chip", dir: "auto", text: v });
          b.addEventListener("click", function () { input.value = v; check(); });
          row.appendChild(b);
        });
        body.appendChild(input);
        body.appendChild(row);
        body.appendChild(pic);
        body.appendChild(out);
        check();
      }
    });
    api.link("لأن النص والصفر والألف ليست أعمارًا صالحة، فإن البرنامج يرفضها برسالة، لذلك لا ينهار.");
    api.quiz({
      id: "a6-robust", cov: "A6-ROBUST-Q",
      prompt: "كُتب العمر نصًا بدل عدد. ماذا يفعل البرنامج المتين؟",
      choices: [
        { id: "a", text: "يرفض القيمة برسالة ويبقى يعمل.", ok: true },
        { id: "b", text: "يغلق الجهاز.", ok: false }
      ],
      why: "المتانة مسار للبيانات السيئة. الرسالة أوضح من الانهيار، والبرنامج يكمل العمل مع بقية المستخدمين."
    });
  }

  function reliability(api) {
    api.story({ icon: "plane", color: C.sky, who: "برج المراقبة في مطار الملكة علياء", text: "برنامج كشف التصادم يجب أن يعطي التحذير الصحيح في كل مرة، لا في تسع مرات من عشر." });
    api.p("الموثوقية دقة تتكرر في تشغيلات متعددة. النتيجة الصحيحة مرة واحدة ثم المختلفة بعدها ليست موثوقية. وحيث تتعلق السلامة بالمخرج يجب أن يكون البرنامج موثوقًا تمامًا.", "A6-REL");
    api.example("أنظمة السلامة في محطة طاقة، واكتشاف التصادم في مراقبة الملاحة الجوية.", "A6-SAFE");
    api.term("reliability", "الموثوقية");
    api.lab({
      title: "شغّل خمس مرات",
      line: "البرنامجان يحسبان 20 + 22. شغّلهما وقارن الثبات.",
      build: function (body) {
        const a = [], b = [];
        const pic = UI.el("div");
        const out = UI.el("p", { class: "readout", text: "لم يُشغَّل أي برنامج بعد." });
        function draw() {
          let s = A.text(540, 40, "برنامج أ", { anchor: "right", size: 15, color: C.teal }) + A.text(540, 120, "برنامج ب", { anchor: "right", size: 15, color: C.amber });
          for (let i = 0; i < 5; i++) {
            const x = 30 + i * 90;
            [[a, 20, C.teal], [b, 100, C.amber]].forEach(function (row) {
              const v = row[0][i];
              const ok = v === 42;
              s += A.box(x, row[1], 78, 46, v == null ? C.mute : ok ? C.teal : C.rose, { fo: v == null ? 0.03 : 0.15, r: 10 }) +
                A.text(x + 39, row[1] + 30, v == null ? "?" : String(v), { en: true, size: 18, color: v == null ? C.mute : ok ? C.ink : C.rose });
            });
          }
          pic.innerHTML = A.svg(560, 160, s, "نتائج التشغيلات");
        }
        const run = UI.el("button", { type: "button", class: "btn", text: "▶ شغّل" });
        run.addEventListener("click", function () {
          if (a.length >= 5) return;
          a.push(42);
          b.push(a.length === 1 || a.length === 4 ? 42 : [41, 43, 40][a.length % 3]);
          draw();
          if (a.length === 5) out.textContent = "أ أعطى 42 خمس مرات: موثوق. ب أصاب مرتين فقط: دقته لا تتكرر، فليس موثوقًا.";
          else out.textContent = "التشغيل " + UI.ar(a.length) + " من 5.";
        });
        body.appendChild(pic);
        body.appendChild(UI.el("div", { class: "row" }, run));
        body.appendChild(out);
        draw();
      }
    });
    api.quiz({
      id: "a6-rel", cov: "A6-REL-Q",
      prompt: "برنامج أعطى الناتج الصحيح مرة ثم اختلف. هل هو موثوق؟",
      choices: [
        { id: "a", text: "لا. الموثوقية تشترط التكرار.", ok: true },
        { id: "b", text: "نعم. مرة واحدة تكفي.", ok: false }
      ],
      why: "الدقة بلا ثبات لا تكفي. محطة الطاقة ومراقبة الملاحة مثالان لا يُقبل فيهما الخطأ المتكرر."
    });
  }

  UI.register({
    id: "a6",
    badge: "A6",
    tone: "amber",
    short: "جودة التطبيقات",
    shortEn: "Quality",
    titleAr: "جودة التطبيقات البرمجية",
    titleEn: "Quality of software applications",
    blurb: "احكم على الكفاءة والصيانة والنقل والموثوقية والمتانة والاستخدام.",
    screens: [
      { cov: ["A6-RADAR", "A6-RADAR-Q"], titleAr: "رادار الصفات الست", titleEn: "Quality of software applications", render: radar },
      { cov: ["A6-EFF", "A6-EFF-Q", "A6-H-FRAME"], titleAr: "الكفاءة والأداء", titleEn: "Efficiency / performance", render: efficiency },
      { cov: ["A6-RT", "A6-RT-Q", "A6-H-TRAFFIC", "A6-H-MISSILE"], titleAr: "الأنظمة الآنية", titleEn: "Efficiency / performance: real-time systems", render: realtime },
      L({
        cov: ["A6-MAINT", "A6-COST", "A6-MAINT-Q"],
        titleAr: "قابلية الصيانة",
        titleEn: "Maintainability: corrective, perfective, adaptive",
        story: { icon: "wrench", color: C.amber, who: "تطبيق حجز تذاكر الحافلات", text: "في الأسبوع الأول ظهر خطأ في السعر فأُصلح. ثم صار البحث أسرع. ثم أضافت الشركة الدفع بالمحفظة الإلكترونية. ثلاثة أنواع من الصيانة." },
        lines: [
          { text: "قابلية الصيانة مدى سهولة تعديل البرنامج على مطوّره الحالي أو اللاحق. التصحيحية تصلح خللًا معروفًا، والتحسينية ترفع أداء برنامج يعمل، والتكيّفية تضيف وظيفة أو تغيّرها أو تحذفها لأن الحاجة تغيّرت.", cov: "A6-MAINT" },
          { text: "الإسراع في البداية يخفض الكلفة الأولى، وقد يرفع كلفة الصيانة لاحقًا. والكود الذي يسهل تغييره يوفّر الوقت فيما بعد.", cov: "A6-COST" }
        ],
        terms: [["maintainability", "قابلية الصيانة"], ["corrective-maintenance", "تصحيحية"], ["perfective-maintenance", "تحسينية"], ["adaptive-maintenance", "تكيّفية"]],
        art: function (api) {
          const fast = [[40, 200], [140, 175], [240, 140], [340, 95], [440, 40], [520, 10]];
          const careful = [[40, 150], [140, 145], [240, 138], [340, 130], [440, 122], [520, 118]];
          const path = function (p) { return "M" + p.map(function (x) { return x.join(" "); }).join(" L"); };
          const s = '<path d="M40 220 H530 M40 220 V0" stroke="' + C.mute + '" stroke-opacity=".4" fill="none"/>' +
            '<path class="flowdash" d="' + path(fast) + '" stroke="' + C.rose + '" stroke-width="3" fill="none"/>' +
            '<path d="' + path(careful) + '" stroke="' + C.teal + '" stroke-width="3" fill="none"/>' +
            A.text(470, 30, "بداية سريعة", { size: 13, color: C.rose }) + A.text(470, 108, "بداية متأنية", { size: 13, color: C.teal }) +
            A.text(285, 245, "الزمن ←", { size: 13, color: C.mute }) + A.text(20, 110, "الكلفة", { size: 13, color: C.mute, anchor: "middle" });
          api.art(A.svg(560, 255, s, "كلفة الصيانة مع الزمن"), "البداية السريعة أرخص أولًا، وأغلى لاحقًا");
          api.bins({
            id: "g-a6-maint",
            title: "أي نوع صيانة هذا؟",
            bins: [{ id: "cor", label: "تصحيحية" }, { id: "per", label: "تحسينية" }, { id: "ada", label: "تكيّفية" }],
            items: [
              { text: "إصلاح سعر تذكرة خاطئ", bin: "cor" }, { text: "تسريع البحث عن الرحلات", bin: "per" },
              { text: "إضافة الدفع بالمحفظة", bin: "ada" }, { text: "إصلاح انهيار عند الضغط مرتين", bin: "cor" },
              { text: "تقليل استهلاك البطارية", bin: "per" }, { text: "حذف خدمة ألغتها الشركة", bin: "ada" }
            ],
            why: "التصحيحية للخلل: السعر والانهيار. التحسينية لبرنامج يعمل: السرعة والبطارية. التكيّفية لأن الحاجة تغيّرت: إضافة المحفظة وحذف الخدمة الملغاة."
          });
        },
        quiz: {
          id: "a6-maint", cov: "A6-MAINT-Q",
          prompt: "أضفت وظيفة لأن الحاجة تغيّرت. أي نوع صيانة هذا؟",
          choices: [
            { id: "a", text: "تكيّفية.", ok: true },
            { id: "b", text: "تصحيحية.", ok: false }
          ],
          why: "التصحيحية للخلل، والتحسينية للأداء، والتكيّفية لتغيّر الحاجة. وموازنة كلفة البداية بكلفة الصيانة قرار تصميم، لا تفصيل شكلي."
        }
      }),
      L({
        cov: ["A6-PORT", "A6-PORT-Q"],
        titleAr: "قابلية النقل",
        titleEn: "Portability",
        story: { icon: "laptop", color: C.sky, who: "برنامج كتبه طلاب في مختبر ويندوز", text: "أرادت المدرسة تشغيله على أجهزة لينكس. برنامج C احتاج تعديلات قليلة، وبرنامج Visual Basic .NET بقي محصورًا في ويندوز." },
        lines: [{ text: "قابلية النقل: كم منصة، عتادًا ونظام تشغيل، يمكن أن يُبنى لها المصدر نفسه أو يُفسَّر عليها. C تُترجم لآلات كثيرة، وبرنامج Visual Basic .NET قد ينحصر في أنظمة Microsoft، ونقل C إلى Linux قد يحتاج تغييرات قليلة خاصة بالمنصة.", cov: "A6-PORT" }],
        terms: [["portability", "قابلية النقل"], ["linux", "Linux"]],
        art: function (api) {
          api.lab({
            title: "مصدر واحد، كم منصة؟",
            line: "اختر اللغة وانظر إلى المنصات التي يصل إليها المصدر نفسه.",
            build: function (body) {
              let lang = "c";
              const pic = UI.el("div");
              const row = UI.el("div", { class: "row" });
              const targets = [["Windows", "laptop"], ["Linux", "server"], ["Mac", "laptop"], ["جهاز مدمج", "chip"]];
              const reach = { c: [1, 1, 1, 1], vb: [1, 0, 0, 0] };
              function draw() {
                row.querySelectorAll(".chip").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.l === lang ? "true" : "false"); });
                let s = A.box(210, 10, 140, 60, C.amber, { fo: 0.2 }) + A.text(280, 46, lang === "c" ? "source.c" : "Form1.vb", { en: true, size: 15, cls: "mono" });
                targets.forEach(function (t, i) {
                  const x = 20 + i * 135, ok = reach[lang][i];
                  const c = ok ? C.teal : C.mute;
                  s += A.arrow(280, 72, x + 55, 128, c, { anim: !!ok }) + A.box(x, 130, 110, 100, c, { fo: ok ? 0.14 : 0.03, so: ok ? 0.7 : 0.25 }) +
                    A.icon(t[1], x + 33, 140, 44, c) + A.text(x + 55, 210, t[0], { size: 14, en: i < 3, opacity: ok ? null : 0.5 });
                });
                pic.innerHTML = A.svg(560, 240, s, "المنصات التي يصل إليها المصدر");
              }
              [["c", "C"], ["vb", "Visual Basic .NET"]].forEach(function (l) {
                const b = UI.el("button", { type: "button", class: "chip", "data-l": l[0], text: l[1] });
                b.addEventListener("click", function () { lang = l[0]; draw(); });
                row.appendChild(b);
              });
              body.appendChild(row);
              body.appendChild(pic);
              draw();
            }
          });
        },
        quiz: {
          id: "a6-port", cov: "A6-PORT-Q",
          prompt: "أي وصف أقرب إلى قابلية النقل؟",
          choices: [
            { id: "a", text: "المصدر نفسه يُبنى لأكثر من منصة.", ok: true },
            { id: "b", text: "البرنامج يعمل على جهاز واحد ولا يُنقل أبدًا.", ok: false }
          ],
          why: "يتسع النقل كلما قلّ ما يربط المصدر بمنصة واحدة. C مثال على الاتساع، والانحصار في نظام واحد يضيّق النقل."
        }
      }),
      { cov: ["A6-REL", "A6-SAFE", "A6-REL-Q"], titleAr: "الموثوقية", titleEn: "Reliability", render: reliability },
      L({
        cov: ["A6-DISC", "A6-DISC-Q"],
        titleAr: "سؤالان للنقاش",
        titleEn: "Reliability: discussion",
        lines: [{ text: "ناقش مع زميلك سؤالين. الأول: اذكر ثلاث حالات أخرى يجب أن يكون البرنامج فيها موثوقًا تمامًا، غير محطة الطاقة ومراقبة الملاحة. الثاني: صف برنامجًا لم يكن موثوقًا. هل كان منع الخلل ممكنًا قبل الإصدار؟ ولماذا تأخر الإصلاح؟", cov: "A6-DISC" }],
        art: function (api) {
          const s = A.box(250, 20, 290, 120, C.teal, { fo: 0.1, r: 24 }) + '<path d="M500 140 l10 30 l-40 -30z" fill="' + C.teal + '" fill-opacity=".1" stroke="' + C.teal + '" stroke-opacity=".6"/>' +
            A.text(395, 60, "السؤال الأول", { size: 15, color: C.teal, weight: 700 }) + A.text(395, 94, "ثلاث حالات أخرى", { size: 14 }) + A.text(395, 120, "تعتمد السلامة فيها على البرنامج", { size: 13, color: C.mute }) +
            A.box(20, 160, 290, 120, C.amber, { fo: 0.1, r: 24 }) + '<path d="M60 280 l-10 30 l40 -30z" fill="' + C.amber + '" fill-opacity=".1" stroke="' + C.amber + '" stroke-opacity=".6"/>' +
            A.text(165, 200, "السؤال الثاني", { size: 15, color: C.amber, weight: 700 }) + A.text(165, 234, "برنامج لم يكن موثوقًا", { size: 14 }) + A.text(165, 260, "هل كان منع الخلل ممكنًا؟", { size: 13, color: C.mute }) +
            A.icon("users", 400, 200, 90, C.vio, "bob");
          api.art(A.svg(560, 320, s, "سؤالان للنقاش"), "ناقش، ثم اكتب فكرتك في جملة واحدة");
        },
        quiz: {
          id: "a6-disc", cov: "A6-DISC-Q",
          prompt: "ماذا يطلب سؤال الموثوقية الأول؟",
          choices: [
            { id: "a", text: "ثلاث حالات أخرى تعتمد السلامة فيها على البرنامج.", ok: true },
            { id: "b", text: "ثلاثة ألوان للشعار.", ok: false }
          ],
          why: "السؤال الأول يوسّع الأمثلة. والسؤال الثاني يراجع تجربة برنامج غير موثوق: هل كان منع الخلل ممكنًا، ولماذا بقي حتى الإصدار."
        }
      }),
      { cov: ["A6-ROBUST", "A6-ROBUST-Q"], titleAr: "المتانة", titleEn: "Robustness", render: robust },
      L({
        cov: ["A6-USE", "A6-UCD", "A6-RAD", "A6-USE-Q"],
        titleAr: "سهولة الاستخدام",
        titleEn: "Usability",
        story: { icon: "user", color: C.teal, who: "جدّة تستخدم تطبيق البنك", text: "الأزرار صغيرة، والخط باهت، والقائمة مخفية. التطبيق يعمل بلا أخطاء، لكن الجدّة لا تكمل التحويل." },
        lines: [
          { text: "سهولة الاستخدام: هل يفهم الشخص التطبيق ويكمل مهمته؟ تدخل في الحكم المدخلات والتنقل والمخرجات، ولون أو خط سيئ يضعف الاستخدام.", cov: "A6-USE" },
          { text: "التصميم المتمحور حول المستخدم يشرك الناس في كل المراحل، ويعيد التقييم قبل القبول.", cov: "A6-UCD" },
          { text: "التطوير السريع يغيّر المخطط والتدفق والتفاعل ليجمع رأي المستخدم مبكرًا. والنموذج الأولي يُظهر المظهر والإحساس، ولا يملك كل وظائف المنتج.", cov: "A6-RAD" }
        ],
        terms: [["usability", "سهولة الاستخدام"], ["ucd", "UCD"], ["rad", "RAD"], ["prototype", "النموذج الأولي"]],
        art: A.hub({ icon: "user", label: "المستخدم", c: C.teal }, [
          { icon: "eye", label: "راقب", c: C.sky },
          { icon: "brush", label: "صمّم", c: C.amber },
          { icon: "window", label: "نموذج أولي", c: C.vio },
          { icon: "chat", label: "اسمع الرأي", c: C.rose },
          { icon: "loop", label: "عدّل", c: C.lime }
        ], { label: "دورة التصميم حول المستخدم" }),
        caption: "المستخدم في المركز، والدورة تتكرر قبل القبول",
        quiz: {
          id: "a6-use", cov: "A6-USE-Q",
          prompt: "ماذا ينقص النموذج الأولي عادة؟",
          choices: [
            { id: "a", text: "وظائف المنتج النهائية كلها.", ok: true },
            { id: "b", text: "أي شكل يمكن النظر إليه.", ok: false }
          ],
          why: "النموذج المبكر يجمع الرأي في المظهر والتدفق. والتصميم مع المستخدم يعيد التقييم، والتطوير السريع يقصّر المسافة بين الفكرة والرأي."
        }
      }),
      L({
        cov: ["A6-ACC", "A6-HCI", "A6-ACC-Q"],
        titleAr: "الوصول والتفاعل",
        titleEn: "Usability: accessibility and HCI",
        lines: [
          { text: "الوصول يراعي الإعاقة الجسدية والبصرية والسمعية والحاجات الخاصة. والتقنيات المساعدة أجهزة أو برامج، مثل قارئ الشاشة لمن يجد صعوبة في الرؤية أو في القراءة.", cov: "A6-ACC" },
          { text: "التفاعل بين الإنسان والحاسوب يدرس أثر سلوك المستخدم في تصميم الواجهة.", cov: "A6-HCI" }
        ],
        terms: [["assistive-technologies", "التقنيات المساعدة"], ["hci", "HCI"]],
        art: function (api) {
          api.lab({
            title: "اجعل الشاشة متاحة",
            line: "فعّل الخيارات وراقب كيف تصبح البطاقة أسهل لمن يجد صعوبة في الرؤية.",
            build: function (body) {
              const st = { big: false, contrast: false, labels: false };
              const card = UI.el("div", { class: "stack-scene", style: "transition:all .3s" });
              function draw() {
                card.style.fontSize = st.big ? "1.35rem" : "0.85rem";
                card.style.background = st.contrast ? "#000" : "rgba(238,241,255,.03)";
                card.style.color = st.contrast ? "#fff" : "#7d87a8";
                card.style.borderColor = st.contrast ? "#fbbf24" : "";
                card.replaceChildren(
                  UI.el("p", { style: "margin:0;font-weight:700", text: "حوّل 20 دينارًا إلى سامي" }),
                  UI.el("div", { class: "row", style: "margin-top:.5rem" },
                    UI.el("span", { class: "chip", style: st.contrast ? "border-color:#fbbf24;color:#fff" : "", text: st.labels ? "✔ تأكيد التحويل" : "✔" }),
                    UI.el("span", { class: "chip", style: st.contrast ? "border-color:#fbbf24;color:#fff" : "", text: st.labels ? "✖ إلغاء" : "✖" }))
                );
              }
              const row = UI.el("div", { class: "row" });
              [["big", "خط أكبر"], ["contrast", "تباين عالٍ"], ["labels", "أسماء واضحة للأزرار"]].forEach(function (x) {
                const b = UI.el("button", { type: "button", class: "chip", "aria-pressed": "false", text: x[1] });
                b.addEventListener("click", function () { st[x[0]] = !st[x[0]]; b.setAttribute("aria-pressed", st[x[0]] ? "true" : "false"); draw(); });
                row.appendChild(b);
              });
              body.appendChild(row);
              body.appendChild(card);
              body.appendChild(UI.el("p", { class: "game-line", text: "الأسماء الواضحة تفيد قارئ الشاشة أيضًا: يقرأ «تأكيد التحويل» بدل «علامة»." }));
              draw();
            }
          });
        },
        quiz: {
          id: "a6-acc", cov: "A6-ACC-Q",
          prompt: "قارئ الشاشة مثال على ماذا؟",
          choices: [
            { id: "a", text: "تقنية مساعدة.", ok: true },
            { id: "b", text: "مقياس لعدد الأسطر.", ok: false }
          ],
          why: "الوصول يوسّع دائرة من يستطيع استخدام البرنامج. قارئ الشاشة تقنية مساعدة، ودراسة السلوك جزء من التفاعل بين الإنسان والحاسوب."
        }
      })
    ]
  });
})();
