# 🛠️ Multi-Converter Desktop

![Tauri](https://img.shields.io/badge/Tauri-v2.0-24C8DB?logo=tauri&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-Core-000000?logo=rust&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)

A high-performance, "Swiss Army Knife" desktop application built with **Tauri v2**, **Rust**, and **Next.js**. It leverages Rust's multithreading and memory safety to handle heavy file operations while providing a sleek, modern, and responsive user interface.

## ✨ Features

This application consists of three primary high-performance modules:

- 📊 **Tabular Data Converter**
  - Instantly transforms complex `.xlsx`, `.xls`, or `.csv` files into structured JSON data.
  - Uses `calamine` for zero-bloat, memory-efficient streaming of massive spreadsheets.
- 🖼️ **Bulk Image Converter**
  - Batch compresses and converts multiple image formats (JPG, PNG, BMP) to highly optimized `WebP` files.
  - Powered by `rayon` to distribute the heavy compression workload across all available CPU cores simultaneously.
- 📄 **Document Renderer**
  - Transforms standard `.txt` files into polished `.pdf` documents.
  - Features intelligent multi-page pagination and margins handling using `printpdf`.

## 🏗️ Architecture

- **Frontend**: Built with React, Next.js 14 (App Router), and Tailwind CSS. It runs as a Static Site Export (`output: 'export'`) within the Tauri webview.
- **Backend**: Pure Rust. Implements the Service Layer pattern to cleanly separate Tauri IPC commands from the core business logic.
- **Bridge**: Uses Tauri v2 IPC and official Tauri Plugins (`@tauri-apps/plugin-dialog`) for native OS file explorer integration with strict security capabilities.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://rustup.rs/) (latest stable)
- OS-specific build tools (C++ Build Tools for Windows, Xcode for macOS, or `build-essential` for Linux).

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/Akiyaaaaaa/multi-converter.git](https://github.com/Akiyaaaaaa/multi-converter.git)
   cd multi-converter
   ```
2. Install frontend dependencies and Tauri plugins:
   ```bash
   npm install
   ```
3. Run the application in development mode:
   ```bash
   npm run tauri dev
   ```
   (Note: The first compilation of the Rust backend will take a few minutes as it downloads and compiles the crates).

## 📦 Building for Production

To package the application into a standalone executable (e.g., .exe for Windows, .dmg for macOS, .AppImage for Linux), simply run:

```bash
npm run tauri build
```

The compiled installers will be located in
`src-tauri/target/release/bundle/`.

## 📄 License

This project is licensed under the MIT License.
