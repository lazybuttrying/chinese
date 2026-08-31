#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_dir="$project_dir/dist"

if [[ ! -f "$project_dir/Cargo.toml" || ! -f "$project_dir/web/index.html" ]]; then
  echo "Run this script from the Hanji project checkout." >&2
  exit 1
fi

mkdir -p "$output_dir"
find "$output_dir" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +

install -m 0644 "$project_dir/web/index.html" "$output_dir/index.html"
install -m 0644 "$project_dir/web/styles.css" "$output_dir/styles.css"
install -m 0644 "$project_dir/web/app.js" "$output_dir/app.js"
install -m 0644 "$project_dir/web/content.json" "$output_dir/content.json"
install -m 0644 "$project_dir/public/favicon.svg" "$output_dir/favicon.svg"
install -m 0644 "$project_dir/public/hsk-hint-panels.png" "$output_dir/hsk-hint-panels.png"
