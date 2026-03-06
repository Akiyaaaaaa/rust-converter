use crate::error::AppResult;
use crate::services::document_service::DocumentService;

#[tauri::command]
pub async fn convert_text_to_pdf(input_path: String, output_path: String) -> AppResult<String> {
    tokio::task::spawn_blocking(move || {
        DocumentService::convert_text_to_pdf(&input_path, &output_path)
    })
    .await
    .map_err(|e| crate::error::AppError::Unknown(e.to_string()))??;

    Ok(format!("Successfully rendered PDF to {}", output_path))
}
