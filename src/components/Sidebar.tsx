'use client';
import React, { useState } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import { Novel, Chapter, addNovel, addChapter } from '@/lib/db';

const Sidebar: React.FC = () => {
  const { novels, currentNovel, chapters, setCurrentNovel, setCurrentChapter, refreshData } = useNovel();
  const [isAddNovelModalOpen, setIsAddNovelModalOpen] = useState(false);
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);
  const [newNovelTitle, setNewNovelTitle] = useState('');
  const [newNovelAuthor, setNewNovelAuthor] = useState('');
  const [newNovelDescription, setNewNovelDescription] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const handleAddNovel = async () => {
    if (!newNovelTitle.trim()) return;

    const novel: Novel = {
      title: newNovelTitle,
      author: newNovelAuthor,
      description: newNovelDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await addNovel(novel);
    await refreshData();
    setIsAddNovelModalOpen(false);
    setNewNovelTitle('');
    setNewNovelAuthor('');
    setNewNovelDescription('');
  };

  const handleAddChapter = async () => {
    if (!newChapterTitle.trim() || !currentNovel) return;

    const chapter: Chapter = {
      novelId: currentNovel.id!,
      title: newChapterTitle,
      sourceText: '',
      translatedText: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      order: chapters.length + 1,
    };

    await addChapter(chapter);
    await refreshData();
    setIsAddChapterModalOpen(false);
    setNewChapterTitle('');
  };

  return (
    <aside className="w-64 h-screen bg-gray-100 p-4 overflow-y-auto border-r border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Truyện của tôi</h2>
        <button
          onClick={() => setIsAddNovelModalOpen(true)}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <ul className="space-y-2">
          {novels.map((novel) => (
            <li
              key={novel.id}
              className={`p-2 rounded cursor-pointer ${
                currentNovel?.id === novel.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'
              }`}
              onClick={() => setCurrentNovel(novel)}
            >
              {novel.title}
            </li>
          ))}
        </ul>
      </div>

      {currentNovel && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Chương</h3>
            <button
              onClick={() => setIsAddChapterModalOpen(true)}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <ul className="space-y-2">
            {chapters.map((chapter) => (
              <li
                key={chapter.id}
                className="p-2 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => setCurrentChapter(chapter)}
              >
                {chapter.title}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Modal thêm truyện mới */}
      {isAddNovelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Thêm truyện mới</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên truyện</label>
                <input
                  type="text"
                  value={newNovelTitle}
                  onChange={(e) => setNewNovelTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nhập tên truyện"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                <input
                  type="text"
                  value={newNovelAuthor}
                  onChange={(e) => setNewNovelAuthor(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nhập tên tác giả"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={newNovelDescription}
                  onChange={(e) => setNewNovelDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nhập mô tả truyện"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsAddNovelModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleAddNovel}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm chương mới */}
      {isAddChapterModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Thêm chương mới</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên chương</label>
              <input
                type="text"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Nhập tên chương"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsAddChapterModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleAddChapter}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar; 