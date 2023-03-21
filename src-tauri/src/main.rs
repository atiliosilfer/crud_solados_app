#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::str::FromStr;
use sqlx::{sqlite::{SqliteConnectOptions, SqlitePoolOptions}, SqlitePool};

struct AppState {
    db: SqlitePool
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str, state: tauri::State<AppState>) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let db = match tokio::runtime::Runtime::new() {
        Ok(runtime) => runtime.block_on(async {
            let db_connection_options = SqliteConnectOptions::from_str("sqlite:teste.db")
                .unwrap()
                .create_if_missing(true);

            let db = SqlitePoolOptions::new()
                .connect_with(db_connection_options)
                .await
                .unwrap();

            db
        }),
        Err(e) => panic!("error creating runtime"),
    };

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .manage(AppState {db})
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
