export interface YouTubeUserInfo {
    channelId: string;
    title: string;
    description?: string;
    customUrl?: string;
    thumbnailUrl?: string;
    subscriberCount?: number;
    videoCount?: number;
    viewCount?: number;
}

export interface YouTubeAccountData {
    id: string;
    platformType: string;
    platformAccountId: string;
    accountName: string;
    accessToken: string;
    refreshToken: string;
    tokenExpiry: Date;
    metadata?: {
        channelId: string;
        title?: string;
        thumbnailUrl?: string;
    };
}

export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    publishedAt: string;
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
}

export interface YouTubeUploadResult {
    videoId: string;
    uploadUrl?: string;
}

export interface YouTubeVideoUploadParams {
    title: string;
    description?: string;
    tags?: string[];
    categoryId?: string;
    privacyStatus?: "private" | "public" | "unlisted";
    madeForKids?: boolean;
    notifySubscribers?: boolean;
    scheduledPublishTime?: Date;
}

export interface YouTubeUploadSession {
    uploadUrl: string;
    videoId?: string;
}

export interface YouTubeTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
}

export interface YouTubeApiError {
    code: number;
    message: string;
    errors?: Array<{
        message: string;
        domain: string;
        reason: string;
    }>;
}

export enum YouTubePrivacyStatus {
    PRIVATE = "private",
    PUBLIC = "public",
    UNLISTED = "unlisted"
}
