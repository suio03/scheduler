// TikTok API Configuration
// Replace these mock values with actual credentials from TikTok Developer Portal

export const TIKTOK_CONFIG = {
  clientKey: process.env.TIKTOK_CLIENT_KEY || 'mock_client_key',
  clientSecret: process.env.TIKTOK_CLIENT_SECRET || 'mock_client_secret',
  redirectUri: process.env.TIKTOK_REDIRECT_URI || 'http://localhost:3000/api/tiktok/auth/callback',
  scope: 'user.info.basic,video.upload',
  apiBaseUrl: 'https://open.tiktokapis.com/v2',
};

// TikTok API Endpoints
export const TIKTOK_ENDPOINTS = {
  authorize: 'https://www.tiktok.com/v2/auth/authorize',
  accessToken: 'https://open.tiktokapis.com/v2/oauth/token',
  refreshToken: 'https://open.tiktokapis.com/v2/oauth/token',
  videoUpload: 'https://open.tiktokapis.com/v2/video/upload',
  videoInfo: 'https://open.tiktokapis.com/v2/video/query',
  videoPublish: 'https://open.tiktokapis.com/v2/post/publish/video/init',
  userInfo: 'https://open.tiktokapis.com/v2/user/info',
  videoMetrics: 'https://open.tiktokapis.com/v2/research/video/query',
}; 