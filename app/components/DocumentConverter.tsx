'use client';

import React, { useState } from 'react';
import { useTauriIpc } from '../hooks/useTauriIpc';

export default function DocumentConverter() {
  const [inputPath, setInputPath] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const { execute, data, error, isLoading } = useTauriIpc<
    string,
    { inputPath: string; outputPath: string }
  >();

  const handleConvert = async () => {
    if (!inputPath || !outputPath) return;
    await execute(
      { command: 'convert_text_to_pdf' },
      { inputPath, outputPath },
    );
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Document Renderer
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Transform standard TXT files into highly polished PDF representations.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Source File Path (.txt)
          </label>
          <input
            type="text"
            value={inputPath}
            onChange={(e) => setInputPath(e.target.value)}
            placeholder="C:\Documents\notes.txt"
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 border transition-colors bg-gray-50 hover:bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Destination File Path (.pdf)
          </label>
          <input
            type="text"
            value={outputPath}
            onChange={(e) => setOutputPath(e.target.value)}
            placeholder="C:\Documents\output_rendered.pdf"
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 border transition-colors bg-gray-50 hover:bg-white"
          />
        </div>

        <button
          onClick={handleConvert}
          disabled={isLoading || !inputPath || !outputPath}
          className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all transform active:scale-[0.98]
            ${isLoading ? 'bg-purple-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 shadow-lg shadow-purple-500/30'}`}
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
              Rendering PDF...
            </span>
          ) : (
            'Render to PDF'
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
          <div className="p-5 bg-purple-50 border border-purple-200 rounded-lg shadow-inner flex flex-col items-center text-center">
            <svg
              className="w-12 h-12 text-purple-500 mb-3"
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
            <p className="text-sm font-bold text-purple-900">{data}</p>
          </div>
        )}
      </div>
    </div>
  );
}
