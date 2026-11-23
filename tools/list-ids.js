const fs = require("fs");
const path = require("path");

function walk(dir, acc) {
  fs.readdirSync(dir).forEach(function (name) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      if (name === "node_modules" || name === "tools") return;
      walk(full, acc);
      return;
    }
    if (/\.(js|html|css)$/.test(name)) acc.push(full);
  });
}

const files = [];
walk(".", files);
const text = files.map(function (file) { return fs.readFileSync(file, "utf8"); }).join("\n");
const ids = new Set();
const re = /["']([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*)["']/g;
let match;
while ((match = re.exec(text))) {
  const id = match[1];
  if (/^(S0|FIN|A[1-6])-/.test(id)) ids.add(id);
}
const list = Array.from(ids).sort();
console.log("COUNT " + list.length);
console.log(list.join("\n"));
