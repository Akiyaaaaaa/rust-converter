'use client';

import React, { useState } from 'react';
import { useTauriIpc } from '../hooks/useTauriIpc';

export default function DataConverter() {
  const [inputPath, setInputPath] = useState('');
  const { execute, data, error, isLoading } = useTauriIpc<
    string,
    { inputPath: string }
  >();

  const handleConvert = async () => {
    if (!inputPath) return;
    await execute({ command: 'convert_data' }, { inputPath });
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Tabular Data Converter
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Convert .xlsx or .csv files into a structured JSON string format.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Input File Path
          </label>
          <input
            type="text"
            value={inputPath}
            onChange={(e) => setInputPath(e.target.value)}
            placeholder="e.g. C:\Users\Admin\Documents\data.xlsx"
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border transition-colors bg-gray-50 hover:bg-white"
          />
        </div>

        <button
          onClick={handleConvert}
          disabled={isLoading || !inputPath}
          className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all transform active:scale-[0.98]
            ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30'}`}
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
              Processing Data...
            </span>
          ) : (
            'Convert to JSON'
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
          <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-800">
                Success! Extracted JSON:
              </h3>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Completed
              </span>
            </div>
            <pre className="text-xs text-gray-700 overflow-x-auto max-h-72 bg-white p-4 border rounded shadow-sm custom-scrollbar">
              {data}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
