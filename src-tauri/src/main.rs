#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod models;

use sqlx::{
    sqlite::{SqliteConnectOptions, SqlitePoolOptions},
    SqlitePool,
};
use std::str::FromStr;

use crate::commands::order;
use crate::commands::sole;
use crate::commands::stock;

pub struct AppState {
    db: SqlitePool,
}

fn main() {
    let db = match tokio::runtime::Runtime::new() {
        Ok(runtime) => runtime.block_on(async {
            let db_connection_options = SqliteConnectOptions::from_str("sqlite:storage.sqlite")
                .unwrap()
                .create_if_missing(true);

            let db = SqlitePoolOptions::new()
                .connect_with(db_connection_options)
                .await
                .unwrap();

            sqlx::migrate!("./migrations").run(&db).await.unwrap();

            db
        }),
        Err(_e) => panic!("error creating runtime"),
    };

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            sole::add_new_sole,
            sole::get_soles,
            sole::soft_delete_sole,
            order::get_orders,
            order::add_sole_orders,
            order::reset_orders,
            stock::get_stocks,
            stock::add_sole_stock,
        ])
        .manage(AppState { db })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
