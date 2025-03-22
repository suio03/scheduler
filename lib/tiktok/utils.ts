import { TIKTOK_CONFIG, TIKTOK_ENDPOINTS } from "./config";
import { TikTokTokenResponse, TikTokErrorResponse } from "./types";
import prisma from "../prisma";

/**
 * Generate TikTok OAuth authorization URL
 */
export function generateAuthUrl(state: string): string {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/tiktok-callback`;

    // Construct the OAuth URL - make sure to include trailing slash
    const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
    authUrl.searchParams.append("client_key", clientKey || "");
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("scope", "user.info.basic,video.upload");
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("state", state);

    return authUrl.toString();
}

/**
 * Refresh an expired access token
 */
export async function refreshAccessToken(
    refreshToken: string
): Promise<TikTokTokenResponse> {
    const params = new URLSearchParams({
        client_key: TIKTOK_CONFIG.clientKey,
        client_secret: TIKTOK_CONFIG.clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });

    const response = await fetch(TIKTOK_ENDPOINTS.refreshToken, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = data as TikTokErrorResponse;
        throw new Error(
            `TikTok API Error: ${error.error_description || error.error}`
        );
    }

    return data as TikTokTokenResponse;
}

/**
 * Check if a token is expired or about to expire (within 5 minutes)
 */
export function isTokenExpired(expiryDate: Date): boolean {
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
    return expiryDate < fiveMinutesFromNow;
}

/**
 * Get a valid access token for a platform account, refreshing if necessary
 */
export async function getValidAccessToken(
    platformAccountId: string
): Promise<string> {
    const account = await prisma.platformAccount.findUnique({
        where: { id: platformAccountId },
    });

    if (!account) {
        throw new Error("Platform account not found");
    }

    if (!account.accessToken || !account.refreshToken || !account.tokenExpiry) {
        throw new Error("Account is not properly authenticated with TikTok");
    }

    // Check if token is expired or about to expire
    if (isTokenExpired(account.tokenExpiry)) {
        try {
            // Refresh the token
            const tokenData = await refreshAccessToken(account.refreshToken);

            // Calculate new expiry date
            const expiryDate = new Date();
            expiryDate.setSeconds(
                expiryDate.getSeconds() + tokenData.expires_in
            );

            // Update the account with new tokens
            await prisma.platformAccount.update({
                where: { id: platformAccountId },
                data: {
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    tokenExpiry: expiryDate,
                },
            });

            return tokenData.access_token;
        } catch (error) {
            console.error("Failed to refresh TikTok token:", error);
            throw new Error("Failed to refresh TikTok authentication");
        }
    }

    return account.accessToken;
}

/**
 * Convert a Date to a Unix timestamp (seconds since epoch)
 */
export function dateToUnixTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}

/**
 * Convert a Unix timestamp to a Date object
 */
export function unixTimestampToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
}
