// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod commands;
mod services;

use commands::data_converter::*;
use commands::image_converter::*;
use commands::document_builder::*;

fn main() {
    tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            convert_data,
            convert_images,
            convert_text_to_pdf
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
