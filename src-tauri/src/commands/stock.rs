use sqlx::{query, query_as};

use crate::{models::stock::Stock, AppState};

#[tauri::command]
pub async fn get_stocks(id: i64, state: tauri::State<'_, AppState>) -> Result<Vec<Stock>, ()> {
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
pub async fn add_sole_stock(
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
