use crate::error::AppResult;
use image::ImageFormat;
use rayon::prelude::*;
use std::path::Path;

pub struct ImageConverterService;

impl ImageConverterService {
    /// Batch converts multiple images to a target format using Rayon for multi-threading.
    /// This represents the pure business logic, decoupled from Tauri IPC.
    pub fn batch_convert(
        input_paths: Vec<String>,
        output_dir: String,
        target_format: ImageFormat,
        quality: u8,
    ) -> AppResult<Vec<String>> {
        let output_path = Path::new(&output_dir);
        
        // Ensure output directory exists (Adapter layer usually handles this, simplified here)
        if !output_path.exists() {
            std::fs::create_dir_all(output_path)?;
        }

        // Rayon parallel iterator spreads the image processing load across available CPU cores
        let results: Result<Vec<String>, _> = input_paths
            .par_iter()
            .map(|input_str| {
                let input_path = Path::new(input_str);
                
                // Open and decode the image
                let img = image::open(&input_path)?;
                
                // Generate new filename
                let file_stem = input_path
                    .file_stem()
                    .and_then(|s| s.to_str())
                    .unwrap_or("image");
                    
                let ext = match target_format {
                    ImageFormat::WebP => "webp",
                    ImageFormat::Png => "png",
                    ImageFormat::Jpeg => "jpg",
                    _ => "out",
                };
                
                let output_file = output_path.join(format!("{}.{}", file_stem, ext));
                
                // Save out the new image
                // *For demonstration purposes. Full implementation would configure WebP quality.
                img.save_with_format(&output_file, target_format)?;
                
                Ok(output_file.to_string_lossy().to_string())
            })
            // collect automatically bubbles up the first Error encountered in the parallel iteration
            .collect();
            
        Ok(results?)
    }
}
