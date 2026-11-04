# Kiểm tra tính toán AHP – lựa chọn phương án

Trang web tĩnh giúp sinh viên tự kiểm tra bài tính AHP:

1. Nhập điểm so sánh cặp đôi các phương án theo từng tiêu chí → trọng số của từng phương án theo tiêu chí đó.
2. Nhập điểm so sánh cặp đôi các tiêu chí → trọng số của từng tiêu chí.
3. Điểm có trọng số = trọng số tiêu chí × trọng số phương án theo tiêu chí.
4. Tổng điểm có trọng số và xếp hạng các phương án.

**Khi mở trang lần đầu:** bài trống với tên phương án/tiêu chí của ví dụ (Tom, Dick, Harry; Kinh nghiệm, Trình độ, Khả năng lãnh đạo, Tuổi), mọi cặp so sánh đều là 1 – 1, chưa có đáp án nào. Nút “Nạp ví dụ Tom – Dick – Harry” nạp điểm so sánh của ví dụ trong slide.

**Thang điểm và quy tắc nhập** (Bước 0): khai báo điểm tối đa của thang (mặc định 9, như slide). Mỗi ô điểm nhận số từ 1 đến điểm tối đa (cho phép số thập phân như 1,2); trong mỗi cặp, ô của yếu tố kém hơn luôn là 1. Cặp nào vượt thang, có điểm nhỏ hơn 1, hoặc có ô thấp hơn khác 1 sẽ bị tô đỏ kèm lý do và chưa được đưa vào tính toán.

**Bảng giải thích thang điểm** thay đổi theo thang đã khai báo:
- Thang có bảng sẵn (hiện có thang 1–9, chép nguyên văn slide 48): trang hiện bảng đó.
- Thang chưa có bảng sẵn (ví dụ 1–15, 1–17): sinh viên tự ghi định nghĩa và giải thích cho các mức điểm (có thể chỉ ghi các mốc chính, thêm/xóa dòng tùy ý). Bảng tự ghi được lưu cùng bài làm và in kèm khi lưu PDF.
- Thêm bảng sẵn cho một thang mới: trong `index.html`, tìm `SCALE_TABLES` và thêm một mục theo đúng mẫu của thang `'9'` (khóa là điểm tối đa của thang).

**Chế độ chấm bài:** các ô kết quả trở thành ô để sinh viên nhập đáp án của mình. Trang đánh dấu ✓/✗ từng ô theo sai số cho phép và đếm số ô đúng/sai/chưa nhập.
- Bước 1–2: sinh viên điền trọng số; trang chấm theo kết quả trang tự tính.
- Bước 3: cột trọng số tiêu chí và cột điểm chưa có trọng số tự hiện đúng các số sinh viên đã điền ở Bước 2 và Bước 1; sinh viên chỉ điền điểm đã có trọng số, trang chấm theo tích hai số đó.
- Bước 4: các cột tiêu chí tự hiện điểm đã có trọng số sinh viên đã điền ở Bước 3; sinh viên chỉ điền tổng, trang chấm theo tổng các số đó.
- Như vậy một lỗi ở bước trước không kéo theo sai dây chuyền ở bước sau. Ô nào chưa đủ số liệu ở bước trước thì bị khóa.
- Xem đáp án theo từng bảng: khi sinh viên đã nhập đủ mọi ô của một bảng (đúng hay sai), hiện nút “Xem đáp án bảng này”; bấm vào thì bảng đó hiện đáp án trong ngoặc cạnh từng ô (ở Bước 1–2 kèm chi tiết các lần bình phương).

**Hai đường link:**

| Link | Dành cho | Hiển thị |
|---|---|---|
| `https://<tên-tài-khoản>.github.io/ahp-checker/` | Sinh viên | Luôn ở chế độ chấm bài, sai số cố định ±0,001; không có nút tắt chấm bài, chọn sai số hay hiện đáp án |
| `https://<tên-tài-khoản>.github.io/ahp-checker/?gv` | Giảng viên | Đủ các nút: bật/tắt chấm bài, chọn sai số (±0,0001 đến ±0,005), “Hiện đáp án đúng” |

Chỉ gửi link thứ nhất cho sinh viên. Lưu ý: trang chạy hoàn toàn trên trình duyệt nên người biết thêm `?gv` hoặc mở mã nguồn vẫn xem được đáp án; trang phù hợp để tự kiểm tra, không thay cho bài kiểm tra có giám sát.

Cách tính giống ví dụ Tom – Dick – Harry trong slide: bình phương ma trận liên tiếp, cộng theo hàng, chia cho tổng; mặc định lấy trọng số ở lần bình phương thứ 2 (có thể đổi). Phần CR (tỷ số nhất quán) là thông tin tham khảo bổ sung.

## Các file

| File | Vai trò |
|---|---|
| `index.html` | Giao diện trang |
| `ahp.js` | Phần tính toán |
| `README.md` | Hướng dẫn này |

## Đưa lên GitHub Pages (không cần cài đặt gì)

1. Đăng nhập GitHub → nút **New** (tạo repository mới), đặt tên ví dụ `ahp-checker`, chọn **Public** → **Create repository**.
2. Trong repository vừa tạo, bấm **uploading an existing file** (hoặc **Add file → Upload files**), kéo thả cả 3 file `index.html`, `ahp.js`, `README.md` → **Commit changes**.
3. Vào **Settings → Pages**. Ở mục **Build and deployment**, *Source* chọn **Deploy from a branch**; *Branch* chọn **main** và thư mục **/(root)** → **Save**.
4. Đợi 1–2 phút, tải lại trang Settings → Pages sẽ hiện địa chỉ dạng
   `https://<tên-tài-khoản>.github.io/ahp-checker/` — gửi địa chỉ này cho sinh viên.

Muốn sửa trang: mở file trên GitHub → biểu tượng bút chì → sửa → **Commit changes**; trang tự cập nhật sau 1–2 phút.

## Chạy thử trên máy

Mở `index.html` trực tiếp bằng trình duyệt là dùng được (hai file `index.html` và `ahp.js` phải nằm cùng thư mục).
