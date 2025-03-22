import React from 'react'

// Types for our preview component
interface PlatformPreviewProps {
  platform: string
  content: {
    title: string
    description: string
    tags: string[]
    mediaUrl?: string
  }
}

export default function PlatformPreview({ platform, content }: PlatformPreviewProps) {
  // Common rendering function for the device frame
  const renderMobileFrame = (children: React.ReactNode) => {
    return (
      <div className="mx-auto w-64 h-96 bg-gray-100 border-8 border-gray-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="bg-gray-800 h-6 w-full flex items-center justify-center">
          <div className="w-16 h-1.5 bg-gray-600 rounded-full"></div>
        </div>
        <div className="h-full bg-white overflow-y-auto">
          {children}
        </div>
      </div>
    )
  }

  // TikTok preview
  const renderTikTokPreview = () => {
    return renderMobileFrame(
      <div className="p-3">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <div className="ml-2">
            <div className="text-xs font-bold">Your Account</div>
            <div className="text-xs text-gray-500">Just now</div>
          </div>
        </div>
        
        <div className="text-sm">{content.title || 'Your caption will appear here'}</div>
        
        {content.tags.length > 0 && (
          <div className="mt-2 text-sm text-blue-500">
            {content.tags.map(tag => `#${tag}`).join(' ')}
          </div>
        )}
        
        <div className="mt-3 aspect-video bg-gray-300 rounded flex items-center justify-center">
          {content.mediaUrl ? (
            <img
              src={content.mediaUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-xs text-gray-600">Media Preview</div>
          )}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div>0 likes</div>
          <div>0 comments</div>
          <div>0 shares</div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <span className="text-xs mt-1">Like</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <span className="text-xs mt-1">Comment</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <span className="text-xs mt-1">Share</span>
          </div>
        </div>
      </div>
    )
  }

  // Instagram preview
  const renderInstagramPreview = () => {
    return renderMobileFrame(
      <div className="pb-3">
        <div className="flex items-center p-3 border-b border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <div className="ml-2 text-xs font-bold">Your Account</div>
          <div className="ml-auto text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
        </div>
        
        <div className="aspect-square bg-gray-300 flex items-center justify-center">
          {content.mediaUrl ? (
            <img
              src={content.mediaUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-xs text-gray-600">Media Preview</div>
          )}
        </div>
        
        <div className="p-3">
          <div className="flex justify-between mb-2">
            <div className="flex space-x-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          
          <div className="text-xs font-bold">0 likes</div>
          
          <div className="mt-1">
            <span className="text-xs font-bold">Your Account</span>
            <span className="text-xs ml-2">{content.title || 'Your caption will appear here'}</span>
          </div>
          
          {content.tags.length > 0 && (
            <div className="mt-1 text-xs text-blue-500">
              {content.tags.map(tag => `#${tag}`).join(' ')}
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-500">View all 0 comments</div>
          <div className="mt-1 text-xs text-gray-400">Just now</div>
        </div>
      </div>
    )
  }

  // Facebook preview
  const renderFacebookPreview = () => {
    return renderMobileFrame(
      <div className="p-3">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
          <div className="ml-2">
            <div className="text-xs font-bold">Your Page</div>
            <div className="text-xs text-gray-500">Just now · <span>🌎</span></div>
          </div>
          <div className="ml-auto text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
        </div>
        
        <div className="text-sm mb-3">{content.title || 'Your post will appear here'}</div>
        
        {content.description && (
          <div className="text-xs mb-3">{content.description}</div>
        )}
        
        <div className="aspect-video bg-gray-300 rounded-md flex items-center justify-center mb-3">
          {content.mediaUrl ? (
            <img
              src={content.mediaUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="text-xs text-gray-600">Media Preview</div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <div>0 Likes</div>
          <div>0 Comments · 0 Shares</div>
        </div>
        
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-1">
          <button className="flex items-center justify-center flex-1 py-1 text-xs text-gray-500">
            Like
          </button>
          <button className="flex items-center justify-center flex-1 py-1 text-xs text-gray-500">
            Comment
          </button>
          <button className="flex items-center justify-center flex-1 py-1 text-xs text-gray-500">
            Share
          </button>
        </div>
      </div>
    )
  }

  // YouTube preview
  const renderYouTubePreview = () => {
    return renderMobileFrame(
      <div className="bg-gray-100 min-h-full">
        <div className="aspect-video bg-gray-300 flex items-center justify-center">
          {content.mediaUrl ? (
            <img
              src={content.mediaUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-xs text-gray-600">Video Preview</div>
          )}
          
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
            0:00
          </div>
        </div>
        
        <div className="p-3">
          <div className="text-sm font-bold line-clamp-2">{content.title || 'Your video title will appear here'}</div>
          
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <span>0 views · Just now</span>
          </div>
          
          <div className="flex items-center mt-3">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <div className="ml-2 text-xs">Your Channel</div>
          </div>
          
          <div className="mt-3 text-xs text-gray-700 line-clamp-2">
            {content.description || 'Your video description will appear here'}
          </div>
        </div>
      </div>
    )
  }

  // Render the appropriate preview based on the platform
  switch (platform.toLowerCase()) {
    case 'tiktok':
      return (
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <div className="w-5 h-5 rounded-full bg-red-500 mr-2"></div>
            TikTok Preview
          </h3>
          {renderTikTokPreview()}
        </div>
      )
    case 'instagram':
      return (
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <div className="w-5 h-5 rounded-full bg-purple-500 mr-2"></div>
            Instagram Preview
          </h3>
          {renderInstagramPreview()}
        </div>
      )
    case 'facebook':
      return (
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <div className="w-5 h-5 rounded-full bg-blue-500 mr-2"></div>
            Facebook Preview
          </h3>
          {renderFacebookPreview()}
        </div>
      )
    case 'youtube':
      return (
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <div className="w-5 h-5 rounded-full bg-red-700 mr-2"></div>
            YouTube Preview
          </h3>
          {renderYouTubePreview()}
        </div>
      )
    default:
      return (
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Platform Preview Not Available
          </h3>
          <p className="text-gray-500">Preview is not available for this platform.</p>
        </div>
      )
  }
}
