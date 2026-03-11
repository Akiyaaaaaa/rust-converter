use crate::error::{AppError, AppResult};
use printpdf::*;
use std::fs::File;
use std::io::{BufRead, BufReader, BufWriter};

pub struct DocumentService;

impl DocumentService {
    pub fn convert_text_to_pdf(input_path: &str, output_path: &str) -> AppResult<()> {
        let file = File::open(input_path)?;
        let reader = BufReader::new(file);

        let (mut doc, page1, layer1) = PdfDocument::new("Document", Mm(210.0), Mm(297.0), "Layer 1");
        
        let font = match doc.add_builtin_font(BuiltinFont::Helvetica) {
            Ok(f) => f,
            Err(e) => return Err(AppError::Document(format!("Font Loader Error: {}", e))),
        };

        let mut current_layer = doc.get_page(page1).get_layer(layer1);
        let mut y_position = 280.0;
        
        for line in reader.lines() {
            let line = line?;
            
            if y_position < 15.0 {
                let (new_page, new_layer) = doc.add_page(Mm(210.0), Mm(297.0), "Layer 1");
                current_layer = doc.get_page(new_page).get_layer(new_layer);
                y_position = 280.0; 
            }

            current_layer.use_text(line, 11.0, Mm(10.0), Mm(y_position), &font);
            y_position -= 5.5; 
        }
        let output_file = File::create(output_path)?;
        doc.save(&mut BufWriter::new(output_file))
            .map_err(|e| AppError::Document(format!("PDF Save Error: {}", e)))?;

        Ok(())
    }
}