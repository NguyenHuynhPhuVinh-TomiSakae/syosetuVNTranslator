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
          
          <button
            onClick={onApiKeyClick}
            className={`flex items-center px-3 py-2 rounded-md text-sm ${
              initError ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            {initError ? 'Cấu hình API Key' : 'Cài đặt API'}
          </button>
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