use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("I/O Error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Image Processing Error: {0}")]
    Image(#[from] image::ImageError),

    #[error("CSV Error: {0}")]
    Csv(#[from] csv::Error),

    #[error("Data Conversion Error: {0}")]
    DataConversion(String),

    #[error("Document Builder Error: {0}")]
    Document(String),

    #[error("Unknown Error: {0}")]
    Unknown(String),
}

impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}

pub type AppResult<T> = Result<T, AppError>;
