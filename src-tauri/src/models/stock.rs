use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Stock {
    pub sole_id: i64,
    pub size: i64,
    pub amount: i64,
}
