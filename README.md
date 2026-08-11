# Swift Docs Vietnamese

[![CI](https://github.com/tanner-vo/Swift-documment-vietnmese/actions/workflows/ci.yml/badge.svg)](https://github.com/tanner-vo/Swift-documment-vietnmese/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![Content: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-lightgrey.svg)](CONTENT_LICENSE.md)

Ứng dụng web mã nguồn mở giúp người học đọc *The Swift Programming Language*
theo hai cột Anh–Việt, đối chiếu từng khối nội dung và giữ nguyên code/API quan
trọng.

> **English summary:** An early-stage, noncommercial bilingual reader that makes
> the official Swift language guide more accessible to Vietnamese learners. It
> parses Swift DocC data, preserves code and terminology, caches translations,
> and supports authenticated human corrections.

## Trạng thái dự án

Dự án đang ở giai đoạn **early-stage** và do một primary maintainer phụ trách.
Chúng tôi công khai trạng thái này để không phóng đại mức độ sử dụng hoặc độ hoàn
thiện. Mục tiêu trước mắt là xây dựng nền tảng đáng tin cậy, dễ kiểm chứng và dễ
đóng góp trước khi mở rộng cộng đồng.

## Vì sao dự án có ích

- Giảm rào cản ngôn ngữ cho người Việt đang học Swift và iOS.
- Cho phép đối chiếu bản gốc ngay cạnh bản dịch, thay vì che khuất nội dung nguồn.
- Giữ code examples, tên API, inline code và thuật ngữ Swift để hạn chế sai nghĩa.
- Tạo quy trình để cộng đồng đề xuất, thẩm định và lưu các bản sửa thủ công.
- Theo dõi thay đổi từ nguồn DocC để bản dịch có thể được cập nhật có hệ thống.

Dự án **không phải bản dịch chính thức của Apple hoặc Swift.org**. Khi cần độ
chính xác tuyệt đối, luôn đối chiếu tài liệu nguồn.

## Tính năng hiện có

- Đọc chapter theo route `/chapter/[slug]`.
- Danh sách chapter theo thứ tự tài liệu Swift gốc.
- Hiển thị song ngữ EN/VI theo từng block.
- Syntax highlighting cho code Swift.
- Ưu tiên DocC JSON, fallback sang HTML parser.
- Hỗ trợ paragraph, heading, code listing, list, term list, table và aside.
- Cache dịch in-memory và SQLite.
- Manual override có xác thực dành cho maintainer.
- Giao diện sáng/tối và responsive.

## Luồng dữ liệu

```text
Swift.org DocC JSON (ưu tiên) ─┐
                              ├─> parser ─> translation/cache ─> EN | VI reader
Swift.org HTML (fallback) ─────┘                         └─> maintainer override
```

Các module chính:

- `src/lib/swift-docs/chapters.ts`: danh mục chapter và URL nguồn.
- `src/lib/swift-docs/parse.ts`: parser DocC JSON/HTML.
- `src/lib/swift-docs/translate.ts`: dịch EN→VI và bảo toàn thuật ngữ.
- `src/lib/swift-docs/service.ts`: orchestration và merge manual override.
- `src/lib/db/sqlite.ts`: translation cache và manual corrections.
- `src/app/api/translation-override/route.ts`: API chỉnh sửa đã xác thực.

## Chạy local

Yêu cầu Node.js 20.9+ và npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

Kiểm tra chất lượng đầy đủ:

```bash
npm run check
```

## Cấu hình chỉnh sửa bản dịch

Public deployment mặc định chỉ đọc. Để maintainer chỉnh sửa:

1. Đặt `NEXT_PUBLIC_ENABLE_TRANSLATION_EDITING=true`.
2. Tạo `MAINTAINER_EDIT_TOKEN` ngẫu nhiên, tối thiểu 32 ký tự, trong secret store
   của môi trường deploy.
3. Không commit token thật vào repository hoặc gửi token trong issue/PR.

Ví dụ tạo token:

```bash
openssl rand -hex 32
```

## Đóng góp

Đọc [CONTRIBUTING.md](CONTRIBUTING.md) trước khi mở pull request. Các đóng góp có
giá trị cao gồm:

- sửa bản dịch kèm trích dẫn chapter/block nguồn;
- bổ sung thuật ngữ Swift vào glossary;
- fixture/test cho định dạng DocC mới;
- cải thiện accessibility và trải nghiệm đọc;
- triage issue, review PR và tài liệu release.

Quy tắc ứng xử nằm tại [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md); cách ra quyết
định và vai trò maintainer nằm tại [GOVERNANCE.md](GOVERNANCE.md).

## Bảo mật

Không công khai lỗ hổng có thể khai thác trong issue. Hãy làm theo
[SECURITY.md](SECURITY.md). Manual override được tắt mặc định và mọi mutation
phải xác thực lại tại Route Handler.

## Roadmap và maintainer automation

- [ROADMAP.md](ROADMAP.md): các mốc chất lượng, cộng đồng và đo lường tác động.
- [docs/MAINTAINER_AUTOMATION.md](docs/MAINTAINER_AUTOMATION.md): kế hoạch dùng
  Codex/OpenAI API cho review, triage, regression tests và cập nhật bản dịch.

## Giấy phép và ghi nhận nguồn

- Mã nguồn ứng dụng: [MIT License](LICENSE).
- Nội dung Swift gốc và các bản chuyển ngữ/phái sinh:
  [CC BY 4.0](CONTENT_LICENSE.md).
- Nguồn: [The Swift Programming Language](https://docs.swift.org/swift-book/).

Xem thêm [NOTICE](NOTICE) để biết phạm vi attribution và trademark disclaimer.
