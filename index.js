const msal = require('@azure/msal-node');

const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
        clientSecret: process.env.CLIENT_SECRET,
    }
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

// Route để bắt đầu đăng nhập
app.get('/login', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"], // Quyền đọc thông tin cá nhân
        redirectUri: process.env.REDIRECT_URI,
    };
    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.redirect(response);
    });
});