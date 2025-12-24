use axum::extract::Request;
use axum::http::StatusCode;
use axum::{extract::Path, routing::post, Router};

pub fn router() -> Router {
    Router::new().route("/{id}", post(users_id))
}

async fn users_id(Path(_id): Path<String>, _req: Request) -> StatusCode {
    StatusCode::OK
}
