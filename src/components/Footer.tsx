import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-sm p-4 border-t border-gray-200">
      <div className="container mx-auto text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} SyosetuVNTranslator - Công cụ quản lý và dịch tiểu thuyết</p>
      </div>
    </footer>
  );
};

export default Footer; 