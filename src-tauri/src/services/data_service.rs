use crate::error::{AppError, AppResult};
use calamine::{open_workbook, DataType, Reader, Xlsx};
use csv::ReaderBuilder;
use serde_json::{json, Value};
use std::path::Path;

pub struct DataService;

impl DataService {
    /// Converts Excel (.xlsx) file to JSON string
    pub fn convert_excel_to_json(input_path: &str) -> AppResult<String> {
        let mut workbook: Xlsx<_> = open_workbook(input_path)
            .map_err(|e| AppError::DataConversion(e.to_string()))?;
            
        // Default to the first sheet
        let sheet_names = workbook.sheet_names().to_owned();
        let sheet_name = sheet_names.first()
            .ok_or_else(|| AppError::DataConversion("Workbook is empty".into()))?;

        if let Some(Ok(range)) = workbook.worksheet_range(sheet_name) {
            let mut rows = range.rows();
            let mut result = Vec::new();

            if let Some(headers) = rows.next() {
                let header_names: Vec<String> = headers.iter().map(|h| h.to_string()).collect();

                for row in rows {
                    let mut obj = serde_json::Map::new();
                    for (i, cell) in row.iter().enumerate() {
                        let col_name = header_names.get(i).cloned().unwrap_or_else(|| format!("col_{}", i));
                        let val = match cell {
                            DataType::Empty => Value::Null,
                            DataType::String(s) => Value::String(s.to_string()),
                            DataType::Float(f) => json!(f),
                            DataType::Int(i) => json!(i),
                            DataType::Bool(b) => Value::Bool(*b),
                            DataType::DateTime(d) => Value::String(d.to_string()),
                            DataType::Error(e) => Value::String(format!("Error: {:?}", e)),
                        };
                        obj.insert(col_name, val);
                    }
                    result.push(Value::Object(obj));
                }
            }
            return serde_json::to_string(&result)
                .map_err(|e| AppError::DataConversion(e.to_string()));
        }

        Err(AppError::DataConversion("Failed to read sheet data".into()))
    }

    /// Converts CSV file to JSON string
    pub fn convert_csv_to_json(input_path: &str) -> AppResult<String> {
        let mut rdr = ReaderBuilder::new()
            .has_headers(true)
            .from_path(input_path)?;
            
        let headers = rdr.headers()?.clone();
        let mut result = Vec::new();

        for record in rdr.records() {
            let record = record?;
            let mut obj = serde_json::Map::new();
            for (i, field) in record.iter().enumerate() {
                let col_name = headers.get(i).unwrap_or(&format!("col_{}", i));
                obj.insert(col_name.to_string(), Value::String(field.to_string()));
            }
            result.push(Value::Object(obj));
        }

        serde_json::to_string(&result)
            .map_err(|e| AppError::DataConversion(e.to_string()))
    }
}
