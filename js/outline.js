/* العناوين الستة الرئيسة وفروعها، مع مثال من الحياة لكل فرع.
   map: لكل شاشة في المحطة بالترتيب: null = تمهيد، [b] = فرع، [b, i] أو [b, [i, j]] = فرع وبنود. */
(function () {
  function it(en, ar, life) { return { en: en, ar: ar, life: life }; }

  window.OUTLINE = {
    a1: {
      lead: "Application of computational thinking skills to analyse problems and processes",
      leadAr: "تطبيق مهارات التفكير الحاسوبي لتحليل المسائل والعمليات والوصول إلى حلول تصبح تطبيقات.",
      branches: [
        { en: "Decomposition", ar: "التفكيك", life: "تحضير المنسف: تقسّمه إلى لحم، ولبن جميد، وأرز، وخبز شراك، وتقديم.",
          items: [
            it("identifying and describing problems and processes", "تحديد المسائل والعمليات ووصفها", "قبل أن تصلح الدراجة، تقول بدقة: الجنزير يسقط عند صعود الطلعة."),
            it("breaking down problems and processes into distinct steps", "تقسيم المسائل والعمليات إلى خطوات منفصلة", "التسجيل في الجامعة: تختار التخصص، ثم ترفع الوثائق، ثم تدفع الرسوم، ثم تطبع الجدول."),
            it("describing problems and processes as a set of structured steps", "وصف المسائل والعمليات بخطوات منظمة", "وصفة الكنافة المكتوبة خطوة بعد خطوة، يتبعها أي شخص فيصل إلى النتيجة نفسها."),
            it("communicating the key features of problems and processes to others as relevant", "إيصال السمات الرئيسة إلى الآخرين بما يناسبهم", "تشرح الطريق لسائق التكسي بالمعالم: بعد الدوار الثالث، يمين عند الصيدلية.")
          ] },
        { en: "Pattern recognition", ar: "تعرّف الأنماط", life: "أزمة السير في عمّان تشتد كل يوم عند الساعة 7:30 صباحًا و 3 عصرًا.",
          items: [
            it("identifying common elements or features in problems or systems", "تحديد العناصر أو السمات المشتركة", "كل تطبيقات التوصيل فيها: قائمة، وسلة، ودفع، وتتبّع."),
            it("identifying and interpreting common differences between processes or problems", "تحديد الفروق الشائعة وتفسيرها", "الدفع نقدًا عند الباب يختلف عن الدفع بالبطاقة في خطوة التأكيد فقط."),
            it("identifying individual elements within problems", "تحديد العناصر المفردة داخل المسألة", "في فاتورة الكهرباء: رقم العداد، والاستهلاك، والشريحة، والمبلغ."),
            it("describing patterns that have been identified", "وصف الأنماط التي حُددت", "كل خميس يزيد الطلب على الحلويات في المحل."),
            it("making predictions based on identified patterns", "التنبؤ اعتمادًا على الأنماط", "لأن الطلب يزيد كل خميس، يحضّر المحل كمية أكبر مساء الأربعاء.")
          ] },
        { en: "Pattern generalisation and abstraction", ar: "تعميم الأنماط والتجريد", life: "خريطة الباص تُظهر المحطات والخطوط فقط، ولا تُظهر الأشجار والبيوت.",
          items: [
            it("identifying information required to solve an identified problem", "تحديد المعلومات اللازمة للحل", "لحساب أجرة التكسي تحتاج المسافة والتعرفة فقط."),
            it("filtering out information required to solve an identified problem", "تصفية المعلومات وإبقاء اللازم للحل", "لون السيارة واسم السائق لا يغيّران الأجرة، فتستبعدهما.")
          ] },
        { en: "Representing parts of a problem or system in general terms", ar: "تمثيل أجزاء المسألة أو النظام بعبارات عامة", life: "آلة القهوة: الماء والبن مدخلات، والكوب مخرج، والتسخين عملية رئيسة.",
          items: [
            it("variables", "المتغيرات", "رصيد هاتفك يتغير كلما اتصلت أو شحنت."),
            it("constants", "الثوابت", "عدد أيام الأسبوع 7 لا يتغير."),
            it("key processes", "العمليات الرئيسة", "في الصراف الآلي: التحقق من الرقم السري."),
            it("repeated processes", "العمليات المتكررة", "مسح كل غرض على صندوق المحاسبة في السوبرماركت."),
            it("inputs", "المدخلات", "الرقم الذي تكتبه في الآلة الحاسبة."),
            it("outputs", "المخرجات", "الإيصال الذي يطبعه الصراف.")
          ] }
      ],
      map: [null, [0], [0, 1], [0, 0], [0, 2], [0, 3], [1], [2], [2, 0], [2, 1], [3, [0, 1, 4, 5]], [3, [2, 3]]]
    },

    a2: {
      lead: "The uses and implications of software applications in solving problems and fulfilling needs",
      leadAr: "استخدامات التطبيقات البرمجية وآثارها في حل المسائل وتلبية الحاجات.",
      branches: [
        { en: "Gaming and entertainment", ar: "الألعاب والترفيه", life: "لعبة كرة قدم على الهاتف، ومشاهدة مسلسل على منصة بث." },
        { en: "Productivity", ar: "الإنتاجية", life: "جدول بيانات يحسب مصروف البيت الشهري بدل الورقة والقلم." },
        { en: "Information storage and management", ar: "تخزين المعلومات وإدارتها", life: "نظام المدرسة يحفظ علامات كل طالب وحضوره." },
        { en: "Repetitive tasks or dangerous tasks", ar: "المهام المتكررة أو الخطرة", life: "روبوت يفحص أنابيب الغاز بدل أن ينزل العامل إلى مكان خطر." },
        { en: "Social media", ar: "التواصل الاجتماعي", life: "مجموعة الصف على تطبيق المحادثة لتبادل الواجبات." },
        { en: "Search engines", ar: "محركات البحث", life: "تكتب «أقرب صيدلية مناوبة» فتظهر لك النتائج خلال ثانية." }
      ],
      map: [null, null, [0], [0], [1], [2], [3], [4], [5], null]
    },

    a3: {
      lead: "The uses and applications of different types of high- and low-level programming languages",
      leadAr: "استخدامات أنواع لغات البرمجة عالية المستوى ومنخفضة المستوى، وكل نوع صُمم لحل نوع من المسائل.",
      branches: [
        { en: "Types of high- and low-level programming languages", ar: "أنواع اللغات عالية المستوى ومنخفضة المستوى", life: "كما تختار السيارة للمدينة والشاحنة للحمولة، تختار اللغة حسب المسألة.",
          items: [
            it("procedural, e.g. C, Perl, Python", "الإجرائية", "وصفة طبخ: خطوة، ثم خطوة، ثم خطوة."),
            it("object-orientated, e.g. C++, C#, Java", "كائنية التوجه", "كل سيارة في المعرض كائن له لون وسعر، ويستطيع أن يتحرك ويتوقف."),
            it("event-driven, e.g. Visual Basic", "الحدثية", "جرس الباب: لا شيء يحدث حتى يضغط أحد الزر."),
            it("machine, e.g. Assembler", "لغة الآلة", "تعليمات صغيرة جدًا ينفذها المعالج مباشرة، مثل «انقل» و«أضف»."),
            it("mark-up, e.g. HTML", "لغات الترميز", "صفحة موقع المدرسة: عنوان، وفقرة، وصورة، ورابط.")
          ] },
        { en: "Factors to compare and contrast in programming languages", ar: "عوامل المقارنة بين لغات البرمجة", life: "كما تقارن الهواتف بالسعر والبطارية والكاميرا، تقارن اللغات بعوامل ثابتة.",
          items: [
            it("hardware and software needed for running and developing a program", "العتاد والبرمجيات اللازمة للتشغيل والتطوير", "تطبيق iPhone يحتاج جهاز Mac لتطويره."),
            it("special devices required", "الأجهزة الخاصة المطلوبة", "برمجة غسالة ذكية تحتاج لوحة توصيل خاصة بشريحتها."),
            it("performance", "الأداء", "لعبة السباق تحتاج لغة سريعة حتى لا تتقطع الصورة."),
            it("preferred application areas", "مجالات الاستخدام المفضلة", "HTML للمواقع، و C للأنظمة المدمجة في الأجهزة."),
            it("development time", "وقت التطوير", "نموذج تسجيل سريع لفعالية المدرسة يُبنى بلغة نصية في يوم واحد."),
            it("ease of development", "سهولة التطوير", "Python أسهل للمبتدئ من لغة التجميع.")
          ] }
      ],
      map: [[0], [0], [0], [0], [0], [0], [0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0], [1, 3], [1], [1, [0, 1]], [1, 2], [1]]
    },

    a4: {
      lead: "The constructs and techniques involved in the use of programming languages",
      leadAr: "البنى والتقنيات التي تستخدمها لغات البرمجة، وكيف تظهر في لغات مختلفة.",
      branches: [
        { en: "Programming languages, constructs and techniques", ar: "لغات البرمجة وبناها وتقنياتها", life: "كل لغة فيها كلمات أمرية ومتغيرات وأنواع وجمل، كما أن لكل لغة بشرية أفعالًا وأسماء.",
          items: [
            it("command words", "الكلمات الأمرية", "مثل «قف» و«امشِ» في إشارة المشاة: كلمات لها معنى ثابت."),
            it("constants and variables, local and global variables", "الثوابت والمتغيرات، المحلية والعامة", "اسم المدرسة عام يعرفه الجميع، ورقم خزانتك محلي يخصك."),
            it("data types – character, string, integer, real, Boolean", "أنواع البيانات: حرف، سلسلة، صحيح، حقيقي، منطقي", "في بطاقة الهوية: الاسم سلسلة، والعمر عدد صحيح، والطول عدد حقيقي، والجنسية الأردنية نعم أو لا."),
            it("statements – assignment, input and output, sequence, iteration, selection", "الجمل: التعيين، الإدخال والإخراج، التسلسل، التكرار، الاختيار", "إشارة المرور: تتكرر الألوان بالتسلسل، والسائق يختار التوقف عند الأحمر."),
            it("logical operations", "العمليات المنطقية", "تدخل السينما إذا كان معك تذكرة AND كان عمرك مناسبًا.")
          ] },
        { en: "Other constructs", ar: "بنى أخرى", life: "كأدوات الورشة: لكل أداة عمل محدد تعود إليه متى احتجته.",
          items: [
            it("subroutines, functions and procedures", "البرامج الفرعية والدوال والإجراءات", "زر «احسب المجموع» في تطبيق المتجر يُستدعى في كل طلب."),
            it("string handling, including examining single characters and substrings", "معالجة السلاسل والرموز المفردة والسلاسل الجزئية", "أول رقمين من رقم الهاتف 07 يدلّان على أنه رقم خلوي."),
            it("arrays – two-dimensional and three-dimensional, splitting and joining", "المصفوفات ثنائية وثلاثية الأبعاد، والتقسيم والدمج", "جدول الحصص: أيام في صفوف، وحصص في أعمدة."),
            it("file handling – open, read, write, close, database", "التعامل مع الملفات: فتح، قراءة، كتابة، إغلاق، قاعدة بيانات", "تطبيق الملاحظات يفتح الملف، ويحفظ ما كتبت، ثم يغلقه."),
            it("data structures", "هياكل البيانات", "طابور المخبز: من يصل أولًا يأخذ خبزه أولًا."),
            it("event handling", "معالجة الأحداث", "حين تضغط «إرسال» في تطبيق المحادثة، تخرج الرسالة.")
          ] },
        { en: "Documentation of code", ar: "توثيق الكود", life: "دليل تشغيل المكيّف: يشرح لمن يأتي بعدك ماذا يفعل كل زر." }
      ],
      map: [[0], [0, 0], [0, 1], [0, 2], [0, 2], [0, 3], [0, [3, 4]], [1, 0], [1, 0], [1, 1], [1, 2], [1, 4], [1, 4], [1, 3], [1, 3], [1, 5], [2]]
    },

    a5: {
      lead: "The concepts of applying logic to program design",
      leadAr: "مفاهيم تطبيق المنطق في تصميم البرامج.",
      branches: [
        { en: "Iteration", ar: "التكرار", life: "تخمين السعر في المزاد: كل عرض جديد يبدأ من العرض السابق.",
          items: [it("repetition of a computational procedure applied to the result of a previous application", "تكرار إجراء حسابي على ناتج المرة السابقة", "حساب الفائدة شهرًا بعد شهر على رصيد الشهر الذي قبله.")] },
        { en: "Mathematical logic", ar: "المنطق الرياضي", life: "إذا كانت كل الصفوف تبدأ الساعة 8، وصفّك صف، فصفّك يبدأ الساعة 8.",
          items: [
            it("inference", "الاستدلال", "الغيوم سوداء والأرض مبللة، فتستنتج أن المطر نزل."),
            it("consistency", "الاتساق", "لا يصح أن يقول النظام إن الطالب ناجح وراسب في المادة نفسها."),
            it("completeness", "الاكتمال", "نظام الصراف يجب أن يعرف ماذا يفعل في كل حالة، حتى حين ينفد المال."),
            it("verification by truth tables", "التحقق بجداول الحقيقة", "تجرّب كل حالات الدخول: اسم صحيح أو خطأ، وكلمة صحيحة أو خطأ.")
          ] },
        { en: "Propositional dynamic logic", ar: "المنطق الديناميكي الاقتراحي", life: "آلة البيع: من «تنتظر» إلى «استلمت النقود» إلى «أخرجت العلبة».",
          items: [it("to demonstrate the function of algorithms", "لإظهار عمل الخوارزميات", "تتبّع طلبك في تطبيق التوصيل: مُستلم، ثم قيد التحضير، ثم في الطريق.")] },
        { en: "Use of sets", ar: "استخدام المجموعات", life: "طلاب نادي الحاسوب وطلاب نادي الرياضة: من في الناديين معًا؟",
          items: [
            it("properties and interrelationships of sets of data", "خصائص مجموعات البيانات والعلاقات بينها", "الموظفون في قسمين معًا هم تقاطع المجموعتين."),
            it("search/filter sets of data", "البحث في مجموعات البيانات وتصفيتها", "في المتجر الإلكتروني: أحذية، مقاس 42، سعرها أقل من 30 دينارًا.")
          ] }
      ],
      map: [null, [1, 0], [1, 1], [0], [1, 2], [1, 3], [1], [2], [3, [0, 1]]]
    },

    a6: {
      lead: "How the design and implementation of a software application affects quality",
      leadAr: "كيف يؤثر تصميم التطبيق وتنفيذه في جودته.",
      branches: [
        { en: "Efficiency / performance", ar: "الكفاءة والأداء", life: "تطبيق يستنزف بطارية هاتفك في ساعة غير كفء.",
          items: [it("system resources consumed: CPU cycles, processor time, memory space, accessing storage media", "الموارد المستهلكة: دورات المعالج، وزمنه، والذاكرة، والوصول إلى التخزين", "لعبة تحتاج 4 GB من الذاكرة لا تعمل على هاتف قديم.")] },
        { en: "Maintainability", ar: "قابلية الصيانة", life: "مطوّر جديد في الشركة يفهم الكود ويعدّله دون أن يكسر شيئًا.",
          items: [it("corrective, perfective or adaptive maintenance", "صيانة تصحيحية أو تحسينية أو تكيّفية", "تحديث تطبيق البنك: إصلاح خطأ، أو تسريع، أو دعم نظام هاتف جديد.")] },
        { en: "Portability", ar: "قابلية النقل", life: "تطبيق الخرائط يعمل على Android و iPhone والمتصفح.",
          items: [it("hardware, operating systems and platforms", "العتاد وأنظمة التشغيل والمنصات", "برنامج يعمل على Windows و Linux دون إعادة كتابة.")] },
        { en: "Reliability", ar: "الموثوقية", life: "الآلة الحاسبة تعطي 7 × 8 = 56 في كل مرة.",
          items: [it("accuracy and the consistency of its outputs", "دقة المخرجات وثباتها", "ميزان الصيدلية يعطي الوزن نفسه للعلبة نفسها كل مرة.")] },
        { en: "Robustness", ar: "المتانة", life: "تكتب حروفًا في خانة العمر، فيعرض التطبيق رسالة ولا ينهار.",
          items: [it("extreme and erroneous data processed without crashing", "معالجة البيانات المتطرفة والخاطئة دون انهيار", "حجز 999 تذكرة مرة واحدة يُرفض برسالة واضحة.")] },
        { en: "Usability", ar: "سهولة الاستخدام", life: "جدّك يستطيع أن يدفع فاتورة الماء من التطبيق دون مساعدة.",
          items: [it("ease with which an end user can use the program", "سهولة استخدام المستخدم النهائي للبرنامج", "زر «ادفع» كبير وواضح في أسفل الشاشة.")] }
      ],
      map: [null, [0], [0], [1], [2], [3], [3], [4], [5], [5]]
    }
  };
})();
