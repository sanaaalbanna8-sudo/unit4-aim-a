(function () {
  const A = window.ART;
  const C = A.C;

  function whoArt() {
    return A.duo(
      { icon: "phone", title: "من يستخدم", c: C.sky, lines: ["يفتح التطبيق", "يقرأ الدرجة 85", "ثم يغلقه"] },
      { icon: "code", title: "من يبني", c: C.amber, lines: ["يقرر ما يظهر", "يحدد مصدر الرقم", "يخطط لحالة الخطأ"] },
      { label: "مقارنة بين من يستخدم التطبيق ومن يبنيه", mid: "≠" }
    );
  }

  function mapArt(current) {
    const W = 560, H = 445;
    const pos = [[470, 70], [280, 70], [90, 70], [90, 215], [280, 215], [470, 215], [470, 360], [280, 360]];
    let s = '<path class="flowdash" d="M470 70 L90 70 C 20 70, 20 215, 90 215 L470 215 C 540 215, 540 360, 470 360 L280 360" fill="none" stroke="' + C.mute + '" stroke-opacity=".55" stroke-width="3"/>';
    UI.stations.forEach(function (st, i) {
      const p = pos[i];
      if (!p) return;
      const here = st.id === current;
      const tone = { teal: C.teal, amber: C.amber, violet: C.vio, coral: C.rose }[st.tone] || C.teal;
      s += '<g class="rise" style="animation-delay:' + (i * 0.08) + 's">' +
        (here ? '<circle class="pulse" cx="' + p[0] + '" cy="' + p[1] + '" r="40" fill="' + tone + '" fill-opacity=".18"/>' : "") +
        '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="30" fill="' + C.bg + '" stroke="' + tone + '" stroke-width="3"/>' +
        A.text(p[0], p[1] + 6, st.badge, { en: st.badge.length < 3, size: st.badge.length < 3 ? 17 : 13, color: tone, weight: 700 }) +
        A.text(p[0], p[1] + 52, st.short || st.titleAr, { size: 14 }) +
        A.text(p[0], p[1] + 70, st.shortEn || "", { size: 11, en: true, color: C.mute, weight: 500 }) + "</g>";
    });
    return A.svg(W, H, s, "خريطة المسار: ثماني محطات متتالية");
  }

  UI.register({
    id: "s0",
    badge: "0",
    tone: "coral",
    short: "البداية",
    shortEn: "Start",
    titleAr: "قبل السطر الأول",
    titleEn: "Before the first line",
    blurb: "الفرق بين من يستخدم البرنامج ومن يبنيه.",
    screens: [
      {
        cov: ["S0-WHO", "S0-WHO-Q"],
        titleAr: "من يستخدم ومن يبني",
        titleEn: "User and builder",
        render: function (api) {
          api.story({
            icon: "phone", color: C.sky, who: "في الاستراحة، ساحة المدرسة",
            text: "يفتح رامي تطبيق الدرجات فيرى 85، ثم يغلقه. لكن أحدًا ما قرّر قبله أين يظهر الرقم، ومن أين يأتي، وماذا يرى رامي لو انقطع الإنترنت."
          });
          api.p("البرمجة حلّ مسائل بالتفكير المنطقي. من يستخدم التطبيق يقرأ الرقم. ومن يبنيه يقرّر ماذا يظهر، ومن أين يأتي الرقم، وماذا يحدث عند الخطأ.", "S0-WHO");
          api.art(whoArt(), "الدور نفسه يختلف: قراءة الناتج، أو تصميم السلوك");
          api.quiz({
            id: "s0-who",
            cov: "S0-WHO-Q",
            prompt: "أي وصف يطابق دور من يبني البرنامج؟",
            choices: [
              { id: "read", text: "قراءة الرقم ثم إغلاق التطبيق.", ok: false },
              { id: "build", text: "تحديد ما تظهره الشاشة، ومصدر الرقم، وما يحدث عند الخطأ.", ok: true }
            ],
            why: "قراءة الرقم دور من يستخدم التطبيق. البناء يحدد السلوك والمصدر وما يحدث عند الخطأ. الخلاصة: من يبني يصمّم السلوك، ومن يستخدم يتلقّى الناتج."
          });
        }
      },
      {
        cov: ["S0-MAP"],
        titleAr: "خريطة المسار",
        titleEn: "The path",
        render: function (api) {
          api.p("هذا مسار واحد من ثماني محطات. كل محطة تبني على التي قبلها، وتنتهي بمحلل برنامج حقيقي.", "S0-MAP");
          api.points([
            "كل شاشة فيها فكرة واحدة، ومثال، ثم تجربة أو سؤال.",
            "اضغط «تحقق» لتعرف هل إجابتك صحيحة، ثم اكشف السبب إن أردت.",
            "مرّر المؤشر على المصطلح لترى معناه، واضغط السماعة لتسمع نطقه.",
            "تستطيع الانتقال إلى أي محطة من الشريط العلوي، والأفضل أن تسير بالترتيب."
          ]);
          api.term("computational-thinking", "التفكير الحاسوبي");
          api.art(mapArt("s0"), "تبدأ من هنا، وتنتهي عند محلل البرنامج");
        }
      }
    ]
  });
})();
