import { generateAuthUrl } from "./utils";
import { TikTokUserInfo, TikTokAccountData } from "./types";
import prisma from "../prisma";
import { auth } from "../next-auth";
import { TikTokApiClient } from "./api";

/**
 * Start the TikTok OAuth flow
 */
export async function startTikTokOAuth(): Promise<string> {
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
 * Handle the TikTok OAuth callback
 */
export async function handleTikTokOAuthCallback(
    code: string,
    state: string,
    codeVerifier?: string,
    customRedirectUri?: string
): Promise<TikTokAccountData> {
    // Get the authenticated user
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("User must be authenticated");
    }

    const userId = session.user.id;

    // Use the custom redirect URI if provided, otherwise use the default
    const redirectUri =
        customRedirectUri ||
        `${process.env.NEXT_PUBLIC_APP_URL}/tiktok-callback`;

    try {
        // Check if we already have an account with this user
        const existingAccounts = await prisma.platformAccount.findMany({
            where: {
                userId,
                platformType: "tiktok",
            },
        });

        const tokenData = await exchangeCodeForToken(
            code,
            redirectUri,
            codeVerifier
        );


        if (
            !tokenData.access_token ||
            !tokenData.refresh_token ||
            !tokenData.open_id
        ) {
            throw new Error("Invalid token data received from TikTok");
        }

        // Check if we already have an account with this TikTok ID
        const existingAccount = await prisma.platformAccount.findFirst({
            where: {
                platformType: "tiktok",
                platformAccountId: tokenData.open_id,
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
                platformType: "tiktok",
                platformAccountId: tokenData.open_id,
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
                    platformType: "tiktok",
                    platformAccountId: tokenData.open_id,
                    accountName: "TikTok User", // Default name, will try to update
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    tokenExpiry: expiryDate,
                    metadata: {
                        openId: tokenData.open_id,
                    },
                },
            });

            try {
                // Get user info from TikTok
                const apiClient = new TikTokApiClient(tempAccount.id);

                await apiClient.initialize();

                // Now that we're initialized, get the user info
                const userInfo = await apiClient.getUserInfo();

                // Use a default display name if none is provided
                const displayName = userInfo.display_name || "TikTok User";

                // Update the platform account with user info
                const updatedAccount = await prisma.platformAccount.update({
                    where: { id: tempAccount.id },
                    data: {
                        accountName: displayName,
                        metadata: {
                            unionId: userInfo.union_id,
                            openId: tokenData.open_id,
                            displayName: displayName,
                            avatarUrl: userInfo.avatar_url,
                            bioDescription: userInfo.bio_description,
                            profileDeepLink: userInfo.profile_deep_link,
                            username: userInfo.username,
                            followerCount: userInfo.follower_count,
                            followingCount: userInfo.following_count,
                            likesCount: userInfo.likes_count,
                            videoCount: userInfo.video_count,
                        },
                    },
                });

                return {
                    id: updatedAccount.id,
                    platformType: "tiktok",
                    platformAccountId: tokenData.open_id,
                    accountName: displayName,
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    tokenExpiry: expiryDate,
                    metadata: {
                        openId: tokenData.open_id,
                        avatarUrl: userInfo.avatar_url,
                        displayName: displayName,
                    },
                };
            } catch (error) {
                console.error("Error getting user info:", error);

                // If we can't get user info, just return the account with default values
                return {
                    id: tempAccount.id,
                    platformType: "tiktok",
                    platformAccountId: tokenData.open_id,
                    accountName: "TikTok User",
                    accessToken: tokenData.access_token,
                    refreshToken: tokenData.refresh_token,
                    tokenExpiry: expiryDate,
                    metadata: {
                        openId: tokenData.open_id,
                    },
                };
            }
        } catch (error) {
            console.error("Error creating platform account:", error);
            throw error;
        }
    } catch (error) {
        console.error("Error in handleTikTokOAuthCallback:", error);
        throw error;
    }
}

/**
 * Disconnect a TikTok account
 */
export async function disconnectTikTokAccount(
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

interface TikTokTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    open_id: string;
    scope: string;
}

interface TikTokUserInfoResponse {
    data: {
        user: {
            open_id: string;
            union_id: string;
            avatar_url: string;
            avatar_url_100: string;
            avatar_url_200: string;
            display_name: string;
            bio_description: string;
            profile_deep_link: string;
            is_verified: boolean;
        };
    };
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
    code: string,
    redirectUri: string,
    codeVerifier?: string
): Promise<TikTokTokenResponse> {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

    if (!clientKey || !clientSecret) {
        throw new Error("TikTok API credentials not configured");
    }

    const params: Record<string, string> = {
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
    };

    // Add code_verifier if provided (for PKCE)
    if (codeVerifier) {
        params.code_verifier = codeVerifier;
    }
    try {
        // According to TikTok docs in "Manage access token" section
        // The token exchange URL is https://open.tiktokapis.com/v2/oauth/token/
        // Note the trailing slash which is required
        const tokenUrl = "https://open.tiktokapis.com/v2/oauth/token/";

        const response = await fetch(tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(params),
        });

        // Check if response is JSON
        const contentType = response.headers.get("content-type");

        // Try to get text first to see what's being returned
        const responseText = await response.text();

        let responseData;
        try {
            // Try to parse the response as JSON
            responseData = JSON.parse(responseText);
        } catch (parseError) {
            console.error(
                "TikTok DEBUG - Token Exchange - Error parsing JSON:",
                parseError
            );
            throw new Error(
                `TikTok API returned non-JSON response: ${responseText.substring(
                    0,
                    100
                )}...`
            );
        }


        if (responseData.error) {
            console.error(
                "TikTok DEBUG - Token Exchange - API error:",
                responseData.error,
                responseData.error_description
            );
            throw new Error(
                `TikTok API error: ${
                    responseData.error_description || responseData.error
                }`
            );
        }

        // TikTok API returns data in a nested structure
        if (responseData.data) {
            return responseData.data;
        }

        // For v2 API, the token data is directly in the response
        if (responseData.access_token) {
            return responseData;
        }

        console.error(
            "TikTok DEBUG - Token Exchange - Unexpected response format:",
            JSON.stringify(responseData, null, 2).substring(0, 200) + "..."
        );
        throw new Error("Unexpected response format from TikTok API");
    } catch (error) {
        console.error("TikTok DEBUG - Token Exchange - Fetch error:", error);
        throw error;
    }
}

/**
 * Create or update TikTok account in database
 */
export async function saveTikTokAccount(
    userId: string,
    openId: string,
    displayName: string,
    accessToken: string,
    refreshToken: string,
    expiresIn: number
) {
    // Calculate token expiry date
    const tokenExpiry = new Date();
    tokenExpiry.setSeconds(tokenExpiry.getSeconds() + expiresIn);

    // Check if account already exists
    const existingAccount = await prisma.platformAccount.findFirst({
        where: {
            platformType: "tiktok",
            platformAccountId: openId,
        },
    });

    if (existingAccount) {
        // Update existing account
        return prisma.platformAccount.update({
            where: {
                id: existingAccount.id,
            },
            data: {
                userId,
                accountName: displayName,
                accessToken,
                refreshToken,
                tokenExpiry,
                updatedAt: new Date(),
            },
        });
    } else {
        // Create new account
        return prisma.platformAccount.create({
            data: {
                userId,
                platformType: "tiktok",
                platformAccountId: openId,
                accountName: displayName,
                accessToken,
                refreshToken,
                tokenExpiry,
            },
        });
    }
}

/**
 * Refresh TikTok access token
 */
export async function refreshTikTokToken(
    refreshToken: string
): Promise<TikTokTokenResponse> {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

    if (!clientKey || !clientSecret) {
        throw new Error("TikTok API credentials not configured");
    }

    const response = await fetch(
        "https://open.tiktokapis.com/v2/oauth/token/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_key: clientKey,
                client_secret: clientSecret,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            `TikTok token refresh failed: ${JSON.stringify(errorData)}`
        );
    }

    return await response.json();
}

/**
 * Get TikTok user information
 */
export async function getTikTokUserInfo(
    accessToken: string,
    openId: string
): Promise<TikTokUserInfoResponse> {
    // Exact URL and format from the official TikTok documentation
    const url = new URL("https://open.tiktokapis.com/v2/user/info/");

    // Required fields parameter
    url.searchParams.append(
        "fields",
        "open_id,union_id,avatar_url,display_name"
    );

    try {
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });


        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                "TikTok DEBUG - getTikTokUserInfo - Error response:",
                errorText
            );
            throw new Error(
                `Failed to get TikTok user info: ${response.status} ${errorText}`
            );
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(
            "TikTok DEBUG - getTikTokUserInfo - Request failed:",
            error
        );
        throw error;
    }
}
