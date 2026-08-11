# Contributing

Cảm ơn bạn đã giúp tài liệu Swift dễ tiếp cận hơn với cộng đồng Việt Nam.

## Trước khi bắt đầu

- Đọc [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- Tìm issue/PR tương tự để tránh trùng lặp.
- Với thay đổi lớn, mở feature request để thống nhất phạm vi trước.
- Không đưa secret, dữ liệu cá nhân hoặc nội dung không có quyền sử dụng vào PR.

## Loại đóng góp

### Sửa bản dịch

Một báo cáo/sửa đổi tốt cần có:

- chapter URL hoặc slug;
- block/đoạn tiếng Anh gốc;
- bản dịch hiện tại và bản dịch đề xuất;
- lý do, tài liệu tham khảo hoặc glossary liên quan;
- xác nhận code, API names và inline syntax không bị dịch sai.

Ưu tiên câu tiếng Việt tự nhiên nhưng không làm mất nghĩa kỹ thuật. Các thuật
ngữ Swift đã phổ biến có thể giữ nguyên và giải thích khi xuất hiện lần đầu.

### Parser và code

- Thêm fixture nhỏ nhất tái hiện định dạng DocC/HTML bị lỗi.
- Không tải hoặc commit toàn bộ tài liệu nguồn nếu không cần thiết.
- Giữ logic parsing xác định (deterministic) và tránh side effect.
- Mọi mutation phải validate input và xác thực ở server boundary.

## Thiết lập local

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Trước khi gửi PR:

```bash
npm run check
```

## Commit và pull request

- Viết commit ngắn, ở thể mệnh lệnh; Conventional Commits được khuyến khích.
- Giữ mỗi PR tập trung vào một mục tiêu.
- Mô tả vấn đề, giải pháp, cách kiểm tra và ảnh hưởng tới license/attribution.
- Liên kết issue bằng `Closes #...` nếu phù hợp.
- Với UI, thêm ảnh trước/sau; với parser, thêm input/output mẫu.
- Maintainer có thể yêu cầu chỉnh sửa trước khi merge.

## Tiêu chí review

PR được đánh giá theo:

1. độ chính xác so với nguồn Swift.org;
2. khả năng bảo toàn code và thuật ngữ;
3. bảo mật, quyền riêng tư và phạm vi dữ liệu;
4. test/build và khả năng bảo trì;
5. attribution và tương thích giấy phép.

## License của đóng góp

Khi gửi contribution, bạn đồng ý cấp phép phần mã nguồn theo MIT và phần nội
dung dịch/phái sinh theo CC BY 4.0, phù hợp với các file license của dự án.
