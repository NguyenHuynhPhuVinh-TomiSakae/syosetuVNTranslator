/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerativeModel,
  ChatSession,
  GenerateContentStreamResult
} from "@google/generative-ai";

let apiKey = "";
let genAI: GoogleGenerativeAI;
let model: GenerativeModel;

const systemPrompt = `Bạn là một dịch giả chuyên nghiệp, chuyên dịch tiểu thuyết Nhật Bản (từ trang Syosetu) sang tiếng Việt. Hãy tuân thủ các nguyên tắc sau:

1. Dịch chính xác nội dung gốc, giữ nguyên ý nghĩa và cảm xúc của tác giả.
2. Sử dụng ngôn ngữ tự nhiên, trôi chảy và phù hợp với văn phong tiểu thuyết tiếng Việt.
3. Giữ nguyên tên riêng, địa danh và thuật ngữ đặc biệt trong thế giới tiểu thuyết.
4. Chuyển đổi các biểu thức và thành ngữ Nhật Bản sang các biểu thức tương đương trong tiếng Việt.
5. Duy trì cấu trúc đoạn văn và định dạng của bản gốc.
6. Đảm bảo tính nhất quán trong việc sử dụng thuật ngữ và phong cách dịch.
7. Chỉ trả về bản dịch tiếng Việt, không thêm bất kỳ giải thích hay bình luận nào.

Hãy dịch văn bản được cung cấp sang tiếng Việt một cách tự nhiên và chuyên nghiệp.`;

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export async function initGemini(): Promise<boolean> {
  try {
    // Thử lấy API key từ localStorage trước
    const savedApiKey = localStorage.getItem('gemini_api_key');
    
    if (savedApiKey) {
      apiKey = savedApiKey;
    } else {
      // Nếu không có trong localStorage, thử lấy từ server
      const response = await fetch('/api/gemini-key');
      const data = await response.json();
      
      if (data.error) {
        console.error("Lỗi khi lấy API key:", data.error);
        return false;
      }
      
      apiKey = data.apiKey;
      
      // Lưu API key vào localStorage để sử dụng sau này
      localStorage.setItem('gemini_api_key', apiKey);
    }
    
    // Khởi tạo Gemini với API key
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
      safetySettings,
    });
    
    return true;
  } catch (error) {
    console.error("Lỗi khi khởi tạo Gemini:", error);
    return false;
  }
}

export async function translateTextStream(text: string): Promise<GenerateContentStreamResult> {
  if (!model) {
    throw new Error("Gemini chưa được khởi tạo");
  }
  
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "Tôi sẽ dịch văn bản từ tiếng Nhật sang tiếng Việt theo yêu cầu của bạn." }],
      },
    ],
  });
  
  return chat.sendMessageStream(text);
}

// Thêm hàm để người dùng có thể cập nhật API key
export function updateApiKey(newApiKey: string): void {
  apiKey = newApiKey;
  localStorage.setItem('gemini_api_key', apiKey);
  
  // Khởi tạo lại Gemini với API key mới
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig,
    safetySettings,
  });
} 