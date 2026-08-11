# Governance

## Mô hình hiện tại

`tanner-vo` là repository owner và **primary maintainer**. Dự án hiện theo mô
hình benevolent maintainer trong giai đoạn đầu, với mục tiêu mở rộng quyền review
khi có contributor ổn định.

## Trách nhiệm của primary maintainer

- triage issue và pull request;
- bảo vệ chất lượng bản dịch và attribution;
- review dependency/security updates;
- duy trì CI, release notes và roadmap;
- quản lý secret, deployment và quyền ghi;
- công khai xung đột lợi ích có liên quan.

## Ra quyết định

- Thay đổi nhỏ được merge sau khi CI đạt và review hoàn tất.
- Thay đổi ảnh hưởng kiến trúc, license, dữ liệu hoặc glossary cần issue thảo luận.
- Ưu tiên đồng thuận; khi chưa đạt đồng thuận, primary maintainer ghi lại quyết
  định và lý do trong issue/PR.
- Security fix có thể được xử lý riêng tư trước khi công bố có phối hợp.

## Trở thành reviewer/core maintainer

Contributor có thể được mời làm reviewer hoặc core maintainer dựa trên lịch sử
đóng góp bền vững, review có chất lượng, hành vi cộng đồng và hiểu biết về phạm
vi license. Quyền được cấp theo nguyên tắc tối thiểu cần thiết và có thể thu hồi
khi không còn hoạt động hoặc có rủi ro bảo mật.

## Release

Release dùng Semantic Versioning khi dự án bắt đầu phát hành version ổn định.
Mọi release cần changelog, CI xanh và ghi nhận contributor. Breaking changes
phải được đánh dấu rõ.

## Kế nhiệm

Nếu primary maintainer không thể tiếp tục, quyền quản trị nên được chuyển cho
core maintainer có lịch sử đóng góp và được cộng đồng tin cậy. Thảo luận kế nhiệm
được ghi lại công khai trừ thông tin bảo mật hoặc cá nhân.
