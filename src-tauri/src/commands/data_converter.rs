use crate::error::{AppResult, AppError};
use crate::services::data_service::DataService;
use std::path::Path;

#[tauri::command]
pub async fn convert_data(input_path: String) -> AppResult<String> {
    let path = Path::new(&input_path);
    let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("").to_lowercase();

    // Move heavy parsing to a blocking task to avoid locking the async runtime
    let result = tokio::task::spawn_blocking(move || {
        match ext.as_str() {
            "xlsx" | "xls" => DataService::convert_excel_to_json(&input_path),
            "csv" => DataService::convert_csv_to_json(&input_path),
            _ => Err(AppError::DataConversion("Unsupported file extension. Please use .xlsx or .csv.".into())),
        }
    })
    .await
    .map_err(|e| AppError::Unknown(e.to_string()))??;

    Ok(result)
}
