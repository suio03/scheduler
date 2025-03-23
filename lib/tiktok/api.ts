import prisma from "@/lib/prisma";
import { refreshTikTokToken } from "./auth";
import {
    TikTokUserInfo,
    TikTokVideoUploadInitResponse,
    TikTokVideoUploadCompleteResponse,
    TikTokVideoPublishRequest,
    TikTokVideoPublishResponse,
} from "./types";

/**
 * TikTok API Client
 */
export class TikTokApiClient {
    private accountId: string;
    private accessToken: string | null = null;
    private openId: string | null = null;
    private isInitialized = false;
    private initPromise: Promise<void> | null = null;

    constructor(accountId: string) {
        this.accountId = accountId;
    }

    /**
     * Initialize the client by loading account data
     */
    private async init() {
        // If already initialized, return immediately
        if (this.isInitialized) return;

        // If initialization is in progress, wait for it to complete
        if (this.initPromise) {
            await this.initPromise;
            return;
        }

        // Start initialization
        this.initPromise = this._doInit();
        await this.initPromise;
    }

    /**
     * Internal initialization logic
     */
    private async _doInit() {
        try {
            const account = await prisma.platformAccount.findUnique({
                where: { id: this.accountId },
            });

            if (!account) {
                throw new Error("TikTok account not found");
            }

            // Check if token is expired
            if (account.tokenExpiry && new Date() > account.tokenExpiry) {
                // Refresh the token
                if (!account.refreshToken) {
                    throw new Error("Refresh token not available");
                }

                const tokenData = await refreshTikTokToken(
                    account.refreshToken
                );

                // Calculate new expiry
                const expiryDate = new Date();
                expiryDate.setSeconds(
                    expiryDate.getSeconds() + tokenData.expires_in
                );

                // Update the account with new tokens
                await prisma.platformAccount.update({
                    where: { id: this.accountId },
                    data: {
                        accessToken: tokenData.access_token,
                        refreshToken: tokenData.refresh_token,
                        tokenExpiry: expiryDate,
                    },
                });

                this.accessToken = tokenData.access_token;
                this.openId = tokenData.open_id;
            } else {
                this.accessToken = account.accessToken || null;
                this.openId = account.platformAccountId;
            }

            if (!this.accessToken) {
                throw new Error("Access token not available");
            }

            this.isInitialized = true;
        } catch (error) {
            console.error(
                "TikTok DEBUG - API Client - Initialization failed:",
                error
            );
            this.initPromise = null; // Reset so we can try again
            throw error;
        }
    }

    /**
     * Explicitly initialize the client
     */
    public async initialize(): Promise<void> {
        await this.init();
    }

    /**
     * Make an authenticated request to the TikTok API
     */
    private async request<T>(
        endpoint: string,
        method: string = "GET",
        body?: any,
        includeAccessTokenInHeader: boolean = true
    ): Promise<T> {
        // Ensure we're initialized before making requests
        await this.init();

        if (!this.isInitialized || !this.accessToken) {
            console.error(
                "TikTok DEBUG - API Client - Not initialized properly"
            );
            throw new Error("TikTok API client not initialized properly");
        }

        // Make sure endpoint starts with a slash
        const formattedEndpoint = endpoint.startsWith("/")
            ? endpoint
            : `/${endpoint}`;

        // Construct the full URL with API version
        const url = new URL(
            `https://open.tiktokapis.com/v2${formattedEndpoint}`
        );

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        // Only include Authorization header if specified
        if (includeAccessTokenInHeader) {
            headers.Authorization = `Bearer ${this.accessToken}`;
        }

        try {
            const response = await fetch(url.toString(), {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(
                    `TikTok DEBUG - API error - Status: ${response.status}, Response: ${errorText}`
                );
                throw new Error(
                    `TikTok API error: ${response.status} ${errorText.substring(
                        0,
                        100
                    )}`
                );
            }

            // Try to parse as JSON, with fallback to text if that fails
            let data: any;
            try {
                data = await response.json();
            } catch (e) {
                const text = await response.text();
                console.error(
                    `TikTok DEBUG - API response - Not valid JSON: ${text.substring(
                        0,
                        100
                    )}`
                );
                throw new Error(
                    `Invalid JSON response: ${text.substring(0, 100)}`
                );
            }

            return data;
        } catch (error) {
            console.error(`TikTok DEBUG - API request failed:`, error);
            throw error;
        }
    }

    /**
     * Get user information
     */
    async getUserInfo(): Promise<TikTokUserInfo> {
        try {
            // Ensure we're fully initialized first
            if (!this.isInitialized) {
                await this.initialize();
            }

            // The exact endpoint format from TikTok documentation
            const endpoint = "/v2/user/info/"; // Note the trailing slash and v2 prefix

            // The fields parameter is required as per documentation
            const fields =
                "open_id,union_id,avatar_url,display_name,bio_description,profile_deep_link,username,follower_count,following_count,likes_count,video_count";
            // Prepare the URL with the query parameter
            const url = new URL(`https://open.tiktokapis.com${endpoint}`);
            url.searchParams.append("fields", fields);

            // Make the request directly without using our request helper (to ensure exact format)
            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });

            // Check if the response is successful
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `TikTok API error: ${response.status} ${errorText.substring(
                        0,
                        100
                    )}`
                );
            }

            // Parse the JSON response
            const responseData = await response.json();
            console.log("TikTok DEBUG - getUserInfo - Response:", responseData);
            // Check if the response has the expected structure
            if (responseData.data && responseData.data.user) {
                return responseData.data.user;
            } else {
                throw new Error(
                    "Unexpected response structure from TikTok API"
                );
            }
        } catch (error) {
            console.error("TikTok DEBUG - getUserInfo - Error:", error);

            // Provide a fallback user info with minimal data and error context
            return {
                open_id: this.openId || "",
                display_name: "TikTok User (API Error)",
                avatar_url: "",
                union_id: "",
                avatar_url_100: "",
                avatar_url_200: "",
                bio_description:
                    "Unable to retrieve profile data: " +
                    (error instanceof Error ? error.message : "Unknown error"),
                profile_deep_link: "",
                is_verified: false,
                username: "",
                follower_count: 0,
                following_count: 0,
                likes_count: 0,
                video_count: 0,
            };
        }
    }

    /**
     * Get user videos
     */
    async getUserVideos(cursor: string = "", limit: number = 10) {
        return this.request("/video/list", "POST", {
            fields: [
                "id",
                "create_time",
                "cover_image_url",
                "share_url",
                "video_description",
                "duration",
                "height",
                "width",
                "title",
                "embed_html",
                "embed_link",
                "like_count",
                "comment_count",
                "share_count",
                "view_count",
            ],
            cursor,
            max_count: limit,
        });
    }

    /**
     * Initialize a video upload
     */
    async initVideoUpload(): Promise<TikTokVideoUploadInitResponse> {
        await this.init();

        const response = await this.request<{
            data: TikTokVideoUploadInitResponse;
        }>("/video/init", "POST");

        return response.data;
    }

    /**
     * Upload a video chunk to TikTok
     */
    async uploadVideoChunk(
        uploadUrl: string,
        chunk: Blob,
        chunkIndex: number,
        totalChunks: number
    ): Promise<void> {
        await this.init();

        const formData = new FormData();
        formData.append("video", chunk);

        const response = await fetch(uploadUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "x-chunk-index": chunkIndex.toString(),
                "x-total-chunks": totalChunks.toString(),
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `TikTok video chunk upload error: ${JSON.stringify(errorData)}`
            );
        }
    }

    /**
     * Complete a video upload
     */
    async completeVideoUpload(
        uploadUrl: string
    ): Promise<TikTokVideoUploadCompleteResponse> {
        await this.init();

        const completeUrl = `${uploadUrl}/complete`;

        const response = await fetch(completeUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `TikTok video upload completion error: ${JSON.stringify(
                    errorData
                )}`
            );
        }

        const data = await response.json();
        return data.data;
    }

    /**
     * Publish a video
     */
    async publishVideo(
        videoId: string,
        caption: string,
        privacy: "PUBLIC" | "SELF_ONLY" | "FOLLOW_FRIENDS_ONLY" = "PUBLIC",
        options: Partial<TikTokVideoPublishRequest> = {}
    ): Promise<TikTokVideoPublishResponse> {
        const publishRequest: TikTokVideoPublishRequest = {
            video_id: videoId,
            title: caption,
            privacy_level: privacy,
            ...options,
        };

        return this.request<{ data: TikTokVideoPublishResponse }>(
            "/video/publish",
            "POST",
            publishRequest
        ).then((response) => response.data);
    }
}
