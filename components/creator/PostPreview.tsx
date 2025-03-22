import React from 'react'
import { ChatBubbleLeftIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PostPreviewProps {
    videoUrl?: string
    thumbnailUrl?: string
    caption?: string
    username?: string
    avatarUrl?: string
    isProcessing?: boolean
    scheduledTime?: Date
    status?: 'draft' | 'scheduled' | 'published' | 'processing' | 'error'
}

export default function PostPreview({
    videoUrl,
    thumbnailUrl,
    caption = 'Your caption will appear here. This is a preview of your TikTok post.',
    username = '@username',
    avatarUrl,
    isProcessing = false,
    scheduledTime,
    status = 'draft'
}: PostPreviewProps) {
    // Format the scheduled time
    const formattedScheduledTime = scheduledTime 
        ? new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(scheduledTime)
        : 'Not scheduled';

    // Get status badge color
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Preview</h3>
                <p className="text-xs text-gray-500 mt-1">
                    How your post will appear on TikTok
                </p>
            </div>

            <div className="p-4">
                <div className="w-full max-w-[280px] mx-auto bg-black rounded-xl overflow-hidden shadow-lg">
                    {/* TikTok-like mobile preview */}
                    <div className="relative">
                        {/* Video/Thumbnail container */}
                        <div className="aspect-[9/16] bg-gray-800 flex items-center justify-center relative overflow-hidden">
                            {videoUrl ? (
                                <video 
                                    src={videoUrl}
                                    className="w-full h-full object-cover"
                                    loop
                                    muted
                                    autoPlay
                                    playsInline
                                />
                            ) : thumbnailUrl ? (
                                <Image
                                    src={thumbnailUrl}
                                    alt="Video thumbnail"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="text-gray-400 text-sm">Video Preview</div>
                            )}
                            
                            {isProcessing && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>

                        {/* Username and caption overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                            <div className="text-white text-sm font-medium">{username}</div>
                            <p className="text-white text-xs mt-1 line-clamp-2">
                                {caption}
                            </p>
                            <p className="text-white text-xs mt-1">
                                #trending #fyp #viral
                            </p>
                        </div>

                        {/* Right side action buttons */}
                        <div className="absolute right-2 bottom-20 flex flex-col items-center space-y-4">
                            <button className="text-white">
                                <HeartIconSolid className="w-6 h-6 text-red-500" />
                                <span className="text-xs block mt-1">23.4K</span>
                            </button>
                            <button className="text-white">
                                <ChatBubbleLeftIcon className="w-6 h-6" />
                                <span className="text-xs block mt-1">1.2K</span>
                            </button>
                            <button className="text-white">
                                <BookmarkIcon className="w-6 h-6" />
                                <span className="text-xs block mt-1">5.7K</span>
                            </button>
                            <button className="text-white">
                                <ShareIcon className="w-6 h-6" />
                                <span className="text-xs block mt-1">Share</span>
                            </button>
                        </div>

                        {/* Top account info */}
                        <div className="absolute top-0 left-0 right-0 p-3 flex items-center">
                            <div className="w-8 h-8 bg-gray-400 rounded-full overflow-hidden">
                                {avatarUrl ? (
                                    <Image
                                        src={avatarUrl}
                                        alt={username}
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-400" />
                                )}
                            </div>
                            <div className="ml-2 text-white text-sm font-medium">{username}</div>
                            <button className="ml-auto text-white border border-white rounded-md px-2 py-0.5 text-xs">
                                Follow
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Post Details</h4>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <span className="text-xs text-gray-500 w-24">Platform:</span>
                            <span className="text-xs font-medium text-gray-700">TikTok</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-xs text-gray-500 w-24">Scheduled For:</span>
                            <span className="text-xs font-medium text-gray-700">{formattedScheduledTime}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-xs text-gray-500 w-24">Status:</span>
                            <span className={cn(
                                "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                                getStatusBadgeClass(status)
                            )}>
                                {status}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-xs text-gray-500 w-24">Media:</span>
                            <span className="text-xs font-medium text-gray-700">
                                {videoUrl ? 'Video uploaded' : 'None'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Analytics Prediction</h4>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-xs text-blue-700">
                            Based on your previous posts, this content is predicted to perform above average with your audience.
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Posting Time Recommendation</h4>
                    <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                        <p className="text-xs text-green-700">
                            Recommended posting time: <strong>Tuesday at 6:00 PM</strong> (Your audience is most active then)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
