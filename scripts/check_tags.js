const fs = require("fs");
let s = fs.readFileSync("client/src/components/AVAChatBox.tsx", "utf8");
function stripJS(s) {
  let out = "";
  let i = 0;
  while (i < s.length) {
    let c = s[i];
    if (c === '"' || c === "'" || c === "`") {
      let q = c;
      out += c;
      i++;
      while (i < s.length) {
        let d = s[i++];
        out += d;
        if (d === "\\") {
          out += s[i++] || "";
          continue;
        }
        if (d === q) break;
      }
    } else if (c === "{") {
      out += c;
      i++;
      let depth = 1;
      while (i < s.length && depth > 0) {
        let d = s[i++];
        if (d === "{") depth++;
        else if (d === "}") depth--;
      }
    } else {
      out += c;
      i++;
    }
  }
  return out;
}
let clean = stripJS(s);
const pattern = /<(\/)?([A-Za-z0-9_\-\.]+)([^>]*)?(\/?)>/g;
let stack = [];
let m;
while ((m = pattern.exec(clean))) {
  const closing = !!m[1];
  const tag = m[2];
  const selfclose = !!m[4];
  const line = clean.substring(0, m.index).split("\n").length;
  if (!closing && !selfclose && /^[A-Za-z]/.test(tag))
    stack.push({ tag, line });
  else if (closing) {
    if (!stack) {
      console.log("Unmatched closing", tag, "at", line);
      process.exit(0);
    }
    const last = stack.pop();
    if (last.tag !== tag) {
      console.log(
        "Mismatch: expected closing for",
        last.tag,
        "(opened at",
        last.line,
        "), but found closing",
        tag,
        "at",
        line
      );
      process.exit(0);
    }
  }
}
if (stack.length)
  console.log("Unclosed tags at end (first 10):", stack.slice(0, 10));
else console.log("All tags matched");
