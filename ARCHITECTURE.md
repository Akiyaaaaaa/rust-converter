# Architecture & Project Scaffolding

## 1. Project Structure

A Monorepo structure is ideal for Tauri with Next.js. We separate the Next.js `app/` from the Rust `src-tauri/src/`.

```text
multi-converter/
├── app/                  # Next.js (Frontend)
│   ├── app/              # Next.js App Router root (page.tsx, layout.tsx)
│   ├── components/       # Reusable UI components
│   │   ├── modules/      # Module-specific components (ImageConverter, etc.)
│   │   └── ui/           # Generic UI (Buttons, ProgressBars)
│   ├── hooks/            # Custom React Hooks
│   │   └── useTauriIpc.ts# Generic IPC hook for backend communication
│   ├── types/            # TypeScript definitions (shared with Rust backend)
│   └── utils/            # Helper functions
├── src-tauri/            # Tauri + Rust (Backend)
│   ├── Cargo.toml        # Rust dependencies
│   ├── tauri.conf.json   # Tauri configuration
│   └── src/
│       ├── main.rs       # Entry point, registers commands
│       ├── error.rs      # Global custom Error type (Enum) mapped to Frontend
│       ├── commands/     # Tauri Command Handlers (IPC endpoints)
│       │   ├── mod.rs
│       │   ├── data_converter.rs # Module A
│       │   ├── image_converter.rs# Module B
│       │   └── doc_converter.rs  # Module C
│       ├── services/     # Pure Business Logic (No Tauri context here)
│       │   ├── mod.rs
│       │   ├── data_converter.rs
│       │   ├── image_converter.rs
│       │   └── doc_converter.rs
│       └── utils/        # Shared Rust helpers (I/O, validation)
│           └── fs.rs     # File system adapter pattern
├── package.json          # Node dependencies
└── README.md
```

## 2. Architecture Patterns

1. **Service Layer Pattern**: Keep `src/commands` purely as an IPC layer. They receive requests from Next.js, parse arguments, and immediately hand off to `src/services`.
2. **Adapter Pattern for I/O**: `utils/fs.rs` can abstract reading/writing to decouple the pure business logic and allow easier testing.
3. **Data Handling**: Use zero-copy techniques when passing data from Rust to Frontend when possible, or rely on fast JSON serialization `serde_json` for smaller chunks. For large conversions, process stream-based reads or multi-threaded batches (`rayon`), and only send "progress" or "success" messages over IPC rather than the big payload.
