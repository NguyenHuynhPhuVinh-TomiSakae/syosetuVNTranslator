'use client';
import React, { useState } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import NovelManager from './NovelManager';
import ChapterManager from './ChapterManager';
import ExportImportManager from './ExportImportManager';
import NovelStatistics from './NovelStatistics';
import GlossaryManager from './GlossaryManager';

const Dashboard: React.FC = () => {
  const { currentNovel } = useNovel();
  const [activeTab, setActiveTab] = useState<'overview' | 'glossary'>('overview');

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Bảng điều khiển</h1>
      
      {currentNovel && (
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('glossary')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'glossary'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Thuật ngữ
              </button>
            </nav>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <NovelManager />
        
        {currentNovel && activeTab === 'overview' && (
          <>
            <NovelStatistics />
            <ChapterManager />
          </>
        )}
        
        {currentNovel && activeTab === 'glossary' && (
          <GlossaryManager />
        )}
        
        <ExportImportManager />
      </div>
    </div>
  );
};

export default Dashboard; 