import { TikTokApiClient } from '@/lib/tiktok/api';

// Types for TikTok API responses based on documentation
interface TikTokCreatorInfo {
  creator_avatar_url: string;
  creator_username: string;
  creator_nickname: string;
  privacy_level_options: string[];
  comment_disabled: boolean;
  duet_disabled: boolean;
  stitch_disabled: boolean;
  max_video_post_duration_sec: number;
}

interface TikTokVideoInitResponse {
  publish_id: string;
  upload_url?: string;
}

interface TikTokVideoStatusResponse {
  status: string;
  video_id?: string;
  create_time?: number;
  share_url?: string;
  error_code?: string;
  error_message?: string;
}

export interface UploadProgressInfo {
  status: 'idle' | 'initializing' | 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  message?: string;
  publishId?: string;
  videoId?: string;
  shareUrl?: string;
}

export type PrivacyLevel = 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';

export interface VideoPostInfo {
  title: string;
  privacy_level: PrivacyLevel;
  disable_duet: boolean;
  disable_comment: boolean;
  disable_stitch: boolean;
  video_cover_timestamp_ms?: number;
}

/**
 * TikTok Upload Service
 * Handles the process of uploading videos to TikTok
 */
export class TikTokUploadService {
  private apiClient: TikTokApiClient;
  private chunkSize = 10 * 1024 * 1024; // 10MB chunk size
  private progressCallback: (progress: UploadProgressInfo) => void;
  private publishId?: string;
  private uploadUrl?: string;
  
  constructor(
    accountId: string, 
    progressCallback?: (progress: UploadProgressInfo) => void
  ) {
    this.apiClient = new TikTokApiClient(accountId);
    this.progressCallback = progressCallback || (() => {});
  }
  
  /**
   * Get creator info needed for posting
   */
  async getCreatorInfo(): Promise<TikTokCreatorInfo> {
    try {
      const response = await fetch('/api/tiktok/creator-info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch creator info: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to get creator info:', error);
      throw error;
    }
  }
  
  /**
   * Initialize a video upload
   */
  async initVideoUpload(
    file: File, 
    postInfo: VideoPostInfo
  ): Promise<{ publishId: string; uploadUrl?: string }> {
    this.updateProgress({
      status: 'initializing',
      progress: 0,
      message: 'Initializing upload...'
    });
    
    try {
      // Calculate total chunks
      const totalChunks = Math.ceil(file.size / this.chunkSize);
      
      // Initialize upload with direct file upload method
      const response = await fetch('/api/tiktok/video/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_info: postInfo,
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: file.size,
            chunk_size: this.chunkSize,
            total_chunk_count: totalChunks
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to initialize upload: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data.publish_id) {
        throw new Error('No publish ID received from TikTok API');
      }
      
      this.publishId = data.data.publish_id;
      this.uploadUrl = data.data.upload_url;
      
      this.updateProgress({
        status: 'uploading',
        progress: 0,
        message: 'Upload initialized',
        publishId: this.publishId
      });
      
      return {
        publishId: data.data.publish_id,
        uploadUrl: data.data.upload_url
      };
    } catch (error) {
      this.updateProgress({
        status: 'error',
        progress: 0,
        message: `Upload initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      throw error;
    }
  }
  
  /**
   * Upload video in chunks
   */
  async uploadVideoChunks(file: File): Promise<void> {
    if (!this.publishId || !this.uploadUrl) {
      throw new Error('Upload not initialized. Call initVideoUpload first.');
    }
    
    const totalChunks = Math.ceil(file.size / this.chunkSize);
    let currentChunk = 0;
    
    try {
      while (currentChunk < totalChunks) {
        const start = currentChunk * this.chunkSize;
        const end = Math.min(file.size, start + this.chunkSize);
        const chunk = file.slice(start, end);
        
        // Upload the chunk
        await this.uploadChunk(chunk, currentChunk, totalChunks);
        
        // Update progress
        currentChunk++;
        const progress = Math.round((currentChunk / totalChunks) * 100);
        
        this.updateProgress({
          status: 'uploading',
          progress,
          message: `Uploading chunk ${currentChunk}/${totalChunks}`,
          publishId: this.publishId
        });
      }
      
      // Start checking status after upload is complete
      this.updateProgress({
        status: 'processing',
        progress: 100,
        message: 'Upload complete, processing video...',
        publishId: this.publishId
      });
      
      // Monitor the upload status
      await this.checkUploadStatus();
      
    } catch (error) {
      this.updateProgress({
        status: 'error',
        progress: 0,
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      throw error;
    }
  }
  
  /**
   * Upload a single chunk to TikTok
   */
  private async uploadChunk(
    chunk: Blob, 
    chunkIndex: number, 
    totalChunks: number
  ): Promise<void> {
    if (!this.uploadUrl) {
      throw new Error('Upload URL not available');
    }
    
    // Create form data for the chunk
    const formData = new FormData();
    formData.append('video', chunk);
    
    // Upload the chunk via our API proxy
    const response = await fetch('/api/tiktok/video/upload-chunk', {
      method: 'POST',
      headers: {
        'x-chunk-index': chunkIndex.toString(),
        'x-total-chunks': totalChunks.toString(),
        'x-upload-url': this.uploadUrl
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload chunk ${chunkIndex}: ${response.status}`);
    }
  }
  
  /**
   * Check the status of the video upload
   */
  private async checkUploadStatus(): Promise<void> {
    if (!this.publishId) {
      throw new Error('No publish ID available');
    }
    
    try {
      let status = 'PROCESSING';
      let retries = 0;
      const maxRetries = 30; // Maximum number of retry attempts
      const retryDelay = 2000; // 2 seconds between retries
      
      while (status === 'PROCESSING' && retries < maxRetries) {
        // Wait before checking again
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        // Check status
        const response = await fetch('/api/tiktok/video/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publish_id: this.publishId
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to check status: ${response.status}`);
        }
        
        const data = await response.json();
        status = data.data.status;
        
        if (status === 'PROCESSING') {
          retries++;
          this.updateProgress({
            status: 'processing',
            progress: 100,
            message: `Processing video (${retries}/${maxRetries})...`,
            publishId: this.publishId
          });
        } else if (status === 'SUCCESS') {
          this.updateProgress({
            status: 'success',
            progress: 100,
            message: 'Video uploaded successfully!',
            publishId: this.publishId,
            videoId: data.data.video_id,
            shareUrl: data.data.share_url
          });
        } else {
          this.updateProgress({
            status: 'error',
            progress: 0,
            message: `Upload failed: ${data.data.error_message || 'Unknown error'}`,
            publishId: this.publishId
          });
          throw new Error(`Upload failed: ${data.data.error_message || 'Unknown error'}`);
        }
      }
      
      if (retries >= maxRetries && status === 'PROCESSING') {
        this.updateProgress({
          status: 'error',
          progress: 0,
          message: 'Upload processing timeout',
          publishId: this.publishId
        });
        throw new Error('Upload processing timeout');
      }
      
    } catch (error) {
      this.updateProgress({
        status: 'error',
        progress: 0,
        message: `Status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        publishId: this.publishId
      });
      throw error;
    }
  }
  
  /**
   * Upload a video to TikTok (complete flow)
   */
  async uploadVideo(
    file: File, 
    postInfo: VideoPostInfo
  ): Promise<{ 
    videoId?: string; 
    publishId: string; 
    shareUrl?: string; 
  }> {
    try {
      // Step 1: Initialize upload
      const initResult = await this.initVideoUpload(file, postInfo);
      
      if (!initResult.publishId) {
        throw new Error('Failed to get publish ID from initialization');
      }
      
      // Step 2: Upload video chunks
      await this.uploadVideoChunks(file);
      
      // Return upload information
      return {
        publishId: initResult.publishId,
        videoId: undefined, // Will be populated after status check
        shareUrl: undefined // Will be populated after status check
      };
    } catch (error) {
      this.updateProgress({
        status: 'error',
        progress: 0,
        message: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      throw error;
    }
  }
  
  /**
   * Update the progress callback
   */
  private updateProgress(progress: UploadProgressInfo): void {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }
} 