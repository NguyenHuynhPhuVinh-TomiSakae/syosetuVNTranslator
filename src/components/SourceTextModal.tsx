import React, { useRef, useEffect } from 'react';

interface SourceTextModalProps {
  isOpen: boolean;
  sourceText: string;
  isTranslating: boolean;
  onClose: () => void;
  onTextChange: (text: string) => void;
  onTranslate: () => void;
}

const SourceTextModal: React.FC<SourceTextModalProps> = ({
  isOpen,
  sourceText,
  isTranslating,
  onClose,
  onTextChange,
  onTranslate
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus vào textarea khi modal mở
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Dán văn bản nguồn</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 flex-grow overflow-hidden">
          <textarea 
            ref={textareaRef}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Dán đoạn tiểu thuyết cần dịch vào đây..."
            value={sourceText}
            onChange={(e) => onTextChange(e.target.value)}
          />
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={onTranslate}
            disabled={!sourceText.trim() || isTranslating}
            className={`px-4 py-2 ${!sourceText.trim() || isTranslating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors`}
          >
            {isTranslating ? "Đang dịch..." : "Dịch ngay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SourceTextModal; 