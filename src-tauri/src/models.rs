use chrono::NaiveDate;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Sole {
    pub id: i64,
    pub name: String,
    pub deleted_at: Option<NaiveDate>,
}

#[derive(Serialize, Deserialize)]
pub struct SoleActive {
    pub id: i64,
    pub name: String,
}

#[derive(Serialize, Deserialize)]
pub struct OrderActive {
    pub sole_id: i64,
    pub size: i64,
    pub amount: i64,
}

#[derive(Serialize, Deserialize)]
pub struct Order {
    pub sole_id: i64,
    pub size: i64,
    pub amount: i64,
    pub deleted_at: Option<NaiveDate>,
}

#[derive(Serialize, Deserialize)]
pub struct Stock {
    pub sole_id: i64,
    pub size: i64,
    pub amount: i64,
}
