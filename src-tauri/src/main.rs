#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod models;

use models::SoleActive;

use std::str::FromStr;
use sqlx::{sqlite::{SqliteConnectOptions, SqlitePoolOptions}, SqlitePool, query, query_as};
use chrono::Utc;

struct AppState {
    db: SqlitePool
}

#[tauri::command]
async fn add_new_sole(sole_name: &str, state: tauri::State<'_, AppState>) -> Result<(), ()> {
    query!(
        r#"
        INSERT INTO Sole (id, name, deleted_at)
        VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM Sole), $1, NULL)
        "#,
        sole_name
    )
    .execute(&state.db).await.unwrap();

    let max_id: Option<i64> = sqlx::query_scalar(
        "SELECT MAX(id) FROM Sole"
    )
    .fetch_optional(&state.db)
    .await.unwrap();

    let sole_id = max_id.unwrap_or(0);

    for size in 33..=44 {
        query!(
            r#"
            INSERT INTO Orders (sole_id, size, amount) VALUES ($1, $2, 0)
            "#,
            sole_id,
            size
        )
        .execute(&state.db).await.unwrap();
    
        query!(
            r#"
            INSERT INTO Stock (sole_id, size, amount) VALUES ($1, $2, 0)
            "#,
            sole_id,
            size
        )
        .execute(&state.db).await.unwrap();
    }

    Ok(())
}

#[tauri::command]
async fn get_soles(state: tauri::State<'_, AppState>) -> Result<Vec<SoleActive>, ()> {
    let result = query_as!(SoleActive,
        "SELECT id, name FROM Sole where deleted_at IS NULL"
    )
    .fetch_all(&state.db).await.unwrap();
    
    Ok(result)
}

#[tauri::command]
async fn soft_delete_sole(id: i64, state: tauri::State<'_, AppState>) -> Result<(), ()> {
    let date_now = Utc::now();
    
    query!(
        "UPDATE Sole SET deleted_at = $1 WHERE id = $2",
        date_now,
        id
    )
    .execute(&state.db)
    .await
    .unwrap();

    Ok(())
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

            db
        }),
        Err(e) => panic!("error creating runtime"),
    };

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_new_sole, get_soles, soft_delete_sole])
        .manage(AppState {db})
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
