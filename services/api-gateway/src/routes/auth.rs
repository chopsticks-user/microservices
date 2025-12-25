use axum::{extract::Json, routing::post, Router};
use chrono::{prelude::*, Duration};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub fn router() -> Router {
    Router::new()
        .route("/login", post(login))
        .route("/logout", post(logout))
        .route("/signup", post(signup))
        .route("/refresh", post(refresh))
        .route("/reset-password", post(reset_password))
        .route("/forgot-password", post(forgot_password))
}

#[derive(Deserialize)]
struct LoginData {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
enum Role {
    Admin,
    User,
}

#[derive(Serialize, Deserialize)]
struct Claims {
    pub expiry_time: usize,
    pub issued_at: usize,
    pub email: String,
    pub role: Role,
}

#[derive(Serialize, Deserialize)]
struct JwtTokens {
    access: String,
    refresh: String,
}

async fn login(
    Json(login_data): Json<LoginData>,
) -> Result<Json<JwtTokens>, axum::http::StatusCode> {
    // todo: retrieve user info from db

    // todo: verify password

    let secret = std::env::var("JWT_SECRET")
        .expect("JWT_SECRET must be set")
        .to_string();
    let now = Utc::now();
    let claims = Claims {
        expiry_time: (now + Duration::minutes(15)).timestamp() as usize,
        issued_at: now.timestamp() as usize,
        email: login_data.email,
        role: Role::User,
    };
    let tokens = JwtTokens {
        access: encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(secret.as_ref()),
        )
        .unwrap(),
        refresh: Uuid::new_v4().to_string(),
    };

    Ok(Json(tokens))
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
