import React from 'react';

interface HeaderProps {
  initError: string;
}

const Header: React.FC<HeaderProps> = ({ initError }) => {
  return (
    <header className="w-full text-center">
      <h1 className="text-3xl font-bold mb-4">SyosetuVNTranslator</h1>
      <p className="text-gray-600 dark:text-gray-400">Công cụ dịch tiểu thuyết từ Syosetu sang tiếng Việt</p>
      {initError && <p className="text-red-500 mt-2">{initError}</p>}
    </header>
  );
};

export default Header; 