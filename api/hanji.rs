use axum::http::{StatusCode, Uri, header};
use axum::response::{Html, IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use bytes::Bytes;
use serde::{Deserialize, Serialize};
use tower::ServiceBuilder;
use vercel_runtime::Error;
use vercel_runtime::axum::VercelLayer;

const INDEX_HTML: &str = include_str!("../web/index.html");
const STYLES_CSS: &str = include_str!("../web/styles.css");
const APP_JS: &str = include_str!("../web/app.js");
const CONTENT_JSON: &str = include_str!("../web/content.json");
const FAVICON: &str = include_str!("../public/favicon.svg");
const HINT_IMAGE: &[u8] = include_bytes!("../public/hsk-hint-panels.png");

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct Question {
    id: String,
    hanzi: String,
    pinyin: String,
    meaning: String,
    prompt: String,
    choices: Vec<String>,
    hint_position: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct WordbookEntry {
    hanzi: String,
    pinyin: String,
    meaning: String,
    radical: String,
    radical_name: String,
    radical_description: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct AppContent {
    questions: Vec<Question>,
    wordbook: Vec<WordbookEntry>,
}

async fn home() -> impl IntoResponse {
    (
        [
            (header::CACHE_CONTROL, "public, max-age=300"),
            (header::CONTENT_TYPE, "text/html; charset=utf-8"),
        ],
        Html(INDEX_HTML),
    )
}

async fn styles() -> impl IntoResponse {
    (
        [
            (header::CACHE_CONTROL, "public, max-age=86400"),
            (header::CONTENT_TYPE, "text/css; charset=utf-8"),
        ],
        STYLES_CSS,
    )
}

async fn script() -> impl IntoResponse {
    (
        [
            (header::CACHE_CONTROL, "public, max-age=86400"),
            (header::CONTENT_TYPE, "text/javascript; charset=utf-8"),
        ],
        APP_JS,
    )
}

async fn content() -> Response {
    match serde_json::from_str::<AppContent>(CONTENT_JSON) {
        Ok(payload) => (
            [
                (header::CACHE_CONTROL, "public, max-age=3600"),
                (header::CONTENT_TYPE, "application/json; charset=utf-8"),
            ],
            Json(payload),
        )
            .into_response(),
        Err(error) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Content validation failed: {error}"),
        )
            .into_response(),
    }
}

async fn hint_image() -> impl IntoResponse {
    (
        [
            (header::CACHE_CONTROL, "public, max-age=604800, immutable"),
            (header::CONTENT_TYPE, "image/png"),
        ],
        Bytes::from_static(HINT_IMAGE),
    )
}

async fn favicon() -> impl IntoResponse {
    (
        [
            (header::CACHE_CONTROL, "public, max-age=604800"),
            (header::CONTENT_TYPE, "image/svg+xml"),
        ],
        FAVICON,
    )
}

async fn health() -> impl IntoResponse {
    Json(serde_json::json!({
        "service": "hanji",
        "runtime": "rust",
        "framework": "axum",
        "status": "ok"
    }))
}

async fn fallback(uri: Uri) -> impl IntoResponse {
    (
        StatusCode::NOT_FOUND,
        format!("Hanji has no page at {}", uri.path()),
    )
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let router = Router::new()
        .route("/", get(home))
        .route("/styles.css", get(styles))
        .route("/app.js", get(script))
        .route("/content.json", get(content))
        .route("/hsk-hint-panels.png", get(hint_image))
        .route("/favicon.svg", get(favicon))
        .route("/api/health", get(health))
        .fallback(fallback);

    let app = ServiceBuilder::new()
        .layer(VercelLayer::new())
        .service(router);

    vercel_runtime::run(app).await
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn embedded_study_deck_is_valid() {
        let content: AppContent =
            serde_json::from_str(CONTENT_JSON).expect("content.json should deserialize");

        assert_eq!(content.questions.len(), 4);
        assert_eq!(content.wordbook.len(), 20);

        for question in content.questions {
            assert_eq!(question.choices.len(), 4);
            assert!(question.choices.contains(&question.hanzi));
        }
    }
}
