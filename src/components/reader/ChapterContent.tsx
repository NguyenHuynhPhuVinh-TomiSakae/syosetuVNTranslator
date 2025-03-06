import React, { useEffect } from 'react';
import { Chapter } from '@/lib/db';

interface ChapterContentProps {
  chapter: Chapter;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onBackToList: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const ChapterContent: React.FC<ChapterContentProps> = ({ 
  chapter, 
  onPrevChapter, 
  onNextChapter, 
  onBackToList,
  hasPrev,
  hasNext
}) => {
  // Cuộn lên đầu trang khi component được mount
  useEffect(() => {
    // Sử dụng nhiều cách khác nhau để đảm bảo cuộn hoạt động
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // Thêm một lần cuộn nữa sau khi component đã render
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button 
          onClick={() => {
            // Cuộn lên đầu trước khi chuyển về danh sách
            window.scrollTo(0, 0);
            onBackToList();
          }}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Danh sách chương
        </button>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">{chapter.title}</h2>
      
      <div 
        className="prose prose-lg max-w-none mb-8"
        style={{ fontFamily: "'Noto Serif', 'Source Serif Pro', 'Palatino', serif" }}
      >
        {chapter.translatedText.split('\n').map((paragraph, index) => (
          paragraph.trim() ? (
            <p key={index} className="mb-4">{paragraph}</p>
          ) : (
            <br key={index} />
          )
        ))}
      </div>
      
      <div className="flex justify-between items-center border-t border-gray-200 pt-6 mt-8">
        <button
          onClick={() => {
            // Cuộn lên đầu trước khi chuyển chương
            window.scrollTo(0, 0);
            onPrevChapter();
          }}
          disabled={!hasPrev}
          className={`px-4 py-2 rounded-md flex items-center ${
            hasPrev 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Chương trước
        </button>
        
        <button
          onClick={() => {
            // Cuộn lên đầu trước khi chuyển về danh sách
            window.scrollTo(0, 0);
            onBackToList();
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Danh sách chương
        </button>
        
        <button
          onClick={() => {
            // Cuộn lên đầu trước khi chuyển chương
            window.scrollTo(0, 0);
            onNextChapter();
          }}
          disabled={!hasNext}
          className={`px-4 py-2 rounded-md flex items-center ${
            hasNext 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Chương sau
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChapterContent; 