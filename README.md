# SyosetuVNTranslator

Ứng dụng web hỗ trợ dịch tiểu thuyết từ trang Syosetu sang tiếng Việt sử dụng Google Gemini AI.

## Tính năng chính

- 🤖 Sử dụng Google Gemini AI để dịch văn bản
- 📚 Hỗ trợ dịch theo ngữ cảnh với các chương trước
- 📖 Phân tích cấu trúc ngữ pháp và giải thích cách dịch
- 🔄 Hỗ trợ thuật ngữ riêng (Glossary) để đảm bảo tính nhất quán
- 💾 Lưu trữ cục bộ với IndexedDB
- ⚡ Xây dựng trên Next.js với Turbopack để tối ưu hiệu suất

## Yêu cầu hệ thống

- Node.js 18.0.0 trở lên
- Google Gemini API Key
- Docker và Docker Compose (nếu sử dụng container)

## Cài đặt và Chạy

### Sử dụng Docker Compose (Khuyến nghị)

1. Tạo file .env với API key:
```bash
echo "GEMINI_API_KEY=your_api_key" > .env
```

2. Khởi chạy ứng dụng với Docker Compose:
```bash
docker compose up -d
```

3. Dừng ứng dụng:
```bash
docker compose down
```

### Sử dụng Docker thông thường

1. Build image:
```bash
docker build -t syosetuvntranslator .
```

2. Chạy container:
```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=your_api_key syosetuvntranslator
```

### Cài đặt thủ công

1. Clone repository:
```bash
git clone https://github.com/yourusername/syosetuvntranslator.git
cd syosetuvntranslator
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env và thêm API key:
```
GEMINI_API_KEY=your_api_key
```

4. Chạy ứng dụng:
```bash
npm run dev
```

Truy cập http://localhost:3000 để sử dụng ứng dụng.

## Cấu trúc dự án

```
syosetuvntranslator/
├── src/
│   ├── lib/           # Thư viện và utilities
│   │   └── gemini.ts  # Xử lý tích hợp Gemini AI
│   ├── components/    # React components
│   └── pages/         # Next.js pages
├── public/           # Static files
├── Dockerfile        # Cấu hình Docker
├── docker-compose.yml # Cấu hình Docker Compose
└── ...
```

## Công nghệ sử dụng

- Next.js 15.2.1
- React 19
- Google Generative AI SDK
- TailwindCSS
- TypeScript
- IndexedDB (idb)
- Docker & Docker Compose

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request để cải thiện dự án.

## Giấy phép

MIT License

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.