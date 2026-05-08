# 🔧 Hướng Dẫn Cấu Hình Chi Tiết - VLU Connect

## 📝 Bước 1: Chuẩn Bị

Bạn cần:
- Một tài khoản Azure AD (Microsoft)
- Quyền quản trị trong Azure đăng ký
- Terminal/Command Prompt
- Text editor

## 🔐 Bước 2: Tạo Application trong Azure Portal

### Truy cập Azure Portal
1. Mở https://portal.azure.com
2. Đăng nhập bằng tài khoản có quyền quản trị

### Đăng Ký Ứng Dụng

1. **Tìm Azure Active Directory**
   - Sử dụng thanh tìm kiếm trên cùng
   - Chọn "Azure Active Directory"

2. **Tạo App Registration**
   - Click "App registrations" ở menu bên trái
   - Chọn "New registration"
   - Nhập tên ứng dụng: `VLU Connect`
   - Chọn tài khoản loại: `Accounts in this organizational directory only`
   - Nhập Redirect URI:
     ```
     http://localhost:3000/auth/callback
     ```
   - Click "Register"

### Lấy Thông Tin Cấu Hình

Sau khi đăng ký, bạn sẽ thấy trang Overview. **Sao chép các giá trị này:**

1. **Application (client) ID** - Copy giá trị này
   ```
   Ví dụ: 12345678-1234-1234-1234-123456789012
   ```

2. **Directory (tenant) ID** - Copy giá trị này
   ```
   Ví dụ: abcdef12-3456-7890-abcd-ef1234567890
   ```

### Tạo Client Secret

1. Click "Certificates & secrets" ở menu bên trái
2. Chọn tab "Client secrets"
3. Click "New client secret"
4. Nhập Description: `Development`
5. Chọn Expires: `24 months`
6. Click "Add"
7. **NGAY LẬP TỨC - Sao chép Value** (chỉ hiện một lần!)
   ```
   Ví dụ: ~8Q~WsKaBcd_EfGhIjKlMnOpQrStUvWxYz
   ```

### Cấu Hình Quyền (Permissions)

1. Click "API permissions" ở menu bên trái
2. Click "Add a permission"
3. Chọn "Microsoft Graph"
4. Chọn "Delegated permissions"
5. Tìm và chọn các quyền sau:
   - ✅ `User.Read` - Đọc thông tin cá nhân của user
   - ✅ `Mail.Read` - Đọc email
   - ✅ `Calendars.Read` - Đọc lịch
   - ✅ `offline_access` - Truy cập dữ liệu offline

6. Click "Grant admin consent for VLU"

## 🛠️ Bước 3: Cấu Hình Project

### 1. Cài Đặt Dependencies
```bash
cd vlu-connect
npm install
```

### 2. Tạo File .env

```bash
# Sao chép file mẫu
cp .env.example .env

# Hoặc tạo thủ công - Mở .env và nhập:
```

Nội dung `.env`:
```env
# Azure AD Configuration
CLIENT_ID=your-client-id-from-azure
TENANT_ID=your-tenant-id-from-azure
CLIENT_SECRET=your-client-secret-from-azure

# Redirect URI
REDIRECT_URI=http://localhost:3000/auth/callback

# Session
SESSION_SECRET=vlu-connect-secret-key-2024

# Settings
NODE_ENV=development
PORT=3000
VLU_DOMAIN=vlu.edu.vn
```

**⚠️ LƯU Ý QUAN TRỌNG:**
- ĐỪNG commit file `.env` lên GitHub
- File này chứa thông tin nhạy cảm
- `.gitignore` đã tự động ngăn chặn

## 🚀 Bước 4: Chạy Ứng Dụng

```bash
# Chế độ phát triển (có auto-reload)
npm run dev

# Hoặc chế độ thường
npm start
```

Nếu thành công, sẽ thấy:
```
🚀 Server đang chạy tại http://localhost:3000
📝 Đăng nhập tại http://localhost:3000/auth/login
```

## ✅ Bước 5: Kiểm Tra

1. Mở http://localhost:3000 trong browser
2. Nhấn "Đăng Nhập Bằng Microsoft 365"
3. Đăng nhập bằng tài khoản Microsoft (@vlu.edu.vn)
4. Chấp nhận quyền truy cập
5. Xem dashboard nếu thành công

## 🛒 Redirect URIs khác (Production)

Khi triển khai lên production, thêm các Redirect URI vào Azure:

```
https://yourdomain.vlu.edu.vn/auth/callback
https://yourdomain.vlu.edu.vn:8443/auth/callback
```

**Cách thêm:**
1. Vào App Registration
2. Chọn "Authentication"
3. Kéo xuống "Redirect URIs"
4. Chọn "Add URI"
5. Nhập URI mới
6. Chọn "Save"

## 🐛 Debug & Troubleshooting

### Lỗi: AADSTS500011
```
Error: The request body must contain the following parameter: 'code'.
```
**Giải pháp:** Kiểm tra REDIRECT_URI khớp trong cấu hình Azure

### Lỗi: AADSTS700016
```
Application with identifier not found in the directory
```
**Giải pháp:** 
- Kiểm tra CLIENT_ID
- Kiểm tra TENANT_ID
- App phải trong cùng tenant

### Lỗi: Không lưu session
```bash
# Cài đặt express-session nếu thiếu
npm install express-session
```

### Xem logs chi tiết
```bash
# Thêm vào index.js
NODE_DEBUG=* npm start
```

## 📚 Tham Khảo Thêm

- [Microsoft MSAL - Node.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node)
- [OAuth 2.0 Authorization Code Flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- [Microsoft Graph Permissions](https://docs.microsoft.com/en-us/graph/permissions-reference)

---

**Cần giúp?** Kiểm tra console của browser (F12) và terminal để xem thông báo lỗi chi tiết.
