#!/usr/bin/env node
// PreToolUse[Write] soft gate: first attempt to create a NEW source file is denied
// with a reminder to find an existing home; repeating the same Write is allowed.
const fs = require("fs");
const os = require("os");
const path = require("path");

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let out = null;
  try {
    const j = JSON.parse(raw);
    const p = j.tool_input && j.tool_input.file_path;
    const isSource = p && /\.(ts|tsx|js|jsx)$/.test(p);
    const isExempt =
      p &&
      /(\.test\.|\.spec\.|\.stories\.|__tests__|__mocks__|migrations|\.claude|\.planning|\bscripts\/|\.config\.|\.d\.ts$)/.test(
        p
      );
    if (isSource && !isExempt && !fs.existsSync(p)) {
      const marker = path.join(
        os.tmpdir(),
        `claude-new-file-gate-${j.session_id || "na"}.json`
      );
      let seen = [];
      try {
        seen = JSON.parse(fs.readFileSync(marker, "utf8"));
      } catch {}
      if (!seen.includes(p)) {
        seen.push(p);
        try {
          fs.writeFileSync(marker, JSON.stringify(seen));
        } catch {}
        out = {
          hookSpecificOutput: {
            hookEventName: "PreToolUse",
            permissionDecision: "deny",
            permissionDecisionReason:
              `NEW FILE GATE — ${p} would be a brand-new source file. ` +
              `Ken's rule: never a new file for one small function or thin wrapper; find the existing module that should absorb this (grep for related utils/components/services first). ` +
              `If after checking a new file is genuinely required, repeat the exact same Write — it will be allowed — and be ready to justify why no existing home fit.`,
          },
        };
      }
    }
  } catch {}
  if (out) process.stdout.write(JSON.stringify(out));
  process.exit(0);
});
