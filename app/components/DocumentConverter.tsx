'use client';

import React, { useState } from 'react';
import { useTauriIpc } from '../hooks/useTauriIpc';
import {
  FileText,
  FileDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  Save,
} from 'lucide-react';
import { open, save } from '@tauri-apps/plugin-dialog';

export default function DocumentConverter() {
  const [inputPath, setInputPath] = useState('');
  const [outputPath, setOutputPath] = useState('');

  const { execute, data, error, isLoading } = useTauriIpc<
    string,
    { inputPath: string; outputPath: string }
  >();

  const handleBrowseInput = async () => {
    try {
      const selected = await open({
        multiple: false,
        title: 'Select Text Document',
        filters: [{ name: 'Text Files', extensions: ['txt'] }],
      });

      if (selected && typeof selected === 'string') {
        setInputPath(selected);
      }
    } catch (err) {
      console.error('Failed to open dialog:', err);
    }
  };

  const handleBrowseOutput = async () => {
    try {
      const selected = await save({
        title: 'Save PDF As',
        filters: [{ name: 'PDF Document', extensions: ['pdf'] }],
        defaultPath: 'rendered_document.pdf',
      });

      if (selected && typeof selected === 'string') {
        setOutputPath(selected);
      }
    } catch (err) {
      console.error('Failed to save dialog:', err);
    }
  };

  const handleConvert = async () => {
    if (!inputPath || !outputPath) return;
    await execute(
      { command: 'convert_text_to_pdf' },
      { inputPath, outputPath },
    );
  };

  const getFileName = (path: string) => path.split(/[/\\]/).pop() || path;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Document Renderer
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Transform standard TXT files into highly polished PDF representations.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(147,51,234,0.1)] border border-slate-200 overflow-hidden relative">
        <div className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Source File
            </label>
            <div
              onClick={handleBrowseInput}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FileText
                  className={`h-5 w-5 transition-colors ${inputPath ? 'text-purple-500' : 'text-slate-400 group-hover:text-purple-500'}`}
                />
              </div>
              <div
                className={`block w-full pl-11 pr-24 py-3 border rounded-lg text-sm transition-all group-hover:bg-purple-50/50 group-hover:border-purple-400 truncate
                ${inputPath ? 'bg-white border-purple-300 text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
              >
                {inputPath
                  ? getFileName(inputPath)
                  : 'Click to select a .txt file...'}
              </div>
              <div className="absolute inset-y-0 right-1.5 flex items-center">
                <div className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors flex items-center gap-1">
                  <Search size={14} />
                  Browse
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Save Destination
            </label>
            <div
              onClick={handleBrowseOutput}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FileDown
                  className={`h-5 w-5 transition-colors ${outputPath ? 'text-purple-500' : 'text-slate-400 group-hover:text-purple-500'}`}
                />
              </div>
              <div
                className={`block w-full pl-11 pr-24 py-3 border rounded-lg text-sm transition-all group-hover:bg-purple-50/50 group-hover:border-purple-400 truncate
                ${outputPath ? 'bg-white border-purple-300 text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
              >
                {outputPath
                  ? getFileName(outputPath)
                  : 'Choose where to save the PDF...'}
              </div>
              <div className="absolute inset-y-0 right-1.5 flex items-center">
                <div className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md group-hover:bg-purple-100 group-hover:text-purple-700 transition-colors flex items-center gap-1">
                  <Save size={14} />
                  Save As
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={isLoading || !inputPath || !outputPath}
            className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
              ${
                !inputPath || !outputPath
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : isLoading
                    ? 'bg-purple-600/80 text-white cursor-wait relative overflow-hidden'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 active:scale-[0.99] border border-purple-600'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Rendering PDF...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Render to PDF
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
              <h3 className="text-xs font-semibold text-purple-400 tracking-wider uppercase flex items-center gap-2">
                <CheckCircle2 size={14} />
                Operation Successful
              </h3>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
              <p className="text-sm text-slate-300 font-medium">{data}</p>
              <p className="text-xs text-slate-500 mt-2 break-all">
                Saved at: {outputPath}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
