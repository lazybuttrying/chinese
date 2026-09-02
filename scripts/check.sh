#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

node --check "$project_dir/web/app.js"
jq --exit-status '
  (.questions | length) == 40
  and (.wordbook | length) == 40
  and all(.questions[]; . as $question
    | ($question.choices | length) == 4
    and ($question.choices | index($question.hanzi)) != null)
' "$project_dir/web/content.json" >/dev/null

grep -q 'name="codex-preview" content="development"' "$project_dir/web/index.html"
grep -q 'Powered by Rust + Axum' "$project_dir/web/index.html"
grep -q 'VercelLayer::new()' "$project_dir/src/main.rs"

bash "$project_dir/scripts/build-static.sh"

for asset in index.html styles.css app.js content.json favicon.svg hsk-hint-panels.png; do
  test -s "$project_dir/dist/$asset"
done
