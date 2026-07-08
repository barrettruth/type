default:
    @just --list

run:
    trunk serve

build:
    trunk build --release

format:
    cargo fmt --all -- --check

lint:
    cargo clippy --target wasm32-unknown-unknown -- -D warnings

ci: format lint build
    @:
