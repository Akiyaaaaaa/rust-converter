use crate::error::AppResult;
use crate::services::image_service::ImageService;

#[tauri::command]
pub async fn convert_images(
    input_paths: Vec<String>,
    output_dir: String,
) -> AppResult<Vec<String>> {
    // Run CPU-intensive multi-threaded rendering in blocking task
    let result = tokio::task::spawn_blocking(move || {
        ImageService::batch_convert_to_webp(input_paths, output_dir, 80)
    })
    .await
    .map_err(|e| crate::error::AppError::Unknown(e.to_string()))??;

    Ok(result)
}
