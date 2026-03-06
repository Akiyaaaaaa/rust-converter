use crate::error::AppResult;
use image::ImageFormat;
use rayon::prelude::*;
use std::path::Path;

pub struct ImageService;

impl ImageService {
    /// Batch converts multiple images to WebP format using multi-threading (Rayon)
    pub fn batch_convert_to_webp(
        input_paths: Vec<String>,
        output_dir: String,
        _quality: u8,
    ) -> AppResult<Vec<String>> {
        let output_path = Path::new(&output_dir);
        
        if !output_path.exists() {
            std::fs::create_dir_all(output_path)?;
        }

        // Apply parallel iteration to leverage all CPU cores
        let results: Result<Vec<String>, _> = input_paths
            .par_iter()
            .map(|input_str| {
                let input_path = Path::new(input_str);
                let img = image::open(&input_path)?;
                
                let file_stem = input_path
                    .file_stem()
                    .and_then(|s| s.to_str())
                    .unwrap_or("image");
                    
                let output_file = output_path.join(format!("{}.webp", file_stem));
                
                // image crate allows fast encoding via standard features.
                img.save_with_format(&output_file, ImageFormat::WebP)?;
                
                Ok(output_file.to_string_lossy().to_string())
            })
            .collect();
            
        Ok(results?)
    }
}
