'use client';

import React, { useState } from 'react';
import DataConverter from './components/DataConverter';
import ImageConverter from './components/ImageConverter';
import DocumentConverter from './components/DocumentConverter';

type Tab = 'data' | 'image' | 'document';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('data');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-10">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Multi-Converter
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide text-transform uppercase">
            Desktop Utility Engine
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
          <button
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center px-5 py-4 rounded-xl transition-all font-semibold ${
              activeTab === 'data'
                ? 'bg-blue-600 shadow-lg shadow-blue-500/30 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Tabular Data Mode
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`w-full flex items-center px-5 py-4 rounded-xl transition-all font-semibold ${
              activeTab === 'image'
                ? 'bg-emerald-600 shadow-lg shadow-emerald-500/30 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Bulk Images Mode
          </button>

          <button
            onClick={() => setActiveTab('document')}
            className={`w-full flex items-center px-5 py-4 rounded-xl transition-all font-semibold ${
              activeTab === 'document'
                ? 'bg-purple-600 shadow-lg shadow-purple-500/30 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Document Renderer Mode
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800 text-xs text-slate-500 font-medium text-center">
          <p>Powered by Tauri & Next.js</p>
          <p className="mt-1">High-Performance Rust Core</p>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-10 relative">
        <div className="max-w-4xl mx-auto h-full mt-4">
          <div
            className={`transition-all duration-300 ${activeTab === 'data' ? 'block animate-fade-in' : 'hidden'}`}
          >
            <DataConverter />
          </div>
          <div
            className={`transition-all duration-300 ${activeTab === 'image' ? 'block animate-fade-in' : 'hidden'}`}
          >
            <ImageConverter />
          </div>
          <div
            className={`transition-all duration-300 ${activeTab === 'document' ? 'block animate-fade-in' : 'hidden'}`}
          >
            <DocumentConverter />
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
