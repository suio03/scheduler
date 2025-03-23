import { refreshYouTubeToken, getYouTubeChannelInfo } from "./auth";
import prisma from "../prisma";
import { YouTubeVideo, YouTubeUploadResult, YouTubeVideoUploadParams, YouTubeUploadSession } from "./types";
import { formatDuration } from "./utils";

export class YouTubeApiClient {
    private platformAccountId: string;
    private accessToken: string | null = null;

    constructor(platformAccountId: string) {
        this.platformAccountId = platformAccountId;
    }

    /**
     * Initialize the API client by refreshing tokens if needed
     */
    async initialize(): Promise<void> {
        // Check if we have a platform account
        const account = await prisma.platformAccount.findUnique({
            where: { id: this.platformAccountId },
        });

        if (!account) {
            throw new Error("Platform account not found");
        }

        // Check if the token is expired or about to expire (within 5 minutes)
        const isExpired = !account.tokenExpiry || 
            account.tokenExpiry.getTime() < Date.now() + 5 * 60 * 1000;

        // If expired and we have a refresh token, refresh it
        if (isExpired && account.refreshToken) {
            try {
                const tokenData = await refreshYouTubeToken(account.refreshToken);
                
                // Update tokens in the database
                await prisma.platformAccount.update({
                    where: { id: this.platformAccountId },
                    data: {
                        accessToken: tokenData.access_token,
                        tokenExpiry: new Date(Date.now() + tokenData.expires_in * 1000),
                    },
                });

                this.accessToken = tokenData.access_token;
            } catch (error) {
                console.error("Failed to refresh YouTube token:", error);
                throw new Error("Failed to refresh YouTube access token");
            }
        } else {
            // Use the existing token
            this.accessToken = account.accessToken;
        }
    }

    /**
     * Get channel information
     */
    async getChannelInfo() {
        if (!this.accessToken) {
            await this.initialize();
        }

        const account = await prisma.platformAccount.findUnique({
            where: { id: this.platformAccountId },
        });

        if (!account) {
            throw new Error("Platform account not found");
        }

        const channelId = account.platformAccountId;
        
        return await getYouTubeChannelInfo(this.accessToken!, channelId);
    }

    /**
     * Get videos from YouTube channel
     */
    async getVideos(maxResults: number = 10): Promise<YouTubeVideo[]> {
        if (!this.accessToken) {
            await this.initialize();
        }

        const account = await prisma.platformAccount.findUnique({
            where: { id: this.platformAccountId },
        });

        if (!account) {
            throw new Error("Platform account not found");
        }

        const channelId = account.platformAccountId;

        try {
            // First get the upload playlist ID for the channel
            const channelResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        Accept: "application/json",
                    },
                }
            );

            if (!channelResponse.ok) {
                throw new Error(`Failed to fetch channel data: ${channelResponse.statusText}`);
            }

            const channelData = await channelResponse.json();
            const playlistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

            if (!playlistId) {
                throw new Error("Could not find uploads playlist");
            }

            // Now get the videos in the uploads playlist
            const videosResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        Accept: "application/json",
                    },
                }
            );

            if (!videosResponse.ok) {
                throw new Error(`Failed to fetch videos: ${videosResponse.statusText}`);
            }

            const videosData = await videosResponse.json();
            
            // Get video IDs to fetch detailed stats
            const videoIds = videosData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
            
            // Get detailed video information including statistics
            const videoDetailsResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        Accept: "application/json",
                    },
                }
            );

            if (!videoDetailsResponse.ok) {
                throw new Error(`Failed to fetch video details: ${videoDetailsResponse.statusText}`);
            }

            const videoDetails = await videoDetailsResponse.json();
            
            // Map video details to our format
            return videoDetails.items.map((item: any) => ({
                id: item.id,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnailUrl: item.snippet.thumbnails.high?.url || 
                             item.snippet.thumbnails.medium?.url || 
                             item.snippet.thumbnails.default?.url,
                publishedAt: item.snippet.publishedAt,
                duration: formatDuration(item.contentDetails.duration),
                viewCount: parseInt(item.statistics.viewCount || '0', 10),
                likeCount: parseInt(item.statistics.likeCount || '0', 10),
                commentCount: parseInt(item.statistics.commentCount || '0', 10),
            }));
        } catch (error) {
            console.error("Error fetching YouTube videos:", error);
            throw error;
        }
    }

    /**
     * Create an upload session for a video
     */
    async createUploadSession(
        params: YouTubeVideoUploadParams,
        fileSize: number,
        mimeType: string
    ): Promise<YouTubeUploadSession> {
        if (!this.accessToken) {
            await this.initialize();
        }

        try {
            const metadata = {
                snippet: {
                    title: params.title,
                    description: params.description || "",
                    tags: params.tags || [],
                    categoryId: params.categoryId || "22", // 22 is "People & Blogs"
                },
                status: {
                    privacyStatus: params.privacyStatus || "private",
                    selfDeclaredMadeForKids: !!params.madeForKids,
                    publishAt: params.scheduledPublishTime 
                        ? params.scheduledPublishTime.toISOString() 
                        : undefined,
                },
            };

            // Create the upload session
            const response = await fetch(
                "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        "Content-Type": "application/json",
                        "X-Upload-Content-Length": fileSize.toString(),
                        "X-Upload-Content-Type": mimeType,
                    },
                    body: JSON.stringify(metadata),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to create upload session: ${response.statusText}`);
            }

            const uploadUrl = response.headers.get("Location");
            if (!uploadUrl) {
                throw new Error("Failed to get upload URL");
            }

            return { uploadUrl };
        } catch (error) {
            console.error("Error creating YouTube upload session:", error);
            throw error;
        }
    }

    /**
     * Check the status of a video upload
     */
    async checkUploadStatus(uploadUrl: string): Promise<YouTubeUploadResult | null> {
        if (!this.accessToken) {
            await this.initialize();
        }

        try {
            const response = await fetch(uploadUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    "Content-Length": "0",
                    "Content-Range": "bytes */0",
                },
            });

            if (response.status === 200 || response.status === 201) {
                const data = await response.json();
                return { videoId: data.id, uploadUrl };
            }

            if (response.status === 308) {
                // Upload is still in progress
                return null;
            }

            throw new Error(`Upload check failed with status: ${response.status}`);
        } catch (error) {
            console.error("Error checking YouTube upload status:", error);
            throw error;
        }
    }
}
