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
