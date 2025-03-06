/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { translateText, translateTextStream } from "@/lib/gemini";

export default function Home() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("Bản dịch sẽ xuất hiện ở đây...");
  const [isTranslating, setIsTranslating] = useState(false);
  const translatedTextRef = useRef<HTMLDivElement>(null);

  const handleTranslate = async () => {
    if (!sourceText.trim() || isTranslating) return;
    
    setIsTranslating(true);
    setTranslatedText("");
    
    try {
      // Sử dụng phiên bản streaming để hiển thị kết quả dần dần
      const streamResult = await translateTextStream(sourceText);
      
      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        setTranslatedText(prev => prev + chunkText);
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
    if (translatedTextRef.current && translatedText) {
      translatedTextRef.current.scrollTop = translatedTextRef.current.scrollHeight;
    }
  }, [translatedText]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full text-center">
        <h1 className="text-3xl font-bold mb-4">SyosetuVNTranslator</h1>
        <p className="text-gray-600 dark:text-gray-400">Công cụ dịch tiểu thuyết từ Syosetu sang tiếng Việt</p>
      </header>
      
      <main className="w-full max-w-4xl flex flex-col gap-6">
        <div className="w-full">
          <label htmlFor="sourceText" className="block mb-2 font-medium">Nội dung cần dịch:</label>
          <textarea 
            id="sourceText" 
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white" 
            placeholder="Dán đoạn tiểu thuyết cần dịch vào đây..."
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
          />
        </div>
        
        <div className="flex justify-center">
          <button 
            className={`px-6 py-3 ${isTranslating ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-full transition-colors flex items-center gap-2`}
            onClick={handleTranslate}
            disabled={isTranslating || !sourceText.trim()}
          >
            {isTranslating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang dịch...
              </>
            ) : "Dịch ngay"}
          </button>
        </div>
        
        <div className="w-full">
          <label htmlFor="translatedText" className="block mb-2 font-medium">Bản dịch:</label>
          <div 
            ref={translatedTextRef}
            id="translatedText" 
            className="w-full min-h-32 max-h-96 p-4 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white overflow-y-auto whitespace-pre-wrap"
          >
            {translatedText}
          </div>
        </div>
      </main>

      <footer className="w-full text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} SyosetuVNTranslator - Công cụ dịch tiểu thuyết</p>
      </footer>
    </div>
  );
}
