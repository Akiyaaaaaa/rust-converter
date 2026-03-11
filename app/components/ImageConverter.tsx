'use client';

import React, { useState } from 'react';
import { useTauriIpc } from '../hooks/useTauriIpc';
import {
  Images,
  FolderOutput,
  ImagePlus,
  Loader2,
  AlertCircle,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';

export default function ImageConverter() {
  const [inputPaths, setInputPaths] = useState<string[]>([]);
  const [outputDir, setOutputDir] = useState<string>('');

  const { execute, data, error, isLoading } = useTauriIpc<
    string[],
    { inputPaths: string[]; outputDir: string }
  >();

  const handleBrowseFiles = async () => {
    try {
      const selected = await open({
        multiple: true,
        title: 'Select Images to Compress',
        filters: [
          {
            name: 'Images',
            extensions: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
          },
        ],
      });

      if (Array.isArray(selected)) {
        setInputPaths((prev) => Array.from(new Set([...prev, ...selected])));
      } else if (selected) {
        setInputPaths((prev) =>
          Array.from(new Set([...prev, selected as string])),
        );
      }
    } catch (err) {
      console.error('Failed to open file dialog:', err);
    }
  };

  const handleBrowseOutputDir = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Output Directory',
      });
      if (selected && typeof selected === 'string') {
        setOutputDir(selected);
      }
    } catch (err) {
      console.error('Failed to open directory dialog:', err);
    }
  };

  const handleConvert = async () => {
    if (inputPaths.length === 0 || !outputDir) return;
    await execute({ command: 'convert_images' }, { inputPaths, outputDir });
  };

  const getFileName = (path: string) => path.split(/[/\\]/).pop() || path;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Bulk Image Converter
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Fast, multi-threaded batch compression of images to WebP format.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(16,185,129,0.1)] border border-slate-200 overflow-hidden relative">
        <div className="p-8 space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm font-semibold text-slate-700">
                Source Images
              </label>
              {inputPaths.length > 0 && (
                <button
                  onClick={() => setInputPaths([])}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              )}
            </div>

            <div
              onClick={handleBrowseFiles}
              className={`border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-2
                ${inputPaths.length > 0 ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-300 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300'}`}
            >
              <div
                className={`p-3 rounded-full ${inputPaths.length > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}
              >
                <ImagePlus size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">
                  {inputPaths.length > 0
                    ? `${inputPaths.length} image(s) selected`
                    : 'Click to select images'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  .jpg, .png, .bmp, .webp
                </p>
              </div>
            </div>

            {inputPaths.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 max-h-32 overflow-y-auto custom-scrollbar">
                <ul className="space-y-1">
                  {inputPaths.map((path, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-600 flex items-center gap-2"
                    >
                      <Images size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate" title={path}>
                        {getFileName(path)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Output Directory
            </label>
            <div
              onClick={handleBrowseOutputDir}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FolderOutput
                  className={`h-5 w-5 transition-colors ${outputDir ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-500'}`}
                />
              </div>
              <div
                className={`block w-full pl-11 pr-24 py-3 border rounded-lg text-sm transition-all group-hover:bg-emerald-50/50 group-hover:border-emerald-400 truncate
                ${outputDir ? 'bg-white border-emerald-300 text-slate-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
              >
                {outputDir
                  ? getFileName(outputDir)
                  : 'Choose where to save WebP files...'}
              </div>
              <div className="absolute inset-y-0 right-1.5 flex items-center">
                <div className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                  Browse
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={isLoading || inputPaths.length === 0 || !outputDir}
            className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
              ${
                inputPaths.length === 0 || !outputDir
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : isLoading
                    ? 'bg-emerald-600/80 text-white cursor-wait relative overflow-hidden'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-[0.99] border border-emerald-600'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Compressing {inputPaths.length} Images...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Batch Convert to WebP
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
              <h3 className="text-xs font-semibold text-emerald-400 tracking-wider uppercase flex items-center gap-2">
                <CheckCircle2 size={14} />
                Successfully saved {data.length} WebP files
              </h3>
            </div>
            <div className="bg-slate-900 rounded-lg p-3 max-h-40 overflow-y-auto custom-scrollbar border border-slate-800">
              <ul className="space-y-1">
                {data.map((path, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-400 flex items-center gap-2"
                  >
                    <span className="text-emerald-500">✓</span>
                    <span className="truncate" title={path}>
                      {getFileName(path)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
