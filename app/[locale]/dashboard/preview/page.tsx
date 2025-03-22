import React from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import PlatformPreview from '@/components/scheduler/PlatformPreview'

// Demo content for our previews
const demoContent = {
  title: "Check out our new product launch! 🚀",
  description: "We're excited to announce our latest product that will revolutionize the industry. Watch this video for all the details.",
  tags: ["newproduct", "launch", "exciting", "2025"],
  mediaUrl: undefined // In a real app, this would be a URL to an image or video
}

export default function PreviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/schedule" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
          <span>Back to Schedule</span>
        </Link>
      </div>
      
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Platform Previews</h1>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="mb-6 text-gray-500">
            See how your content will appear on different social media platforms before you publish.
            This helps ensure your content is optimized for each platform's specific layout and audience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PlatformPreview platform="tiktok" content={demoContent} />
            <PlatformPreview platform="instagram" content={demoContent} />
            <PlatformPreview platform="facebook" content={demoContent} />
            <PlatformPreview platform="youtube" content={demoContent} />
          </div>
        </div>
      </div>
    </div>
  )
}
