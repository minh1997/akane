# Một đóa nở

Website nghệ thuật tương tác: cuộn xuống để cây lớn lên và nở hoa đỏ.

## Chạy bằng npm

Cài Node.js 18 trở lên (đã bao gồm npm), sau đó chạy:

```bash
cd /Users/mink/sites/mot-doa-no
npm run dev
```

Mở http://localhost:8080. Nhấn Ctrl+C để dừng.

Không cần Python hay `npm install`. `npm start` cũng chạy cùng máy chủ.
Nếu cổng đang được dùng, chạy `npm run dev -- --port 8081` rồi mở http://localhost:8081.

## Mã nguồn

- package.json: cấu hình lệnh npm.
- server.mjs: máy chủ local bằng Node.js.
- index.html: cấu trúc trang, nội dung và hình cây/hoa SVG.
- style.css: giao diện và bố cục điện thoại/máy tính.
- app.js: tăng trưởng theo cuộn, hoa nở, chuyển giai đoạn, âm thanh và xem lại.

Không cần cài thư viện hoặc chạy bước build. Toàn bộ ba file trên là mã nguồn có thể chỉnh sửa.
Phông chữ tải từ Google Fonts khi có mạng; khi ngoại tuyến trang dùng phông chữ dự phòng.
Âm thanh chỉ phát khi người xem bấm bật.

## Đưa lên hosting riêng

Đây là website tĩnh. Upload index.html, style.css và app.js vào cùng thư mục gốc của bất kỳ dịch vụ hosting tĩnh hoặc web server nào. Không cần tài khoản Sites hay dịch vụ backend để chạy bản này.
