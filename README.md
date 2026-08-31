# Hanji

Hanji is a visual HSK 1 Chinese word game powered by **Rust and Axum**. The Rust
function serves the interface, validates and returns the study deck, exposes a
health endpoint, and delivers the self-hosted hint image.

## Stack

- [Rust](https://www.rust-lang.org/) 2024 edition
- [Axum](https://github.com/tokio-rs/axum) for routing and responses
- [Vercel Rust Runtime](https://vercel.com/docs/functions/runtimes/rust)
- Serde and serde_json for typed word-deck validation
- Monthly dependency updates from Dependabot
- A small dependency-free browser layer for accessible game interaction

## Project structure

- `api/hanji.rs` — Axum application and Vercel function entrypoint
- `web/` — HTML, CSS, browser interaction, and the shared word deck
- `public/` — self-hosted visual assets
- `vercel.json` — sends application routes to the Rust function
- `scripts/` — static Sites build and validation

The same `web/content.json` file powers both deployments. Rust deserializes it
into typed structures before returning it to the browser.

## Run and verify

```bash
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test
vercel dev
```

Use `make check` to validate the browser assets and produce the static mirror
in `dist/`.

## Deploy on Vercel

1. Import `lazybuttrying/chinese`.
2. Select the **Rust** framework preset shown in Vercel.
3. Keep the repository root as the root directory.
4. Deploy. No environment variables are required.

Vercel compiles `api/hanji.rs` through the Rust runtime. The rewrite in
`vercel.json` lets Axum handle the page, assets, `/content.json`, and
`/api/health`.

## Add words

Edit `web/content.json`. Every quiz question needs four choices and must include
its own Hanzi answer. Each wordbook entry includes an English radical name and
description.
