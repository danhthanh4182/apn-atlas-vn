# APN Atlas VN — Brand Logo Assets & Variants

Tài liệu và tệp thiết kế logo thương hiệu APN Atlas VN, cung cấp đầy đủ 3 biến thể theo các định dạng vector SVG, raster PNG (512, 192, 48, 32, 16 px) và ICO (multi-resolution favicon).

---

## 3 Biến thể Logo

### 1. Variant 1: Telecom Apex (Đang kích hoạt)
- **Thư mục:** `assets/brand/variant-1-apex/`
- **Ý nghĩa:** Chữ **A** kiến trúc kết hợp cột sóng phát thanh viễn thông và các dải sóng cellular phát ra từ đỉnh, biểu tượng cho kết nối mạng di động Việt Nam.
- **Tệp:**
  - `icon.svg` — Vector master (512×512)
  - `icon-512.png`, `icon-192.png`, `icon-48.png`, `icon-32.png`, `icon-16.png`
  - `favicon.ico` — Multi-res icon (16, 32, 48 px)

### 2. Variant 2: Bold Scaled
- **Thư mục:** `assets/brand/variant-2-bold/`
- **Ý nghĩa:** Phiên bản dải sóng và tháp A phóng lớn, đường nét dày 36px, lấp đầy không gian squircle, độ tương phản cao khi hiển thị ở kích thước nhỏ.
- **Tệp:** `icon.svg`, `icon-512.png`, `icon-192.png`, `icon-48.png`, `icon-32.png`, `icon-16.png`, `favicon.ico`

### 3. Variant 3: Iconic Monogram
- **Thư mục:** `assets/brand/variant-3-monogram/`
- **Ý nghĩa:** Chữ A hình học nguyên khối với 2 dải sóng phát xạ góc trên bên phải, phong cách hiện đại tối giản.
- **Tệp:** `icon.svg`, `icon-512.png`, `icon-192.png`, `icon-48.png`, `icon-32.png`, `icon-16.png`, `favicon.ico`

---

## Cách đổi Logo hiển thị trên App

1. **Đổi Favicon & App Icon gốc:**
   Sao chép tệp `icon.svg` từ thư mục biến thể mong muốn vào `assets/icon.svg`:
   ```bash
   cp assets/brand/variant-2-bold/icon.svg assets/icon.svg
   ```

2. **Đổi biểu tượng SVG trên giao diện web (Sidebar & Header):**
   Trong `index.html`, cập nhật nội dung symbol `<symbol id="i-app-logo" viewBox="0 0 48 48">` tương ứng với biến thể đã chọn.

3. **Chạy lại lệnh build:**
   ```bash
   npm run build:site && npm run build:web
   ```
