// TikTok API Types

// OAuth Types
export interface TikTokTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  open_id: string;
  scope: string;
}

export interface TikTokErrorResponse {
  error: string;
  error_description?: string;
  log_id?: string;
}

// User Info Types
export interface TikTokUserInfo {
  open_id: string;
  union_id: string;
  avatar_url: string;
  avatar_url_100: string;
  avatar_url_200: string;
  display_name: string;
  bio_description: string;
  profile_deep_link: string;
  is_verified: boolean;
  username: string;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

// Video Upload Types (Legacy API)
export interface TikTokVideoUploadInitResponse {
  upload_url: string;
  video_id: string;
}

export interface TikTokVideoUploadCompleteResponse {
  video_id: string;
}

// Video Publish Types (Legacy API)
export interface TikTokVideoPublishRequest {
  video_id: string;
  title?: string;
  privacy_level?: 'PUBLIC' | 'SELF_ONLY' | 'FOLLOW_FRIENDS_ONLY';
  disable_comment?: boolean;
  disable_duet?: boolean;
  disable_stitch?: boolean;
  brand_content_toggle?: boolean;
  brand_organic_toggle?: boolean;
  scheduled_publish_time?: number; // Unix timestamp
}

export interface TikTokVideoPublishResponse {
  publish_id: string;
  video_id: string;
  create_time: number;
}

// Analytics Types
export interface TikTokVideoMetrics {
  video_id: string;
  like_count: number;
  comment_count: number;
  view_count: number;
  share_count: number;
  profile_visits: number;
}

// Platform Account Types (for our database)
export interface TikTokAccountData {
  id?: string;
  platformType: string;
  platformAccountId: string;
  accountName: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date;
  metadata: {
    openId: string;
    avatarUrl?: string;
    displayName?: string;
    [key: string]: any;
  };
}

// Content Posting API Types (New API)

// Privacy Level Options
export type PrivacyLevel = 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';

// Creator Info Response
export interface TikTokCreatorInfoResponse {
  data: {
    creator_avatar_url: string;
    creator_username: string;
    creator_nickname: string;
    privacy_level_options: PrivacyLevel[];
    comment_disabled: boolean;
    duet_disabled: boolean;
    stitch_disabled: boolean;
    max_video_post_duration_sec: number;
  };
  error: {
    code: string;
    message: string;
    log_id: string;
  };
}

// Post Info
export interface PostInfo {
  title: string;
  privacy_level?: PrivacyLevel;
  disable_duet?: boolean;
  disable_comment?: boolean;
  disable_stitch?: boolean;
  video_cover_timestamp_ms?: number;
  description?: string;
  auto_add_music?: boolean;
}

// Video Source Info
export interface VideoSourceInfo {
  source: 'FILE_UPLOAD' | 'PULL_FROM_URL';
  video_size?: number;
  chunk_size?: number;
  total_chunk_count?: number;
  video_url?: string;
}

// Photo Source Info
export interface PhotoSourceInfo {
  source: 'PULL_FROM_URL';
  photo_cover_index?: number;
  photo_images: string[];
}

// Video Init Request
export interface TikTokVideoInitRequest {
  post_info: PostInfo;
  source_info: VideoSourceInfo;
}

// Content Init Request
export interface TikTokContentInitRequest {
  post_info: PostInfo;
  source_info: PhotoSourceInfo;
  post_mode: 'DIRECT_POST';
  media_type: 'PHOTO';
}

// Video Init Response
export interface TikTokVideoInitResponse {
  data: {
    publish_id: string;
    upload_url?: string;
  };
  error: {
    code: string;
    message: string;
    log_id: string;
  };
}

// Content Init Response
export interface TikTokContentInitResponse {
  data: {
    publish_id: string;
  };
  error: {
    code: string;
    message: string;
    log_id: string;
  };
}

// Post Status Response
export interface TikTokPostStatusResponse {
  data: {
    publish_id: string;
    publish_status: 'PROCESSING' | 'PUBLISHED' | 'FAILED';
    share_url?: string;
    video_id?: string;
    public_video_id?: string;
    error_message?: string;
  };
  error: {
    code: string;
    message: string;
    log_id: string;
  };
}
