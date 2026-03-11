'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Image as ImageIcon,
  FileText,
  Settings,
} from 'lucide-react';

import DataConverter from './components/DataConverter';
import ImageConverter from './components/ImageConverter';
import DocumentConverter from './components/DocumentConverter';

export default function App() {
  const [activeTab, setActiveTab] = useState('document');

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-gray-900 overflow-hidden">
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Multi-Converter
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
            Desktop Edition
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem
            icon={<FileSpreadsheet size={20} />}
            label="Tabular Data"
            isActive={activeTab === 'data'}
            onClick={() => setActiveTab('data')}
          />
          <SidebarItem
            icon={<ImageIcon size={20} />}
            label="Bulk Images"
            isActive={activeTab === 'image'}
            onClick={() => setActiveTab('image')}
          />
          <SidebarItem
            icon={<FileText size={20} />}
            label="Document Renderer"
            isActive={activeTab === 'document'}
            onClick={() => setActiveTab('document')}
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium">
            <Settings size={18} />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {activeTab === 'data' && 'Tabular Data Mode'}
            {activeTab === 'image' && 'Bulk Image Compression'}
            {activeTab === 'document' && 'Document Rendering Engine'}
          </h2>
        </header>

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'data' && <DataConverter />}
            {activeTab === 'image' && <ImageConverter />}
            {activeTab === 'document' && <DocumentConverter />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200 text-sm font-medium outline-none
        ${
          isActive
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
            : 'hover:bg-slate-800 hover:text-white'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
