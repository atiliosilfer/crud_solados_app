#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod models;

use chrono::Utc;
use models::OrderActive;
use models::SoleActive;
use models::Stock;
use sqlx::{
    query, query_as,
    sqlite::{SqliteConnectOptions, SqlitePoolOptions},
    SqlitePool,
};
use std::str::FromStr;

struct AppState {
    db: SqlitePool,
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
    .execute(&state.db)
    .await
    .unwrap();

    let max_id: Option<i64> = sqlx::query_scalar("SELECT MAX(id) FROM Sole")
        .fetch_optional(&state.db)
        .await
        .unwrap();

    let sole_id = max_id.unwrap_or(0);

    for size in 33..=44 {
        query!(
            r#"
            INSERT INTO Orders (sole_id, size, amount) VALUES ($1, $2, 0)
            "#,
            sole_id,
            size
        )
        .execute(&state.db)
        .await
        .unwrap();

        query!(
            r#"
            INSERT INTO Stock (sole_id, size, amount) VALUES ($1, $2, 0)
            "#,
            sole_id,
            size
        )
        .execute(&state.db)
        .await
        .unwrap();
    }

    Ok(())
}

#[tauri::command]
async fn get_soles(state: tauri::State<'_, AppState>) -> Result<Vec<SoleActive>, ()> {
    let result = query_as!(
        SoleActive,
        "SELECT id, name FROM Sole where deleted_at IS NULL"
    )
    .fetch_all(&state.db)
    .await
    .unwrap();

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

#[tauri::command]
async fn get_orders(id: i64, state: tauri::State<'_, AppState>) -> Result<Vec<OrderActive>, ()> {
    let result = query_as!(
        OrderActive,
        "SELECT sole_id AS \"sole_id!\", amount as \"amount!\", size as \"size!\" FROM Orders where sole_id = $1 and deleted_at IS NULL",
        id
    )
    .fetch_all(&state.db)
    .await
    .unwrap();

    Ok(result)
}

#[tauri::command]
async fn get_stocks(id: i64, state: tauri::State<'_, AppState>) -> Result<Vec<Stock>, ()> {
    let result = query_as!(
        Stock,
        "SELECT sole_id AS \"sole_id!\", amount as \"amount!\", size as \"size!\" 
        FROM Stock where sole_id = $1",
        id
    )
    .fetch_all(&state.db)
    .await
    .unwrap();

    Ok(result)
}

#[tauri::command]
async fn add_sole_stock(
    id: i64,
    stocks: Vec<Stock>,
    state: tauri::State<'_, AppState>,
) -> Result<(), ()> {
    for element in stocks.iter() {
        query!(
            "UPDATE Stock SET amount = COALESCE(amount, 0) + $1 WHERE sole_id = $2 and size = $3",
            element.amount,
            id,
            element.size
        )
        .execute(&state.db)
        .await
        .unwrap();
    }

    Ok(())
}

#[tauri::command]
async fn add_sole_orders(
    id: i64,
    orders: Vec<OrderActive>,
    state: tauri::State<'_, AppState>,
) -> Result<(), ()> {
    for element in orders.iter() {
        query!(
            "UPDATE Orders SET amount = COALESCE(amount, 0) + $1 WHERE sole_id = $2 and size = $3",
            element.amount,
            id,
            element.size
        )
        .execute(&state.db)
        .await
        .unwrap();
    }

    Ok(())
}

#[tauri::command]
async fn reset_orders(id: i64, state: tauri::State<'_, AppState>) -> Result<(), ()> {
    for size in 33..=44 {
        query!(
            "UPDATE Stock SET amount = 
            (SELECT (amount - COALESCE((SELECT SUM(amount) FROM Orders WHERE Orders.sole_id = Stock.sole_id AND Orders.size = Stock.size AND Orders.deleted_at IS NULL), 0))
            FROM Stock WHERE Stock.sole_id = $1 and Stock.size = $2) WHERE Stock.sole_id = $3 and Stock.size = $4;",
            id,
            size,
            id,
            size
        )
        .execute(&state.db)
        .await
        .unwrap();
    }

    let date_now = Utc::now();

    query!(
        "UPDATE Orders SET deleted_at = $1 WHERE sole_id = $2",
        date_now,
        id
    )
    .execute(&state.db)
    .await
    .unwrap();

    for size in 33..=44 {
        query!(
            r#"
            INSERT INTO Orders (sole_id, size, amount) VALUES ($1, $2, 0)
            "#,
            id,
            size
        )
        .execute(&state.db)
        .await
        .unwrap();
    }

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

            sqlx::migrate!("./migrations").run(&db).await.unwrap();

            db
        }),
        Err(e) => panic!("error creating runtime"),
    };

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            add_new_sole,
            get_soles,
            soft_delete_sole,
            get_orders,
            get_stocks,
            add_sole_stock,
            add_sole_orders,
            reset_orders
        ])
        .manage(AppState { db })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
