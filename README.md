# Tiên Lộ: Khởi Nguyên

Game tu tiên nhàn rỗi 2D chạy trên trình duyệt, viết bằng HTML/CSS/JavaScript thuần. Đây là dự án độc lập lấy cảm hứng từ thể loại idle RPG, không sử dụng tài nguyên hay mã nguồn độc quyền của trò chơi khác.

## Tính năng trong bản thử nghiệm
- Tự động chiến đấu theo thời gian.
- Cấp độ, EXP, tu vi và cảnh giới.
- Linh thạch, hồi phục sinh lực.
- 6 bản đồ mở khóa theo cấp.
- 3 loại trang bị tự động nhặt: vũ khí, pháp y, linh vật.
- Triệu hồi Boss khu vực bằng cách nhấn đúp vào biểu tượng yêu thú.
- Lưu tự động bằng `localStorage`.
- Thưởng tu luyện ngoại tuyến khi mở lại game (tối đa 8 giờ).

## Chạy trên máy
1. Tải hoặc giải nén dự án.
2. Mở `index.html` bằng Chrome, Edge hoặc Firefox.
3. Nên dùng trình duyệt hiện đại và bật JavaScript.

Không cần cài thư viện hay chạy máy chủ để chơi bản cơ bản.

## Đưa lên GitHub Pages
1. Đăng nhập GitHub và tạo repository mới, ví dụ `tien-lo-khoi-nguyen`.
2. Đặt repository ở chế độ **Public** nếu muốn dùng GitHub Pages miễn phí.
3. Tải lên `index.html`, `style.css`, `game.js` và `README.md` ở thư mục gốc repository.
4. Vào **Settings → Pages**.
5. Trong **Build and deployment**, chọn **Deploy from a branch**.
6. Chọn branch `main` và folder `/(root)`, sau đó nhấn **Save**.
7. Chờ GitHub triển khai. Địa chỉ game sẽ có dạng:
   `https://TEN-TAI-KHOAN.github.io/tien-lo-khoi-nguyen/`

## Đưa mã nguồn lên bằng Git (nếu đã cài Git)
Mở terminal trong thư mục dự án rồi chạy:

```bash
git init
git add .
git commit -m "Initial version of Tien Lo Khoi Nguyen"
git branch -M main
git remote add origin https://github.com/TEN-TAI-KHOAN/tien-lo-khoi-nguyen.git
git push -u origin main
```

Thay `TEN-TAI-KHOAN` bằng tên tài khoản GitHub của bạn. Nếu repository đã có commit hoặc remote, kiểm tra trước khi chạy các lệnh này.

## Điều khiển
- Game tự đánh quái mỗi giây.
- **Tĩnh tâm tu luyện**: nhận tu vi, một ít EXP và hồi máu.
- **Hồi phục**: tiêu hao 20 linh thạch.
- Chọn thẻ bản đồ đã mở để di chuyển.
- Nhấn đúp vào biểu tượng yêu thú để gọi Boss.
- Dữ liệu lưu trên trình duyệt hiện tại; mở trình duyệt khác hoặc xóa dữ liệu trang web sẽ không tự đồng bộ.

## Cấu trúc
```text
tien-lo-khoi-nguyen/
├── index.html   # Giao diện game
├── style.css    # Giao diện responsive
├── game.js      # Logic chiến đấu, tu luyện, trang bị, lưu game
└── README.md    # Hướng dẫn chạy và triển khai
```

## Hướng phát triển tiếp
Có thể bổ sung hệ thống linh thú đi theo, kỹ năng chủ động, nhiệm vụ ngày, âm thanh, hiệu ứng chiến đấu, dữ liệu cloud và cân bằng chỉ số. Bản hiện tại là prototype có thể chơi, chưa phải game online nhiều người chơi.
