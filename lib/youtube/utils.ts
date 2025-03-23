/**
 * Generate a random string for state parameter
 */
export function generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/**
 * Generate the authorization URL for YouTube OAuth
 */
export function generateAuthUrl(state: string): string {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    if (!clientId) {
        throw new Error("YouTube client ID not configured");
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/youtube-callback`;
    
    // Parameters for the OAuth request
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload",
        access_type: "offline",
        state: state,
        // Always request a refresh token by setting prompt=consent
        prompt: "consent",
        include_granted_scopes: "true"
    });

    // Google OAuth 2.0 endpoint
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Format video duration from ISO 8601 format (PT#M#S) to MM:SS format
 */
export function formatDuration(isoDuration: string): string {
    // If no duration, return "00:00"
    if (!isoDuration) return "00:00";
    
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "00:00";
    
    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Format a number for display (e.g., 1200 -> 1.2K)
 */
export function formatCount(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
}

/**
 * Parse YouTube video ID from a URL
 */
export function extractVideoId(url: string): string | null {
    if (!url) return null;
    
    // Try to parse video ID from URL
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/user\/\S+\/\S+\/|youtube\.com\/user\/\S+\/|youtube\.com\/\S+\/|youtube\.com\/attribution_link\?a=\S+?&u=\/watch\?v=|youtube\.com\/attribution_link\?a=\S+?&u=%2Fwatch%3Fv%3D)([^#\&\?\/]{11})/,
        /youtube\.com\/.+[?&]v=([^#\&\?\/]{11})/,
        /youtu\.be\/([^#\&\?\/]{11})/,
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    // If it's already just the video ID (11 characters)
    if (url.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }
    
    return null;
}
