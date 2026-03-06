'use client';

import React, { useState } from 'react';
import { useTauriIpc } from '../hooks/useTauriIpc';

export default function ImageConverter() {
  const [files, setFiles] = useState<string>('');
  const [outputDir, setOutputDir] = useState<string>('');
  const { execute, data, error, isLoading } = useTauriIpc<
    string[],
    { inputPaths: string[]; outputDir: string }
  >();

  const handleConvert = async () => {
    const fileList = files
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);
    if (!outputDir || fileList.length === 0) return;

    await execute(
      { command: 'convert_images' },
      { inputPaths: fileList, outputDir },
    );
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Bulk Image Converter
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Fast, multi-threaded batch compression of images to WebP format.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Input Files (one path per line)
          </label>
          <textarea
            rows={4}
            value={files}
            onChange={(e) => setFiles(e.target.value)}
            placeholder="C:\Images\photo1.jpg&#10;C:\Images\photo2.png"
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-3 border transition-colors bg-gray-50 hover:bg-white resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Output Directory
          </label>
          <input
            type="text"
            value={outputDir}
            onChange={(e) => setOutputDir(e.target.value)}
            placeholder="C:\Images\Processed"
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-3 border transition-colors bg-gray-50 hover:bg-white"
          />
        </div>

        <button
          onClick={handleConvert}
          disabled={isLoading || !files || !outputDir}
          className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all transform active:scale-[0.98]
            ${isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Converting Images...
            </span>
          ) : (
            'Batch Convert to WebP'
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start">
            <svg
              className="w-5 h-5 mr-3 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {data && (
          <div className="p-5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg shadow-inner">
            <div className="flex items-center font-bold mb-3 text-emerald-800">
              <svg
                className="w-6 h-6 mr-2 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Success! Saved {data.length} WebP files.
            </div>
            <ul className="list-disc pl-5 mt-2 max-h-40 overflow-y-auto space-y-1 text-sm custom-scrollbar">
              {data.map((path, idx) => (
                <li key={idx} className="break-all">
                  {path}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
