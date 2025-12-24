use axum::{routing::post, Router};

pub fn router() -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/logout", post(logout))
        .route("/signup", post(signup))
        .route("/refresh", post(refresh))
        .route("/reset-password", post(reset_password))
        .route("/forgot-password", post(forgot_password))
}

async fn login() -> &'static str {
    "/auth/login"
}

async fn logout() -> &'static str {
    "/auth/logout"
}

async fn signup() -> &'static str {
    "/auth/signup"
}

async fn refresh() -> &'static str {
    "/auth/signup"
}

async fn reset_password() -> &'static str {
    "/auth/reset-password"
}

async fn forgot_password() -> &'static str {
    "/auth/forgot-password"
}
