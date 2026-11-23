const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const sandbox = { window: {}, console: console };
vm.runInNewContext(fs.readFileSync(path.join(root, "js", "data.js"), "utf8"), sandbox);
const dict = sandbox.window.DICT;

function walk(dir, acc) {
  fs.readdirSync(dir).forEach(function (name) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      if (name === "node_modules" || name === "tools" || name === "docs" || name === "fonts") return;
      walk(full, acc);
      return;
    }
    if (/\.(js|html|css)$/.test(name)) acc.push(full);
  });
}
const files = [];
walk(root, files);
const text = files.map(function (file) { return fs.readFileSync(file, "utf8"); }).join("\n");
const ids = new Set();
const re = /["']([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*)["']/g;
let match;
while ((match = re.exec(text))) {
  if (/^(S0|FIN|A[1-6])-/.test(match[1])) ids.add(match[1]);
}
const list = Array.from(ids).sort();

function place(id) {
  const station = id.startsWith("S0") ? "المحطة ٠" : id.startsWith("FIN") ? "محلل البرنامج" : id.slice(0, 2);
  if (/-H-/.test(id)) return station + " — تلميح";
  if (/-Q$/.test(id)) return station + " — سؤال";
  return station + " — عنصر";
}

const rows = list.map(function (id) { return "| " + id + " | " + place(id) + " |"; }).join("\n");
const dictRows = Object.keys(dict).sort().map(function (key) {
  const term = dict[key];
  return "| " + term.label + " | " + term.speech + " | " + term.sentenceEn.replace(/\|/g, "/") + " | " + term.meaningAr.replace(/\|/g, "/") + " |";
}).join("\n");

const plan = [
  "# الخطة المعتمدة",
  "",
  "الموقع التعليمي للوحدة ٤، الهدف أ. الخطاب للصف كله بصيغة محايدة. العربية أولًا والإنجليزية تحتها.",
  "",
  "## المحطات",
  "",
  "| المحطة | التجارب | البطاقات | التلميحات |",
  "| --- | --- | --- | --- |",
  "| ٠ | سؤال من يستخدم ومن يبني، ثم الخريطة | — | — |",
  "| A1 | التفكيك، الأنماط والتعميم والتجريد، المتغير والثابت | ٦ | ٤ |",
  "| A2 | اختيار عشرة تطبيقات | ٩: ترخيص، منصة، ألعاب، ترفيه، إنتاجية، تخزين، مهام خطرة، تواصل، محركات بحث موسومة إضافي | ٤١ |",
  "| A3 | مختبر الأنظمة العددية، اختيار النموذج | ١٥ ضمن ثلاث مجموعات: من الآلة إلى اللغة، النماذج، المقارنة والسلوك المهني | ١٩ |",
  "| A4 | الهياكل الثلاثة، الوحدات، المصفوفات، المكدس والطابور، السجل | ١٢ | ٨ |",
  "| A5 | جدول الحقيقة، مخطط فن مع التصفية | ٧ | ٢ |",
  "| A6 | رادار الصفات الست | ٩ ومنها الكفاءة والأنظمة الآنية | ٣ |",
  "| المحلل | برنامج الشحن، ورادار بسبعة محاور، ومفتاح C# و C | — | — |",
  "",
  "## قرارات المحتوى",
  "",
  "- جدول الحقيقة ثمانية صفوف تُولَّد في الكود. صف ناجح واحد والباقي سبعة. L = (U·P)·¬O.",
  "- المصفوفة: كل محطة لها ٢١ قراءة (٣ أسابيع × ٧ أيام). week[1][4] = 21.00 و days[4] = 17.70.",
  "- بايتات BTEC Student موسومة بايتات النص: 42 54 45 43 20 53 74 75 64 65 6E 74.",
  "- بايتات 8086 مثال تعليمي: B8 02 00 و 05 04 00 و CD 20.",
  "- تسرب الذاكرة: النسيان في التحرير اليدوي سبب شائع. الجمع التلقائي يمنعه وقد يوقف التنفيذ لحظة. قد يبقى تسرب إن بقيت مراجع غير مستخدمة.",
  "- الشحن: حد الطلب ٥٠ وحد المسافة ٢٦. المجاني إذا تجاوز الطلب الحد وكانت المسافة أقل من الحد.",
  "- فروق اللغتين ثلاثة فقط: كتابة قوية مقابل ضمنية، وغياب النوع المنطقي في C، وجمع البيانات مقابل التحرير اليدوي.",
  "- رادار A6 ستة محاور. المحور السابع، تلبية متطلبات المستخدم، في المحلل فقط.",
  "- الإجابات مخفية حتى زر الكشف. الدرجة تُحسب للصحيح قبل الكشف.",
  "- لقطات الشاشة تُستبدل من window.SHOTS بلا تعديل للكود.",
  "",
  "## التغطية",
  "",
  "| المعرّف | الموضع |",
  "| --- | --- |",
  rows,
  "",
  "## Identifiers",
  "",
  list.join("\n"),
  "",
  "## القاموس DICT",
  "",
  "| المصطلح | اللفظ المنطوق | الجملة الإنجليزية | المعنى |",
  "| --- | --- | --- | --- |",
  dictRows,
  ""
].join("\n");

fs.mkdirSync(path.join(root, "docs"), { recursive: true });
fs.writeFileSync(path.join(root, "docs", "PLAN.md"), plan, "utf8");
console.log("ids " + list.length + " terms " + Object.keys(dict).length);
