const msal = require('@azure/msal-node');
const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');

const app = express();

const GRAPH_SCOPES = ["User.Read", "Mail.Read", "Calendars.Read"];

// Cấu hình MSAL cho Microsoft Azure
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
        clientSecret: process.env.CLIENT_SECRET,
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

// Khởi tạo Public Client Application
const pca = new msal.ConfidentialClientApplication(msalConfig);

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }
}));

// Route để trả về giao diện đăng nhập
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route để bắt đầu quy trình đăng nhập
app.get('/auth/login', async (req, res) => {
    try {
        const authCodeUrlParameters = {
            scopes: GRAPH_SCOPES,
            redirectUri: process.env.REDIRECT_URI,
        };

        const authUrl = await pca.getAuthCodeUrl(authCodeUrlParameters);
        res.redirect(authUrl);
    } catch (error) {
        console.error('Error generating auth code URL:', error);
        res.status(500).send('Lỗi khi tạo URL đăng nhập');
    }
});

// Route callback sau khi đăng nhập thành công
app.get('/auth/callback', async (req, res) => {
    try {
        if (req.query.error) {
            const errorCode = req.query.error;
            const errorDescription = req.query.error_description || 'Unknown error';
            console.error('OAuth callback error:', errorCode, errorDescription);
            return res.status(400).send(`Đăng nhập Microsoft thất bại: ${errorCode}. ${errorDescription}`);
        }

        if (!req.query.code) {
            return res.status(400).send('Thiếu mã xác thực từ Microsoft. Vui lòng đăng nhập lại.');
        }

        const tokenRequest = {
            code: req.query.code,
            scopes: GRAPH_SCOPES,
            redirectUri: process.env.REDIRECT_URI,
        };

        const response = await pca.acquireTokenByCode(tokenRequest);
        
        // Lưu token vào session
        req.session.accessToken = response.accessToken;
        req.session.user = response.account;
        
        // Chuyển hướng đến dashboard
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error acquiring token:', error);
        res.status(500).send('Lỗi khi đăng nhập. Vui lòng thử lại.');
    }
});

// Route dashboard - chỉ cho user đã đăng nhập
app.get('/dashboard', (req, res) => {
    if (!req.session.accessToken) {
        return res.redirect('/');
    }
    
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API để lấy thông tin user
app.get('/api/user', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Chưa đăng nhập' });
    }
    
    res.json({
        name: req.session.user.name,
        username: req.session.user.username,
        email: req.session.user.homeAccountId
    });
});

// Route đăng xuất
app.get('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Lỗi khi đăng xuất');
        }
        res.redirect('/');
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Có lỗi xảy ra!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    console.log(`📝 Đăng nhập tại http://localhost:${PORT}/auth/login`);
});