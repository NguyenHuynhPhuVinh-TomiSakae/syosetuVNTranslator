/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import { useNovel } from '@/contexts/NovelContext';
import { translateTextStream } from '@/lib/gemini';
import { updateChapter } from '@/lib/db';

interface TranslationEditorProps {
  isInitialized: boolean;
}

const TranslationEditor: React.FC<TranslationEditorProps> = ({ isInitialized }) => {
  const { currentChapter, refreshData } = useNovel();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

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

  const handleTranslate = async () => {
    if (!sourceText.trim() || isTranslating || !isInitialized || !currentChapter) return;
    
    setIsTranslating(true);
    setTranslatedText('');
    
    try {
      const streamResult = await translateTextStream(sourceText);
      
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
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-gray-500 text-lg">Vui lòng chọn một chương để bắt đầu dịch</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">{currentChapter.title}</h2>
        
        <div className="flex justify-end space-x-3 mb-4">
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