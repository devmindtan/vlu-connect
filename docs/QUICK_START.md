# ⚡ Hướng Dẫn Nhanh - VLU Connect

## 🚀 Bắt Đầu trong 5 Phút

### 1️⃣ Cài Đặt
```bash
npm install
```

### 2️⃣ Cấu Hình Azure
- Tạo app trong Azure Portal: https://portal.azure.com
- Lấy **Client ID**, **Tenant ID**, **Client Secret**
- Xem chi tiết tại [SETUP_GUIDE.md](SETUP_GUIDE.md)

### 3️⃣ Tạo File .env
```bash
cp .env.example .env
```

Chỉnh sửa `.env`:
```env
CLIENT_ID=xxx
TENANT_ID=xxx
CLIENT_SECRET=xxx
SESSION_SECRET=your-secret
```

### 4️⃣ Chạy
```bash
npm run dev
```

Truy cập: http://localhost:3000

---

## 📖 Cấu Trúc Dự Án

```
📁 vlu-connect/
├── 📄 index.js           ← Server chính
├── 📁 public/
│   ├── index.html        ← Login page
│   └── dashboard.html    ← Dashboard
├── 📁 utils/
│   └── graphApi.js       ← Microsoft Graph API helpers
├── .env.example
├── .gitignore
└── package.json
```

---

## 🔧 Chủ Yếu API Endpoints

```
GET  /                    # Trang login
GET  /auth/login          # Bắt đầu OAuth
GET  /auth/callback       # OAuth callback
GET  /dashboard           # Dashboard (protected)
GET  /api/user            # Lấy info user
GET  /auth/logout         # Đăng xuất
```

---

## 💡 Mẹo Phát Triển

### Refresh token khi hết hạn
```javascript
// Thêm vào index.js nếu cần
const refreshToken = async (req, res, next) => {
    if (!req.session.user || !req.session.accessToken) {
        return res.redirect('/');
    }
    next();
};
```

### Thêm logging
```bash
NODE_DEBUG=express npm run dev
```

### Test API từ terminal
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://graph.microsoft.com/v1.0/me
```

---

## 🐛 Vấn Đề Thường Gặp

| Vấn đề | Giải Pháp |
|-------|---------|
| ❌ Invalid Client ID | Kiểm tra `.env` |
| ❌ Redirect URI mismatch | Kiểm tra Azure config |
| ❌ Session không lưu | Cài `npm install express-session` |
| ❌ CORS error | Thêm CORS middleware |

---

## 📚 Liên Kết Hữu Ích

- 🔐 [Azure Portal](https://portal.azure.com)
- 📖 [MSAL Node Docs](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node)
- 🌐 [Microsoft Graph API](https://graph.microsoft.com)
- 📝 [Hướng Dẫn Chi Tiết](SETUP_GUIDE.md)

---

**Cần trợ giúp?** Xem [SETUP_GUIDE.md](SETUP_GUIDE.md) để hướng dẫn chi tiết.
