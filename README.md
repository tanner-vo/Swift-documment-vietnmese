# Swift Docs Bilingual (EN ↔ VI)

Web app đọc tài liệu Swift theo chế độ song ngữ 2 cột:

- Cột trái: English gốc
- Cột phải: bản dịch tiếng Việt

Mục tiêu dịch:

- Dịch phần giải thích, mô tả, ghi chú
- Giữ nguyên code examples, cú pháp, tên hàm/API và technical terms quan trọng

## Tính năng chính

- Đọc chapter theo route: `/chapter/[slug]`
- Danh sách chapter đầy đủ và đúng thứ tự theo Swift docs gốc
- Hiển thị song ngữ EN/VI theo từng block nội dung
- Code block có syntax highlight
- Cache dịch bền vững bằng SQLite
- Chỉnh sửa bản dịch thủ công theo từng block (save/reset)
- Ưu tiên lấy dữ liệu từ DocC JSON endpoint của Swift docs (ổn định hơn HTML shell)
- Fallback sang HTML parser khi cần
- Parser DocC hỗ trợ thêm `termList` và `table` để tăng độ phủ nội dung chapter

## Cài đặt và chạy

Yêu cầu:

- Node.js 20+
- npm

Chạy local:

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

Build production:

```bash
npm run build
npm run start
```

## Cấu trúc quan trọng

- `src/lib/swift-docs/chapters.ts`
  - Danh sách chapter và URL nguồn
  - Có cả URL HTML và URL DocC JSON
- `src/lib/swift-docs/service.ts`
  - Luồng chính: fetch chapter → parse → dịch → merge override
- `src/lib/swift-docs/parse.ts`
  - Parser DocC JSON (ưu tiên)
  - Parser HTML (fallback)
  - Hỗ trợ `heading`, `paragraph`, `codeListing`, `orderedList`, `unorderedList`, `termList`, `table`, `aside`
- `src/lib/swift-docs/translate.ts`
  - Dịch EN → VI, bảo toàn inline code + glossary terms
- `src/lib/db/sqlite.ts`
  - SQLite schema + CRUD cho cache dịch và manual overrides
- `src/app/api/translation-override/route.ts`
  - API lưu/reset bản dịch tay theo block

## Dữ liệu và cache

SQLite file nằm trong thư mục `data/`.

Sử dụng 2 lớp cache:

- In-memory cache (nhanh trong runtime)
- Persistent cache SQLite (giữ lại sau khi restart)

## Troubleshooting

### 1) Chapter hiện rỗng

Ứng dụng hiện ưu tiên DocC JSON endpoint:

- `https://docs.swift.org/swift-book/data/documentation/the-swift-programming-language/<slug>.json`

Nếu chapter vẫn rỗng:

- Kiểm tra mạng ra `docs.swift.org`
- Kiểm tra slug có hợp lệ trong danh sách chapter
- Xem log server để biết đang fail ở JSON hay fallback HTML

### 2) Dịch tự động chưa tốt

- Bạn có thể bật chế độ chỉnh sửa và lưu bản dịch tay theo từng block
- Bản dịch tay sẽ override bản auto cho lần mở sau

### 3) Hydration warning ở `layout.tsx`

Nếu bạn thấy cảnh báo hydration mismatch ở thẻ `<html>` className trong môi trường dev,
thường do extension/trình duyệt can thiệp DOM trước khi React hydrate.

Dự án đã thêm `suppressHydrationWarning` ở root layout để giảm cảnh báo nhiễu loại này.

## Giấy phép nội dung nguồn

Nội dung tài liệu Swift gốc thuộc Swift.org, phát hành theo CC BY 4.0.

Dự án này là bản chuyển ngữ/biên tập phục vụ học tập, cần:

- Ghi nhận nguồn (attribution)
- Nêu rõ đã có chỉnh sửa/dịch
- Giữ liên kết tới giấy phép CC BY 4.0
# Swift-documment-vietnmese
