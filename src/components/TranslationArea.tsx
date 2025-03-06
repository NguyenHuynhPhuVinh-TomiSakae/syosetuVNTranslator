import React, { useState, useRef, useEffect } from 'react';
import { translateTextStream } from "@/lib/gemini";
import SourceTextModal from './SourceTextModal';

interface TranslationAreaProps {
  isInitialized: boolean;
}

const TranslationArea: React.FC<TranslationAreaProps> = ({ isInitialized }) => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("Bản dịch sẽ xuất hiện ở đây...");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const translatedTextRef = useRef<HTMLDivElement>(null);

  const handleTranslate = async () => {
    if (!sourceText.trim() || isTranslating || !isInitialized) return;
    
    setIsTranslating(true);
    setTranslatedText("");
    setIsModalOpen(false);
    
    try {
      // Sử dụng phiên bản streaming để hiển thị kết quả dần dần
      const streamResult = await translateTextStream(sourceText);
      
      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        setTranslatedText(prev => prev + chunkText);
        
        // Cuộn xuống sau mỗi lần cập nhật
        if (translatedTextRef.current) {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    } catch (error) {
      console.error("Lỗi khi dịch:", error);
      setTranslatedText("Đã xảy ra lỗi khi dịch. Vui lòng thử lại sau.");
    } finally {
      setIsTranslating(false);
    }
  };

  // Tự động cuộn xuống khi có nội dung mới
  useEffect(() => {
    if (translatedText) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [translatedText]);

  return (
    <main className="w-full max-w-4xl flex flex-col gap-6">
      {/* Nút mở modal */}
      <div className="flex justify-center mb-4">
        <button 
          className={`px-6 py-3 ${!isInitialized ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors shadow-md`}
          onClick={() => isInitialized && setIsModalOpen(true)}
          disabled={!isInitialized}
        >
          Dán văn bản nguồn
        </button>
      </div>
      
      {/* Hiển thị bản dịch */}
      <div 
        ref={translatedTextRef}
        className="w-full overflow-y-auto text-black whitespace-pre-wrap leading-relaxed text-lg"
        style={{ fontFamily: "'Noto Serif', 'Source Serif Pro', 'Palatino', serif" }}
      >
        {translatedText}
      </div>
      
      {/* Loading indicator */}
      {isTranslating && (
        <div className="flex justify-center items-center mt-4 mb-8">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
      
      {/* Modal nhập văn bản nguồn */}
      <SourceTextModal
        isOpen={isModalOpen}
        sourceText={sourceText}
        isTranslating={isTranslating}
        onClose={() => setIsModalOpen(false)}
        onTextChange={setSourceText}
        onTranslate={handleTranslate}
      />
    </main>
  );
};

export default TranslationArea; 