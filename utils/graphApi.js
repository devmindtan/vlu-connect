const msal = require('@azure/msal-node');
const fetch = require('isomorphic-fetch');

/**
 * MICROSOFT GRAPH API - Hàm tiện ích
 * Dùng token để gọi API của Microsoft
 */

// ============ EMAIL ============

/**
 * Lấy danh sách email từ inbox
 */
async function getEmails(accessToken) {
    try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$top=10', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error('Error fetching emails:', error);
        return null;
    }
}

/**
 * Lấy số lượng email chưa đọc
 */
async function getUnreadEmailCount(accessToken) {
    try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=isRead eq false&$count=true', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'ConsistencyLevel': 'eventual'
            }
        });
        const data = await response.json();
        return data['@odata.count'];
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
}

// ============ CALENDAR ============

/**
 * Lấy danh sách sự kiện trong tuần
 */
async function getCalendarEvents(accessToken) {
    try {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const filter = `?$filter=start/dateTime ge '${today.toISOString()}' and start/dateTime le '${nextWeek.toISOString()}'`;
        
        const response = await fetch(`https://graph.microsoft.com/v1.0/me/events${filter}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        return null;
    }
}

// ============ USER INFO ============

/**
 * Lấy thông tin chi tiết người dùng
 */
async function getUserProfile(accessToken) {
    try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

/**
 * Lấy ảnh đại diện người dùng
 */
async function getUserPhoto(accessToken) {
    try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.arrayBuffer();
    } catch (error) {
        console.error('Error fetching user photo:', error);
        return null;
    }
}

// ============ ONEDRIVE ============

/**
 * Lấy danh sách tệp trong OneDrive
 */
async function getOneDriveFiles(accessToken) {
    try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/root/children', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error('Error fetching OneDrive files:', error);
        return null;
    }
}

// ============ TEAMS ============

/**
 * Lấy danh sách Teams của user
 */
async function getUserTeams(accessToken) {
    try {
        const response = await fetch('https://graph.microsoft.com/v1.0/me/joinedTeams', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data.value;
    } catch (error) {
        console.error('Error fetching Teams:', error);
        return null;
    }
}

// ============ EXPORT ============

module.exports = {
    getEmails,
    getUnreadEmailCount,
    getCalendarEvents,
    getUserProfile,
    getUserPhoto,
    getOneDriveFiles,
    getUserTeams
};
