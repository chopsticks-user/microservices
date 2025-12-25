FROM rust:alpine AS builder
WORKDIR /app

COPY . .
RUN cargo build --release

FROM alpine:latest
WORKDIR /app

RUN apk add --no-cache ca-certificates

RUN adduser -D app
USER app

COPY --from=builder /app/target/release/microservices-api-gateway .

EXPOSE 8080
ENTRYPOINT ["./microservices-api-gateway"]