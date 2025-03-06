/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { initGemini } from "@/lib/gemini";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NovelDetails from "@/components/NovelDetails";
import TranslationEditor from "@/components/TranslationEditor";
import Dashboard from "@/components/Dashboard";
import Reader from "@/components/Reader";
import Footer from "@/components/Footer";
import ApiKeyModal from "@/components/ApiKeyModal";
import { NovelProvider } from "@/contexts/NovelContext";

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'editor' | 'reader'>('dashboard');

  // Khởi tạo Gemini khi trang được tải
  useEffect(() => {
    async function initialize() {
      try {
        const success = await initGemini();
        setIsInitialized(success);
        if (!success) {
          setInitError("Không thể khởi tạo dịch vụ. Vui lòng cung cấp API key.");
          setIsApiKeyModalOpen(true);
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo:", error);
        setInitError("Đã xảy ra lỗi khi khởi tạo dịch vụ. Vui lòng thử lại sau.");
        setIsApiKeyModalOpen(true);
      }
    }
    
    initialize();
  }, []);

  // Cuộn lên đầu trang khi chuyển đổi chế độ xem
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  const handleApiKeySuccess = async () => {
    try {
      const success = await initGemini();
      setIsInitialized(success);
      if (success) {
        setInitError("");
      } else {
        setInitError("API key không hợp lệ. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi khởi tạo với API key mới:", error);
      setInitError("Đã xảy ra lỗi khi khởi tạo với API key mới.");
    }
  };

  return (
    <NovelProvider>
      <div className="flex flex-col min-h-screen">
        <Header 
          initError={initError} 
          onApiKeyClick={() => setIsApiKeyModalOpen(true)}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        
        <div className="flex flex-1 overflow-hidden">
          {activeView !== 'reader' && <Sidebar />}
          
          <div className={`flex-1 ${activeView === 'reader' ? 'overflow-y-auto' : 'flex flex-col overflow-hidden'} ml-64`}>
            {activeView !== 'reader' && <NovelDetails />}
            
            {activeView === 'dashboard' && (
              <Dashboard />
            )}
            {activeView === 'editor' && (
              <TranslationEditor isInitialized={isInitialized} />
            )}
            {activeView === 'reader' && (
              <Reader />
            )}
          </div>
        </div>
        
        <Footer />
        
        <ApiKeyModal 
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          onSuccess={handleApiKeySuccess}
        />
      </div>
    </NovelProvider>
  );
}
