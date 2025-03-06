import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center text-sm text-gray-600 dark:text-gray-400">
      <p>© {new Date().getFullYear()} SyosetuVNTranslator - Công cụ dịch tiểu thuyết</p>
    </footer>
  );
};

export default Footer; 