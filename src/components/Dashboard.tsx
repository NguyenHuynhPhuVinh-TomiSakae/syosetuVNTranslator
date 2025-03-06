'use client';
import React from 'react';
import { useNovel } from '@/contexts/NovelContext';
import NovelManager from './NovelManager';
import ChapterManager from './ChapterManager';
import ExportImportManager from './ExportImportManager';
import NovelStatistics from './NovelStatistics';

const Dashboard: React.FC = () => {
  const { currentNovel } = useNovel();

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Bảng điều khiển</h1>
      
      <div className="space-y-6">
        <NovelManager />
        
        {currentNovel && (
          <>
            <NovelStatistics />
            <ChapterManager />
          </>
        )}
        
        <ExportImportManager />
      </div>
    </div>
  );
};

export default Dashboard; 