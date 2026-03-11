use crate::error::AppResult;
use crate::services::document_service::DocumentService;

#[tauri::command]
pub async fn convert_text_to_pdf(input_path: String, output_path: String) -> AppResult<String> {
    let value = output_path.clone();
    tokio::task::spawn_blocking(move || {
        DocumentService::convert_text_to_pdf(&input_path, &value)
    })
    .await
    .map_err(|e: tokio::task::JoinError| crate::error::AppError::Unknown(e.to_string()))??;

    Ok(format!("Successfully rendered PDF to {}", output_path))
}
