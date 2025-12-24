mod auth;
mod users;

use axum::Router;

pub fn router() -> Router {
    Router::new()
        .merge(
            Router::new()
                .nest("/auth", auth::router())
                .nest("/users", users::router()),
        )
        .nest("/graphql", Router::new())
}
