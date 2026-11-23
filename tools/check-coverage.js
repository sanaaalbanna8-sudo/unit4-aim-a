const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const planPath = path.join(root, "docs", "PLAN.md");
const plan = fs.readFileSync(planPath, "utf8");
const parts = plan.split(/^## Identifiers\s*$/m);
if (parts.length < 2) {
  console.log("لا يوجد قسم Identifiers في docs/PLAN.md");
  process.exit(1);
}
const body = parts[1].split(/^## /m)[0];
const ids = [];
body.split(/\r?\n/).forEach(function (line) {
  const match = line.match(/^([A-Z][A-Z0-9-]*)\s*$/);
  if (match) ids.push(match[1]);
});

function walk(dir, acc) {
  fs.readdirSync(dir).forEach(function (name) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      if (name === "node_modules" || name === "docs") return;
      walk(full, acc);
      return;
    }
    if (!/\.(html|js|css)$/.test(name)) return;
    if (name === "check-coverage.js" || name === "list-ids.js" || name === "build-plan.js") return;
    acc.push(full);
  });
}

const files = [];
walk(root, files);
const text = files.map(function (file) { return fs.readFileSync(file, "utf8"); }).join("\n");
const missing = ids.filter(function (id) {
  const pattern = new RegExp("(^|[^A-Z0-9-])" + id.replace(/-/g, "\\-") + "($|[^A-Z0-9-])");
  return !pattern.test(text);
});

if (!missing.length) {
  console.log("كل المعرفات ظاهرة: " + ids.length);
  process.exit(0);
}
missing.forEach(function (id) { console.log(id); });
process.exit(1);
