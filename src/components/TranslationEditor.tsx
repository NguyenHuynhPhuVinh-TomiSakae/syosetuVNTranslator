/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import { translateTextStream } from '@/lib/gemini';
import { updateChapter, getChaptersForNovel, getGlossaryForNovel } from '@/lib/db';

interface TranslationEditorProps {
  isInitialized: boolean;
}

const TranslationEditor: React.FC<TranslationEditorProps> = ({ isInitialized }) => {
  const { currentChapter, refreshData, chapters, currentNovel } = useNovel();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [useContext, setUseContext] = useState(true);
  const [useGlossary, setUseGlossary] = useState(true);

  useEffect(() => {
    if (currentChapter) {
      setSourceText(currentChapter.sourceText);
      setTranslatedText(currentChapter.translatedText);
    } else {
      setSourceText('');
      setTranslatedText('');
    }
  }, [currentChapter]);

  const handleSourceTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value);
  };

  const handleTranslatedTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranslatedText(e.target.value);
  };

  const handleSave = async () => {
    if (!currentChapter) return;

    await updateChapter({
      ...currentChapter,
      sourceText,
      translatedText,
    });

    await refreshData();
  };

  const getPreviousChapters = async () => {
    if (!currentChapter || !currentNovel) return [];
    
    // Lấy tất cả các chương của truyện
    const allChapters = await getChaptersForNovel(currentNovel.id!);
    
    // Sắp xếp theo thứ tự
    allChapters.sort((a, b) => a.order - b.order);
    
    // Tìm vị trí của chương hiện tại
    const currentIndex = allChapters.findIndex(c => c.id === currentChapter.id);
    
    if (currentIndex <= 0) return []; // Không có chương trước
    
    // Lấy tối đa 2 chương trước đó
    const previousChapters = allChapters
      .slice(Math.max(0, currentIndex - 2), currentIndex)
      .filter(chapter => chapter.translatedText.trim() !== '')
      .map(chapter => ({
        title: chapter.title,
        content: chapter.translatedText
      }));
    
    return previousChapters;
  };

  const getGlossaryTerms = async () => {
    if (!currentNovel) return [];
    
    const glossary = await getGlossaryForNovel(currentNovel.id!);
    return glossary.map(term => ({
      original: term.originalTerm,
      translated: term.translatedTerm,
      description: term.description
    }));
  };

  const handleTranslate = async () => {
    if (!sourceText.trim() || isTranslating || !isInitialized || !currentChapter) return;
    
    setIsTranslating(true);
    setTranslatedText('');
    
    try {
      // Lấy các chương trước đó nếu được chọn
      const previousChapters = useContext ? await getPreviousChapters() : [];
      
      // Lấy thuật ngữ nếu được chọn
      const glossaryTerms = useGlossary ? await getGlossaryTerms() : [];
      
      const streamResult = await translateTextStream(sourceText, previousChapters, glossaryTerms);
      
      let fullTranslation = '';
      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        fullTranslation += chunkText;
        setTranslatedText(fullTranslation);
      }
      
      // Lưu bản dịch vào database
      await updateChapter({
        ...currentChapter,
        sourceText,
        translatedText: fullTranslation,
      });
      
      await refreshData();
    } catch (error) {
      console.error("Lỗi khi dịch:", error);
      setTranslatedText("Đã xảy ra lỗi khi dịch. Vui lòng thử lại sau.");
    } finally {
      setIsTranslating(false);
    }
  };

  if (!currentChapter) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Vui lòng chọn một chương để bắt đầu dịch</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{currentChapter.title}</h2>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useContext"
                checked={useContext}
                onChange={(e) => setUseContext(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="useContext" className="text-sm text-gray-600">
                Sử dụng ngữ cảnh từ các chương trước
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useGlossary"
                checked={useGlossary}
                onChange={(e) => setUseGlossary(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="useGlossary" className="text-sm text-gray-600">
                Sử dụng thuật ngữ đã định nghĩa
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              disabled={isTranslating}
            >
              Lưu
            </button>
            <button
              onClick={handleTranslate}
              className={`px-4 py-2 ${isTranslating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md`}
              disabled={isTranslating || !sourceText.trim() || !isInitialized}
            >
              {isTranslating ? "Đang dịch..." : "Dịch"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Văn bản gốc</h3>
          <textarea
            className="w-full h-[calc(100vh-300px)] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Dán đoạn tiểu thuyết cần dịch vào đây..."
            value={sourceText}
            onChange={handleSourceTextChange}
            disabled={isTranslating}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Bản dịch</h3>
          <div className="relative">
            <textarea
              className="w-full h-[calc(100vh-300px)] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Bản dịch sẽ xuất hiện ở đây..."
              value={translatedText}
              onChange={handleTranslatedTextChange}
              disabled={isTranslating}
              style={{ fontFamily: "'Noto Serif', 'Source Serif Pro', 'Palatino', serif" }}
            />
            
            {isTranslating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationEditor; 