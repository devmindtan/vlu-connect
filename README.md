# VLU Connect - Kết Nối Tài Khoản Microsoft

Một ứng dụng web hiện đại cho phép sinh viên và giáo viên Đại học Nông Lâm TP.HCM (VLU) kết nối và xác thực tài khoản Microsoft 365 của trường.

## 🎯 Tính Năng

- ✅ **Đăng nhập bằng Microsoft 365** - Sử dụng OAuth 2.0 flow
- ✅ **Giao diện đăng nhập và Dashboard hiển thị thông tin đơn giản** - Hiển thị thông tin người dùng
- ✅ **Quản lý session** - Tăng bảo mật ca
- ✅ **Tích hợp Microsoft Graph API** - Truy cập thông tin của tài khoản đó nếu được cho phép

## 📋 Yêu Cầu

- Node.js v16 trở lên
- npm hoặc yarn
- Tài khoản Microsoft Azure AD (cho trường VLU hoặc bất kì tài khoản nào khác)

## 🚀 Cài Đặt

### 1. Clone Repository

```bash
git clone https://github.com/devmindtan/vlu-connect.git
cd vlu-connect
```

### 2. Cài Đặt Dependencies

```bash
npm install
```

### 3. Cấu Hình Azure AD

#### Bước 1: Tạo Application trong Azure Portal

1. Truy cập [Azure Portal](https://portal.azure.com)
2. Tìm **Azure Active Directory** > **App registrations** > **New registration**
3. Nhập tên: `VLU Connect`
4. Chọn **Supported account types**: Accounts in this organizational directory
5. Redirect URI: `http://localhost:3000/auth/callback` (cho development)
6. Nhấn **Register**

#### Bước 2: Lấy Client Credentials

1. Vào tab **Overview** - lấy **Application (client) ID**
2. Vào tab **Overview** - lấy **Directory (tenant) ID**
3. Vào tab **Certificates & secrets** > **New client secret**
   - Nhập description: `Development`
   - Chọn expiration: 24 months
   - Sao chép **Value** (chỉ hiện một lần!)

#### Bước 3: Cấu Hình Permissions

1. Vào tab **API permissions**
2. Nhấn **Add a permission** > **Microsoft Graph**
3. Chọn **Delegated permissions**
4. Tìm và chọn:
   - `User.Read` - Đọc thông tin cá nhân
   - `Mail.Read` - Đọc email
   - `Calendars.Read` - Đọc lịch
5. Nhấn **Grant admin consent**

### 4. Tạo File .env

```bash
cp .env.example .env
```

Sau đó chỉnh sửa `.env` với các giá trị từ Azure:

```env
CLIENT_ID=your-client-id-from-azure
TENANT_ID=your-tenant-id-from-azure
CLIENT_SECRET=your-client-secret-from-azure
REDIRECT_URI=http://localhost:3000/auth/callback
SESSION_SECRET=your-super-secret-key-here
PORT=3000
NODE_ENV=development
```

## 🏃 Chạy Ứng Dụng

```bash
npm start
```

Hoặc sử dụng nodemon cho development:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## 📖 Cách Sử Dụng

### 1. Đăng Nhập

1. Truy cập http://localhost:3000
2. Nhấn **"Đăng Nhập Bằng Microsoft 365"**
3. Đăng nhập bằng tài khoản Microsoft của trường (@vlu.edu.vn)
4. Chấp nhận yêu cầu cấp quyền
5. Sẽ được chuyển hướng tới dashboard

### 2. Dashboard

- Xem thông tin cá nhân
- Truy cập các dịch vụ: Email, Lịch học, OneDrive, Teams
- Đăng xuất an toàn

## 📁 Cấu Trúc Project

```
vlu-connect/
├── index.js              # Server chính
├── package.json          # Dependencies
├── .env.example          # Template biến môi trường
├── .gitignore
├── public/
│   ├── index.html        # Trang đăng nhập
│   └── dashboard.html    # Trang dashboard
└── README.md             # Tài liệu này
```

## 🔐 Bảo Mật

- ✅ Sử dụng HTTPS trong production (Lựa chọn quan trọng!)
- ✅ Session cookies được bảo vệ (httpOnly, secure)
- ✅ Không lưu token trên client
- ✅ Client Secret được bảo mật trong biến ENV
- ✅ CSRF protection nên được thêm vào

## 🛠️ API Endpoints

| Method | Endpoint         | Mô Tả                         |
| ------ | ---------------- | ----------------------------- |
| GET    | `/`              | Trang đăng nhập               |
| GET    | `/auth/login`    | Bắt đầu OAuth flow            |
| GET    | `/auth/callback` | Callback sau khi OAuth        |
| GET    | `/dashboard`     | Dashboard (yêu cầu đăng nhập) |
| GET    | `/api/me`        | Lấy thông tin user (JSON)     |
| GET    | `/auth/logout`   | Đăng xuất                     |

## 📚 Tài Liệu Thêm

- [Microsoft MSAL Node Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Express.js Documentation](https://expressjs.com)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/overview)
- [API v1.0 endpoint](https://learn.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0)
- [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
- [Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/)
- [Decode JWT](https://jwt.ms/)

## 🤝 Phát Triển Tiếp Theo

- [ ] Đăng nhập bằng email cục bộ
- [ ] Tích hợp Microsoft Graph API (đọc email, lịch)
- [ ] Thêm tính năng 2FA
- [ ] Dashboard chi tiết hơn
- [ ] Quản lý quyền người dùng
- [ ] Audit logs
- [ ] Thêm database (MongoDB/PostgreSQL)

## ⚠️ Troubleshooting

### Lỗi: "Invalid client ID"

- Kiểm tra CLIENT_ID trong .env
- Đảm bảo nó khớp với Application ID từ Azure

### Lỗi: "Redirect URI mismatch"

- Kiểm tra REDIRECT_URI trong .env khớp với cấu hình trong Azure
- Chú ý phần port nếu thay đổi

### Lỗi: "AADSTS50011"

- Redirect URI không được đăng ký trong Azure
- Thêm từng URI vào "Authentication" > "Redirect URIs"

### Session không lưu

- Kiểm tra SESSION_SECRET trong .env
- Xóa cookies và thử lại
- Đảm bảo `express-session` đã được cài đặt

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra logs trong terminal
2. Xem troubleshooting section
3. Tạo issue trên GitHub

## 📄 License

ISC

---

**Phát triển bởi:** devmindtan
**Ngôn ngữ:** JavaScript/Node.js
**Khung công tác:** Express.js
