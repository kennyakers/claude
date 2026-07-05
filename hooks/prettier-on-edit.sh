#!/usr/bin/env bash
# PostToolUse hook: auto-format the just-edited file with Prettier.
#
# Reads the tool-event JSON from stdin, extracts the edited file path + cwd,
# and runs `pnpm exec prettier --write` on the file from cwd. Silent on
# failure so projects without Prettier (or with a Prettier disagreement) do
# not block Claude.

set -u

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')
cwd=$(printf '%s' "$input" | jq -r '.cwd // empty')

[ -z "$file" ] && exit 0
[ -z "$cwd" ] && exit 0

case "$file" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.json|*.md|*.mdx|*.css|*.scss|*.yaml|*.yml|*.html) ;;
  *) exit 0 ;;
esac

# Never format files inside the user's Claude config directory.
case "$file" in
  "$HOME/.claude/"*) exit 0 ;;
esac

(cd "$cwd" && pnpm exec prettier --write --log-level error "$file") >/dev/null 2>&1 || true
exit 0
