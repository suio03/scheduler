'use client'
import React, { useState } from 'react'
import { CalendarIcon, ClockIcon, ArrowUpTrayIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'

const platforms = [
  { id: 'tiktok', name: 'TikTok', icon: '/tiktok-icon.png', color: 'bg-red-500' },
  { id: 'instagram', name: 'Instagram', icon: '/instagram-icon.png', color: 'bg-purple-500' },
  { id: 'facebook', name: 'Facebook', icon: '/facebook-icon.png', color: 'bg-blue-500' },
  { id: 'youtube', name: 'YouTube', icon: '/youtube-icon.png', color: 'bg-red-700' },
]

export default function CreatePostForm() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['tiktok'])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [activeTab, setActiveTab] = useState('content')
  const [scheduleOption, setScheduleOption] = useState('now')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Toggle platform selection
  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformId))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId])
    }
  }

  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      addTag()
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setMediaFiles([...mediaFiles, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = [...mediaFiles]
    updatedFiles.splice(index, 1)
    setMediaFiles(updatedFiles)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // In a real application, you would send this data to your API
    const formData = {
      platforms: selectedPlatforms,
      title,
      description,
      tags,
      scheduledDate: scheduleOption === 'now' ? new Date().toISOString() : `${scheduledDate}T${scheduledTime}:00`,
      media: mediaFiles.map(file => file.name) // In a real app, you'd upload these files
    }
    
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Here you would handle success/redirect
      alert('Post created successfully!')
    }, 1500)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('scheduling')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'scheduling'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Scheduling
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Preview
          </button>
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Platforms
                </label>
                <div className="flex flex-wrap gap-3">
                  {platforms.map(platform => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatform(platform.id)}
                      className={`flex items-center px-3 py-2 rounded-md border ${
                        selectedPlatforms.includes(platform.id)
                          ? `border-${platform.color.split('-')[1]}-500 bg-${platform.color.split('-')[1]}-50 text-${platform.color.split('-')[1]}-700`
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${platform.color} mr-2`}></div>
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title/Caption
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter a compelling title for your post"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Add more details about your post"
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">
                  {description.length} / 2200 characters
                </p>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Hashtags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Add hashtags without the # symbol"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                  >
                    Add
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Popular hashtags: #trending #fyp #viral
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Media
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          multiple
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, MP4 up to 100MB
                    </p>
                  </div>
                </div>

                {mediaFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {mediaFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative border border-gray-200 rounded-md p-2"
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <svg
                                className="w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="ml-2 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scheduling Tab */}
          {activeTab === 'scheduling' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  When to publish
                </label>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="schedule-now"
                      name="schedule-option"
                      type="radio"
                      checked={scheduleOption === 'now'}
                      onChange={() => setScheduleOption('now')}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="schedule-now" className="ml-3 block text-sm font-medium text-gray-700">
                      Publish now
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="schedule-later"
                      name="schedule-option"
                      type="radio"
                      checked={scheduleOption === 'later'}
                      onChange={() => setScheduleOption('later')}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="schedule-later" className="ml-3 block text-sm font-medium text-gray-700">
                      Schedule for later
                    </label>
                  </div>
                </div>
              </div>

              {scheduleOption === 'later' && (
                <div className="space-y-4 pl-7">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1 md:flex md:justify-between">
                        <p className="text-sm text-blue-700">
                          Best time to post on TikTok: 9:00 AM - 11:00 AM or 7:00 PM - 9:00 PM
                        </p>
                        <p className="mt-3 text-sm md:mt-0 md:ml-6">
                          <a href="#" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                            Learn more <span aria-hidden="true">&rarr;</span>
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-md font-medium text-gray-900">Advanced Options</h3>
                
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="auto-optimize"
                        name="auto-optimize"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="auto-optimize" className="font-medium text-gray-700">
                        Optimize content for each platform
                      </label>
                      <p className="text-gray-500">
                        Automatically adjust media and captions for optimal performance on each platform
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="first-comment"
                        name="first-comment"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="first-comment" className="font-medium text-gray-700">
                        Auto-respond to first comments
                      </label>
                      <p className="text-gray-500">
                        Automatically reply to initial engagement with a preset response
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Previews</h3>
              
              <div className="space-y-6">
                {selectedPlatforms.map((platformId) => {
                  const platform = platforms.find(p => p.id === platformId)
                  if (!platform) return null

                  return (
                    <div key={platformId} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className={`px-4 py-3 ${platform.color} text-white font-medium`}>
                        {platform.name} Preview
                      </div>
                      
                      <div className="p-4">
                        {/* Mobile device frame for preview */}
                        <div className="mx-auto w-64 h-96 bg-gray-100 border-8 border-gray-800 rounded-3xl overflow-hidden shadow-lg">
                          <div className="bg-gray-800 h-6 w-full flex items-center justify-center">
                            <div className="w-16 h-1.5 bg-gray-600 rounded-full"></div>
                          </div>
                          
                          <div className="h-full bg-white overflow-y-auto">
                            {/* TikTok-specific preview */}
                            {platform.id === 'tiktok' && (
                              <div className="p-3">
                                <div className="flex items-center mb-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                  <div className="ml-2">
                                    <div className="text-xs font-bold">Your Username</div>
                                    <div className="text-xs text-gray-500">Just now</div>
                                  </div>
                                </div>
                                
                                <div className="text-sm">{title || 'Your caption will appear here'}</div>
                                
                                {tags.length > 0 && (
                                  <div className="mt-2 text-sm text-blue-500">
                                    {tags.map(tag => `#${tag}`).join(' ')}
                                  </div>
                                )}
                                
                                <div className="mt-3 aspect-video bg-gray-300 rounded flex items-center justify-center">
                                  {mediaFiles.length > 0 ? (
                                    mediaFiles[0].type.startsWith('image/') ? (
                                      <img
                                        src={URL.createObjectURL(mediaFiles[0])}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="text-xs text-gray-600">Video Preview</div>
                                    )
                                  ) : (
                                    <div className="text-xs text-gray-600">Media Preview</div>
                                  )}
                                </div>
                                
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                  <div>0 likes</div>
                                  <div>0 comments</div>
                                  <div>0 shares</div>
                                </div>
                              </div>
                            )}
                            
                            {/* Instagram-specific preview */}
                            {platform.id === 'instagram' && (
                              <div className="pb-3">
                                <div className="flex items-center p-3 border-b border-gray-200">
                                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                  <div className="ml-2 text-xs font-bold">Your Username</div>
                                </div>
                                
                                <div className="aspect-square bg-gray-300">
                                  {mediaFiles.length > 0 && mediaFiles[0].type.startsWith('image/') && (
                                    <img
                                      src={URL.createObjectURL(mediaFiles[0])}
                                      alt="Preview"
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                
                                <div className="px-3 pt-2">
                                  <div className="text-xs font-bold mb-1">Your Username</div>
                                  <div className="text-xs">{title || 'Your caption will appear here'}</div>
                                  
                                  {tags.length > 0 && (
                                    <div className="mt-1 text-xs text-blue-500">
                                      {tags.map(tag => `#${tag}`).join(' ')}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Facebook & YouTube simplified previews */}
                            {(platform.id === 'facebook' || platform.id === 'youtube') && (
                              <div className="p-3">
                                <div className="flex items-center mb-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                  <div className="ml-2">
                                    <div className="text-xs font-bold">Your Page</div>
                                    <div className="text-xs text-gray-500">Just now</div>
                                  </div>
                                </div>
                                
                                <div className="text-sm font-medium mb-2">{title || 'Your title will appear here'}</div>
                                <div className="text-xs mb-3">{description || 'Your description will appear here'}</div>
                                
                                <div className="aspect-video bg-gray-300 rounded flex items-center justify-center">
                                  {mediaFiles.length > 0 ? (
                                    mediaFiles[0].type.startsWith('image/') ? (
                                      <img
                                        src={URL.createObjectURL(mediaFiles[0])}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="text-xs text-gray-600">Video Preview</div>
                                    )
                                  ) : (
                                    <div className="text-xs text-gray-600">Media Preview</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {selectedPlatforms.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    Select at least one platform to see preview
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save as Draft
          </button>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => activeTab === 'preview' ? setActiveTab('scheduling') : setActiveTab('preview')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {activeTab === 'preview' ? 'Previous' : 'Preview'}
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || selectedPlatforms.length === 0 || !title || mediaFiles.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : scheduleOption === 'now' ? (
                'Publish Now'
              ) : (
                'Schedule Post'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
