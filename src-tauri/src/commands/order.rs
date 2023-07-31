use chrono::Utc;
use sqlx::{query, query_as};

use crate::{models::order::OrderActive, AppState};

#[tauri::command]
pub async fn add_sole_orders(
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
pub async fn get_orders(
    id: i64,
    state: tauri::State<'_, AppState>,
) -> Result<Vec<OrderActive>, ()> {
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
pub async fn reset_orders(id: i64, state: tauri::State<'_, AppState>) -> Result<(), ()> {
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

    println!("update stock {}", id);

    let date_now = Utc::now();

    query!(
        "UPDATE Orders SET deleted_at = $1 WHERE sole_id = $2",
        date_now,
        id
    )
    .execute(&state.db)
    .await
    .unwrap();

    println!("soft delete Orders {}", id);

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

    println!("insert Orders {}", id);

    Ok(())
}
