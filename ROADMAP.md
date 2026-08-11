# Roadmap

Roadmap là định hướng, không phải cam kết thời hạn. Issue và dữ liệu sử dụng thực
tế sẽ quyết định thứ tự ưu tiên.

## 0.1 — Open-source foundation

- [x] License cho code và nội dung phái sinh.
- [x] Contributing, governance, code of conduct và security policy.
- [x] Issue/PR templates và CI tối thiểu.
- [x] Khóa API manual override bằng xác thực maintainer.
- [ ] Bật GitHub private vulnerability reporting và branch protection.
- [ ] Thêm repository description, topics và social preview.

## 0.2 — Translation quality

- [ ] Glossary có version và quy trình review thuật ngữ.
- [ ] Fixtures cho DocC paragraph, list, termList, table và aside.
- [ ] Regression tests bảo toàn code/inline code/URL.
- [ ] Translation quality checklist và sampling theo chapter.
- [ ] Export/import manual corrections có lịch sử review.

## 0.3 — Maintainer automation

- [ ] Bot phát hiện thay đổi upstream Swift DocC.
- [ ] Tạo issue/PR có diff theo block thay đổi.
- [ ] Gợi ý bản dịch bằng OpenAI API, bắt buộc human review trước merge.
- [ ] Tự động triage issue, draft release notes và review checklist.
- [ ] Security scanning và dependency review định kỳ.

## 1.0 — Community-ready

- [ ] Tài liệu deploy và backup/restore.
- [ ] Accessibility audit (WCAG 2.2 AA mục tiêu).
- [ ] Contributor reviewers cho translation và code.
- [ ] Public release cadence và changelog ổn định.
- [ ] Dashboard minh bạch cho coverage, corrections và thời gian review.

## Chỉ số tác động dự kiến theo dõi

- số chapter/blocks có coverage;
- số correction được human review;
- thời gian từ upstream change đến bản cập nhật;
- số issue/PR và contributor hoạt động;
- lỗi parser/translation regression được phát hiện trước release.

Không công bố số liệu ước đoán như số người dùng hoặc downloads nếu chưa có nguồn
đo lường đáng tin cậy.
