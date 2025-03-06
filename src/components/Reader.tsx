'use client';
import React, { useState, useEffect } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import NovelSelector from './reader/NovelSelector';
import ChapterList from './reader/ChapterList';
import ChapterContent from './reader/ChapterContent';

const Reader: React.FC = () => {
  const { novels, currentNovel, setCurrentNovel, currentChapter, setCurrentChapter, chapters } = useNovel();
  const [view, setView] = useState<'list' | 'chapter'>(currentChapter ? 'chapter' : 'list');
  const [chapterId, setChapterId] = useState<number | null>(currentChapter?.id || null);

  // Chuyển về danh sách chương khi thay đổi truyện
  useEffect(() => {
    if (!currentChapter) {
      setView('list');
    }
  }, [currentChapter]);

  // Chuyển sang chế độ đọc chương khi chọn chương
  useEffect(() => {
    if (currentChapter && currentChapter.id !== undefined) {
      setView('chapter');
      setChapterId(currentChapter.id);
    }
  }, [currentChapter]);

  // Cuộn lên đầu trang khi chapterId thay đổi
  useEffect(() => {
    if (chapterId) {
      // Sử dụng nhiều cách khác nhau để đảm bảo cuộn hoạt động
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // Thêm một lần cuộn nữa sau một khoảng thời gian
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [chapterId]);

  // Tìm chương trước và chương sau
  const currentIndex = currentChapter ? chapters.findIndex(c => c.id === currentChapter.id) : -1;
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex >= 0 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  // Hàm điều hướng
  const goToPrevChapter = () => {
    if (prevChapter) {
      setCurrentChapter(prevChapter);
      setChapterId(prevChapter.id!); // Kích hoạt useEffect cuộn trang
    }
  };

  const goToNextChapter = () => {
    if (nextChapter) {
      setCurrentChapter(nextChapter);
      setChapterId(nextChapter.id!); // Kích hoạt useEffect cuộn trang
    }
  };

  const goToChapterList = () => {
    setView('list');
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex-1 p-6" id="reader-container">
      {!currentNovel ? (
        <NovelSelector novels={novels} onSelectNovel={setCurrentNovel} />
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{currentNovel.title}</h1>
            <p className="text-gray-600">Tác giả: {currentNovel.author}</p>
          </div>

          {view === 'list' ? (
            <ChapterList 
              chapters={chapters} 
              onSelectChapter={(chapter) => {
                setCurrentChapter(chapter);
                setChapterId(chapter.id!); // Kích hoạt useEffect cuộn trang
              }} 
            />
          ) : (
            <ChapterContent 
              key={`chapter-${chapterId}`} // Thêm key để buộc React re-render
              chapter={currentChapter!}
              onPrevChapter={goToPrevChapter}
              onNextChapter={goToNextChapter}
              onBackToList={goToChapterList}
              hasPrev={!!prevChapter}
              hasNext={!!nextChapter}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Reader; 