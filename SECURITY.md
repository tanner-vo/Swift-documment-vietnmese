# Security policy

## Phiên bản được hỗ trợ

Trong giai đoạn early-stage, nhánh `main` là phiên bản duy nhất được hỗ trợ bảo
mật. Các commit cũ và fork bên ngoài không nằm trong phạm vi hỗ trợ.

## Báo cáo lỗ hổng

Không mở public issue cho lỗ hổng chưa được vá.

1. Dùng **GitHub Security Advisories → Report a vulnerability** của repository.
2. Nếu private reporting chưa khả dụng, liên hệ maintainer qua hồ sơ GitHub
   `tanner-vo` và chỉ gửi mô tả tối thiểu để thiết lập kênh riêng tư.
3. Không gửi secret thật, dữ liệu người dùng hoặc exploit phá hoại.

Báo cáo nên gồm phiên bản/commit, ảnh hưởng, bước tái hiện an toàn và đề xuất
giảm thiểu. Maintainer sẽ cố gắng xác nhận trong 7 ngày và cập nhật tiến độ ít
nhất mỗi 14 ngày cho đến khi xử lý xong.

## Phạm vi ưu tiên

- bypass xác thực manual translation override;
- injection hoặc ghi dữ liệu ngoài phạm vi SQLite mong đợi;
- lộ token/environment variable;
- SSRF hoặc xử lý dữ liệu DocC/HTML không tin cậy;
- dependency supply-chain và GitHub Actions permissions;
- cross-site scripting trong nội dung được render.

## Nguyên tắc vận hành

- Public deployment mặc định chỉ đọc.
- `MAINTAINER_EDIT_TOKEN` phải dài ít nhất 32 ký tự và nằm trong secret store.
- Không dùng biến `NEXT_PUBLIC_*` cho secret.
- Token được xoay vòng sau nghi ngờ lộ lọt hoặc thay đổi maintainer.
- Workflow mặc định chỉ có `contents: read`.
- Dữ liệu từ Swift.org và payload phía client được xem là không tin cậy.
