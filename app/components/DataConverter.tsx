'use client';

import React, { useState } from 'react';
import { useTauriIpc } from '../hooks/useTauriIpc';
import {
  FileSpreadsheet,
  FileJson,
  AlertCircle,
  Loader2,
  Search,
} from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';

export default function DataConverter() {
  const [inputPath, setInputPath] = useState('');
  const [displayFileName, setDisplayFileName] = useState('');

  const { execute, data, error, isLoading } = useTauriIpc<
    string,
    { inputPath: string }
  >();

  const handleBrowseFile = async () => {
    try {
      const selectedPath = await open({
        multiple: false,
        title: 'Select Tabular Data File',
        filters: [
          {
            name: 'Excel & CSV Files',
            extensions: ['xlsx', 'xls', 'csv'],
          },
        ],
      });

      if (selectedPath && typeof selectedPath === 'string') {
        setInputPath(selectedPath);
        const nameWithExt = selectedPath.split(/[/\\]/).pop() || '';
        const nameOnly =
          nameWithExt.substring(0, nameWithExt.lastIndexOf('.')) || nameWithExt;

        setDisplayFileName(nameOnly);
      }
    } catch (err) {
      console.error('Failed to open dialog:', err);
    }
  };

  const handleConvert = async () => {
    if (!inputPath) return;
    await execute({ command: 'convert_data' }, { inputPath });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Tabular Data Converter
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Transform .xlsx workbooks or .csv files into structured JSON
          instantly.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200 overflow-hidden relative">
        <div className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Source File
            </label>

            <div
              onClick={handleBrowseFile}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FileSpreadsheet
                  className={`h-5 w-5 transition-colors ${displayFileName ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-500'}`}
                />
              </div>

              <div
                className={`block w-full pl-11 pr-24 py-3 border rounded-lg text-sm transition-all group-hover:bg-blue-50/50 group-hover:border-blue-400 
                ${displayFileName ? 'bg-white border-blue-300 text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
              >
                {displayFileName
                  ? displayFileName
                  : 'Click to browse file from your computer...'}
              </div>

              <div className="absolute inset-y-0 right-1.5 flex items-center">
                <div className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors flex items-center gap-1">
                  <Search size={14} />
                  Browse
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Supported formats: .xlsx, .xls, .csv
            </p>
          </div>

          <button
            onClick={handleConvert}
            disabled={isLoading || !inputPath}
            className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
              ${
                !inputPath
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : isLoading
                    ? 'bg-blue-600/80 text-white cursor-wait relative overflow-hidden'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-[0.99] border border-blue-600'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Data...
              </>
            ) : (
              <>
                <FileJson className="w-4 h-4" />
                Convert to JSON
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="px-8 flex items-start pb-8">
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 text-red-800">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div className="text-sm shadow-sm">{error}</div>
            </div>
          </div>
        )}

        {data && (
          <div className="border-t border-slate-200 bg-slate-950 p-6 relative group">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                Rendered Output
              </h3>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-500 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-sm">
                  Success
                </span>
              </div>
            </div>

            <div className="relative">
              <pre className="text-[13px] leading-relaxed font-mono text-emerald-400 overflow-x-auto max-h-[350px] custom-scrollbar selection:bg-emerald-500/30 selection:text-emerald-200">
                {data}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
