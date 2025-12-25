use axum::{
    extract::{Path, Request},
    http::StatusCode,
    routing::post,
    Router,
};

pub fn router() -> Router {
    Router::new()
        // .layer(middlewares::authorize)
        .route("/{id}", post(users_id))
}

async fn users_id(Path(_id): Path<String>, _req: Request) -> StatusCode {
    StatusCode::OK
}
