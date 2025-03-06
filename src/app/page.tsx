"use client";

import { useState, useEffect } from "react";
import { initGemini } from "@/lib/gemini";
import Header from "@/components/Header";
import TranslationArea from "@/components/TranslationArea";
import Footer from "@/components/Footer";

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState("");

  // Khởi tạo Gemini khi trang được tải
  useEffect(() => {
    async function initialize() {
      try {
        const success = await initGemini();
        setIsInitialized(success);
        if (!success) {
          setInitError("Không thể khởi tạo dịch vụ. Vui lòng thử lại sau.");
        }
      } catch (error) {
        console.error("Lỗi khi khởi tạo:", error);
        setInitError("Đã xảy ra lỗi khi khởi tạo dịch vụ. Vui lòng thử lại sau.");
      }
    }
    
    initialize();
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header initError={initError} />
      <TranslationArea isInitialized={isInitialized} />
      <Footer />
    </div>
  );
}
