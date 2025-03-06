import React from 'react';

interface HeaderProps {
  initError?: string;
  onApiKeyClick: () => void;
  activeView?: 'dashboard' | 'editor' | 'reader';
  setActiveView?: (view: 'dashboard' | 'editor' | 'reader') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  initError, 
  onApiKeyClick,
  activeView = 'dashboard',
  setActiveView
}) => {
  return (
    <header className="bg-white shadow-sm p-4 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">SyosetuVNTranslator</h1>
        
        <div className="flex items-center space-x-4">
          {setActiveView && (
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 text-sm ${
                  activeView === 'dashboard' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Quản lý
              </button>
              <button
                onClick={() => setActiveView('editor')}
                className={`px-4 py-2 text-sm ${
                  activeView === 'editor' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Biên tập
              </button>
              <button
                onClick={() => setActiveView('reader')}
                className={`px-4 py-2 text-sm ${
                  activeView === 'reader' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Đọc truyện
              </button>
            </div>
          )}
          
          <p className="text-gray-600 hidden md:block">Công cụ quản lý và dịch tiểu thuyết từ Syosetu sang tiếng Việt</p>
          
          {initError && (
            <button
              onClick={onApiKeyClick}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Cấu hình API Key
            </button>
          )}
        </div>
      </div>
      
      {initError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mt-2">
          <p>{initError}</p>
        </div>
      )}
    </header>
  );
};

export default Header; 