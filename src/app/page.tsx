export default function Home() {
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
          />
        </div>
        
        <div className="flex justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            Dịch ngay
          </button>
        </div>
        
        <div className="w-full">
          <label htmlFor="translatedText" className="block mb-2 font-medium">Bản dịch:</label>
          <div id="translatedText" className="w-full min-h-32 p-4 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white">
            Bản dịch sẽ xuất hiện ở đây...
          </div>
        </div>
      </main>

      <footer className="w-full text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© 2023 SyosetuVNTranslator - Công cụ dịch tiểu thuyết</p>
      </footer>
    </div>
  );
}
