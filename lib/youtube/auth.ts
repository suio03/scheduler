import { generateAuthUrl } from "./utils";
import { YouTubeUserInfo, YouTubeAccountData } from "./types";
import prisma from "../prisma";
import { auth } from "../next-auth";
import { YouTubeApiClient } from "./api";

/**
 * Start the YouTube OAuth flow
 */
export async function startYouTubeOAuth(): Promise<string> {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("User must be authenticated");
    }

    // Generate a state parameter to prevent CSRF attacks
    const state = Buffer.from(
        JSON.stringify({
            userId: session.user.id,
            timestamp: Date.now(),
        })
    ).toString("base64");

    // Generate the authorization URL
    const authUrl = generateAuthUrl(state);
    return authUrl;
}

/**
 * Handle the YouTube OAuth callback
 */
export async function handleYouTubeOAuthCallback(
    code: string,
    state: string,
    customRedirectUri?: string
): Promise<YouTubeAccountData> {
    // Get the authenticated user
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("User must be authenticated");
    }

    const userId = session.user.id;

    // Use the custom redirect URI if provided, otherwise use the default
    const redirectUri =
        customRedirectUri ||
        `${process.env.NEXT_PUBLIC_APP_URL}/youtube-callback`;

    try {
        // Check if we already have an account with this user
        const existingAccounts = await prisma.platformAccount.findMany({
            where: {
                userId,
                platformType: "YOUTUBE",
            },
        });

        const tokenData = await exchangeCodeForToken(
            code,
            redirectUri
        );
        console.log("tokenData", tokenData)
        if (
            !tokenData.access_token ||
            !tokenData.refresh_token ||
            !tokenData.channel_id
        ) {
            throw new Error("Invalid token data received from YouTube");
        }

        // Check if we already have an account with this YouTube ID
        const existingAccount = await prisma.platformAccount.findFirst({
            where: {
                platformType: "YOUTUBE",
                platformAccountId: tokenData.channel_id,
            },
        });

        if (existingAccount) {
            // Update the existing account with new tokens
            const updatedAccount = await prisma.platformAccount.update({
                where: { id: existingAccount.id },
                data: {
                    userId, // Ensure it's connected to the current user
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    tokenExpiry: new Date(
                        Date.now() + tokenData.expires_in * 1000
                    ),
                },
            });

            return {
                id: updatedAccount.id,
                platformType: "YOUTUBE",
                platformAccountId: tokenData.channel_id,
                accountName: updatedAccount.accountName,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                tokenExpiry: new Date(Date.now() + tokenData.expires_in * 1000),
                metadata: updatedAccount.metadata as any,
            };
        }

        // Calculate token expiry
        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + tokenData.expires_in);

        try {
            // Create a new platform account
            const tempAccount = await prisma.platformAccount.create({
                data: {
                    userId,
                    platformType: "YOUTUBE",
                    platformAccountId: tokenData.channel_id,
                    accountName: "YouTube User", // Default name, will try to update
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    tokenExpiry: expiryDate,
                    metadata: {
                        channelId: tokenData.channel_id,
                    },
                },
            });

            try {
                // Get user info from YouTube
                const apiClient = new YouTubeApiClient(tempAccount.id);

                await apiClient.initialize();

                // Now that we're initialized, get the user info
                const channelInfo = await apiClient.getChannelInfo();

                // Use a default display name if none is provided
                const channelTitle = channelInfo.title || "YouTube Channel";

                // Update the platform account with user info
                const updatedAccount = await prisma.platformAccount.update({
                    where: { id: tempAccount.id },
                    data: {
                        accountName: channelTitle,
                        profilePictureUrl: channelInfo.thumbnailUrl,
                        metadata: {
                            channelId: tokenData.channel_id,
                            title: channelTitle,
                            description: channelInfo.description,
                            thumbnailUrl: channelInfo.thumbnailUrl,
                            customUrl: channelInfo.customUrl,
                            subscriberCount: channelInfo.subscriberCount,
                            videoCount: channelInfo.videoCount,
                            viewCount: channelInfo.viewCount,
                        },
                    },
                });

                return {
                    id: updatedAccount.id,
                    platformType: "YOUTUBE",
                    platformAccountId: tokenData.channel_id,
                    accountName: channelTitle,
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    tokenExpiry: expiryDate,
                    metadata: {
                        channelId: tokenData.channel_id,
                        thumbnailUrl: channelInfo.thumbnailUrl,
                        title: channelTitle,
                    },
                };
            } catch (error) {
                console.error("Error getting channel info:", error);

                // If we can't get user info, just return the account with default values
                return {
                    id: tempAccount.id,
                    platformType: "YOUTUBE",
                    platformAccountId: tokenData.channel_id,
                    accountName: "YouTube Channel",
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    tokenExpiry: expiryDate,
                    metadata: {
                        channelId: tokenData.channel_id,
                    },
                };
            }
        } catch (error) {
            console.error("Error creating platform account:", error);
            throw error;
        }
    } catch (error) {
        console.error("Error in handleYouTubeOAuthCallback:", error);
        throw error;
    }
}

/**
 * Disconnect a YouTube account
 */
export async function disconnectYouTubeAccount(
    platformAccountId: string
): Promise<void> {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("User must be authenticated");
    }

    const account = await prisma.platformAccount.findUnique({
        where: { id: platformAccountId },
    });

    if (!account) {
        throw new Error("Platform account not found");
    }

    if (account.userId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    // Delete the platform account
    await prisma.platformAccount.delete({
        where: { id: platformAccountId },
    });
}

interface YouTubeTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    channel_id: string;
    scope: string;
}

interface YouTubeChannelInfoResponse {
    items: Array<{
        id: string;
        snippet: {
            title: string;
            description: string;
            customUrl: string;
            thumbnails: {
                default: { url: string; },
                medium: { url: string; },
                high: { url: string; },
            };
        };
        statistics: {
            viewCount: string;
            subscriberCount: string;
            videoCount: string;
        };
    }>;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
    code: string,
    redirectUri: string
): Promise<YouTubeTokenResponse> {
    const clientId = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_KEY;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    console.log("clientId", clientId)
    console.log("clientSecret", clientSecret)
    if (!clientId || !clientSecret) {
        throw new Error("YouTube API credentials not configured");
    }

    try {
        const tokenUrl = "https://oauth2.googleapis.com/token";

        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                grant_type: "authorization_code",
                redirect_uri: redirectUri,
            }),
        });

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            throw new Error(`Unexpected response from YouTube: ${text}`);
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `YouTube API error: ${
                    errorData.error_description || errorData.error || "Unknown error"
                }`
            );
        }

        const data = await response.json();

        // Get channel ID using the access token
        const channelId = await getChannelId(data.access_token);

        return {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
            channel_id: channelId,
            scope: data.scope,
        };
    } catch (error: any) {
        console.error("Error exchanging code for token:", error);
        throw error;
    }
}

/**
 * Get the channel ID of the authenticated user
 */
export async function getChannelId(accessToken: string): Promise<string> {
    try {
        const response = await fetch(
            "https://www.googleapis.com/youtube/v3/channels?part=id&mine=true",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `YouTube API error: ${
                    errorData.error?.message || errorData.error || "Unknown error"
                }`
            );
        }

        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            throw new Error("No YouTube channel found for this account");
        }

        return data.items[0].id;
    } catch (error) {
        console.error("Error getting channel ID:", error);
        throw error;
    }
}

/**
 * Get YouTube channel information
 */
export async function getYouTubeChannelInfo(
    accessToken: string,
    channelId: string
): Promise<{
    title: string;
    description: string;
    customUrl?: string;
    thumbnailUrl?: string;
    subscriberCount?: number;
    videoCount?: number;
    viewCount?: number;
}> {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `YouTube API error: ${
                    errorData.error?.message || errorData.error || "Unknown error"
                }`
            );
        }

        const data = await response.json() as YouTubeChannelInfoResponse;
        
        if (!data.items || data.items.length === 0) {
            throw new Error("Channel not found");
        }

        const channel = data.items[0];
        
        return {
            title: channel.snippet.title,
            description: channel.snippet.description,
            customUrl: channel.snippet.customUrl,
            thumbnailUrl: channel.snippet.thumbnails.high?.url || 
                         channel.snippet.thumbnails.medium?.url || 
                         channel.snippet.thumbnails.default?.url,
            subscriberCount: parseInt(channel.statistics.subscriberCount, 10),
            videoCount: parseInt(channel.statistics.videoCount, 10),
            viewCount: parseInt(channel.statistics.viewCount, 10),
        };
    } catch (error) {
        console.error("Error getting channel info:", error);
        throw error;
    }
}

/**
 * Refresh an access token
 */
export async function refreshYouTubeToken(
    refreshToken: string
): Promise<{
    access_token: string;
    expires_in: number;
}> {
    const clientId = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_KEY;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        throw new Error("YouTube API credentials not configured");
    }

    try {
        const tokenUrl = "https://oauth2.googleapis.com/token";

        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: "refresh_token",
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `YouTube API error: ${
                    errorData.error_description || errorData.error || "Unknown error"
                }`
            );
        }

        const data = await response.json();
        
        return {
            access_token: data.access_token,
            expires_in: data.expires_in,
        };
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
}
