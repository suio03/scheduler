'use client'

import { useState } from 'react'
import PostEditor from '@/components/creator/PostEditor'
import PostPreview from '@/components/creator/PostPreview'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import MediaUploader from '@/components/creator/MediaUploader'

export default function CreatePostPage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [caption, setCaption] = useState<string>('Write a caption for your post...')
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'published' | 'processing' | 'error'>('draft')
  const [scheduledTime, setScheduledTime] = useState<Date | undefined>(undefined)
  
  const handleFileChange = (file: File | null, preview: string | null) => {
    setFile(file)
    setPreviewUrl(preview)
  }
  
  const handleCaptionChange = (text: string) => {
    setCaption(text)
  }
  
  const handleSchedule = () => {
    setStatus('scheduled')
    
    // Set a time 24 hours from now
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setScheduledTime(tomorrow)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/schedule" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
          <span>Back to Schedule</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Save as Draft
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleSchedule}
            disabled={!file}
          >
            Schedule Post
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PostEditor 
            onFileChange={handleFileChange}
            onCaptionChange={handleCaptionChange}
          />
        </div>
        <div>
          <PostPreview 
            videoUrl={previewUrl || undefined}
            caption={caption}
            username="@your_username"
            scheduledTime={scheduledTime}
            status={status}
            isProcessing={status === 'processing'}
          />
        </div>
      </div>
    </div>
  )
}
