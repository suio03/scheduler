import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface PostPreviewProps {
    caption: string
    hashtags: string[]
    mediaFiles: File | File[]
    username?: string
}

export default function PostPreview({
    caption,
    hashtags,
    mediaFiles,
    username = 'your_username'
}: PostPreviewProps) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    // Process video file when it changes
    useEffect(() => {
        if (!mediaFiles || (Array.isArray(mediaFiles) && mediaFiles.length === 0)) {
            setVideoUrl(null)
            return
        }

        // Clean up previous URL
        if (videoUrl) URL.revokeObjectURL(videoUrl)
        
        setIsProcessing(true)
        
        const file = Array.isArray(mediaFiles) ? mediaFiles[0] : mediaFiles
        
        if (file && file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file)
            setVideoUrl(url)
        } else {
            setVideoUrl(null)
        }
        
        setIsProcessing(false)
    }, [mediaFiles])

    // Extract hashtags from caption if not provided separately
    const displayHashtags = hashtags.length > 0 
        ? hashtags.join(' ')
        : caption.match(/#\w+/g)?.join(' ') || ''
    const captionWithoutHashtags = caption.replace(/#\w+/g, '')
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Preview</h3>
                <p className="text-xs text-gray-500 mt-1">
                    How your post will look like
                </p>
            </div>

            <div className="p-4">
                <div className="w-full max-w-[280px] mx-auto bg-black rounded-xl overflow-hidden shadow-lg">
                    {/* TikTok-like mobile preview */}
                    <div className="relative">
                        {/* Video container */}
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
                            ) : (
                                <div className="text-gray-400 text-sm">Video Preview</div>
                            )}

                            {isProcessing && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>

                        {/* Caption and hashtags overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                            <p className="text-white text-xs mt-1 line-clamp-2">
                                {captionWithoutHashtags || 'Your caption will appear here'}
                            </p>
                            {displayHashtags && (
                                <p className="text-white text-xs mt-1">
                                    {displayHashtags}
                                </p>
                            )}
                        </div>
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
