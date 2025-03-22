'use client'

import React, { useState } from 'react'
import { HashtagIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline'

// Mock data for trending hashtags
const trendingHashtags = [
  { tag: 'trending', count: '12.5M posts' },
  { tag: 'fyp', count: '245M posts' },
  { tag: 'viral', count: '89.2M posts' },
  { tag: 'foryoupage', count: '158M posts' },
  { tag: 'tiktok', count: '176M posts' },
  { tag: 'dance', count: '45.8M posts' },
  { tag: 'funny', count: '63.1M posts' },
  { tag: 'comedy', count: '37.9M posts' }
]

// Mock data for niche hashtags
const nicheHashtags = [
  { tag: 'smallbusiness', count: '5.2M posts' },
  { tag: 'entrepreneur', count: '8.7M posts' },
  { tag: 'startup', count: '3.1M posts' },
  { tag: 'productlaunch', count: '1.8M posts' },
  { tag: 'socialmedia', count: '9.3M posts' },
  { tag: 'marketing', count: '7.6M posts' }
]

export default function HashtagSelector() {
  const [selectedTags, setSelectedTags] = useState<string[]>(['trending', 'fyp', 'viral'])
  const [inputValue, setInputValue] = useState('')
  
  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 30) {
      setSelectedTags([...selectedTags, tag])
    }
  }
  
  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Add tag when pressing enter or space
    if ((e.key === 'Enter' || e.key === ' ') && inputValue.trim()) {
      e.preventDefault()
      const newTag = inputValue.trim().replace(/^#/, '')
      handleAddTag(newTag)
      setInputValue('')
    }
  }

  const generateAITags = () => {
    // Mock AI-generated tags based on content
    const aiTags = ['contentcreator', 'creator', 'howto', 'tutorial', 'tips']
    
    // Add a few AI tags that don't already exist in selectedTags
    aiTags.forEach(tag => {
      if (!selectedTags.includes(tag) && selectedTags.length < 30) {
        handleAddTag(tag)
      }
    })
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700">Hashtags</label>
        <span className="text-xs text-gray-500">{selectedTags.length}/30</span>
      </div>
      
      {/* Tag input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <HashtagIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          id="hashtags" 
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add hashtags (press Enter or Space to add)" 
        />
      </div>
      
      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedTags.map(tag => (
            <span 
              key={tag} 
              className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
            >
              #{tag}
              <button 
                onClick={() => handleRemoveTag(tag)} 
                className="ml-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      )}
      
      {/* AI generation button */}
      <button 
        onClick={generateAITags}
        className="mt-3 inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <SparklesIcon className="h-4 w-4 mr-1" />
        Generate with AI
      </button>
      
      {/* Trending hashtags section */}
      <div className="mt-4">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Trending Hashtags
        </h4>
        <div className="flex flex-wrap gap-2">
          {trendingHashtags.map(({ tag, count }) => (
            <button 
              key={tag}
              onClick={() => handleAddTag(tag)}
              disabled={selectedTags.includes(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium group
                ${selectedTags.includes(tag) 
                  ? 'bg-blue-100 text-blue-700 cursor-default' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
            >
              #{tag}
              <span className="ml-1 text-gray-400 group-hover:text-gray-500 text-[10px]">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Niche hashtags section */}
      <div className="mt-4">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Niche Hashtags
        </h4>
        <div className="flex flex-wrap gap-2">
          {nicheHashtags.map(({ tag, count }) => (
            <button 
              key={tag}
              onClick={() => handleAddTag(tag)}
              disabled={selectedTags.includes(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium group
                ${selectedTags.includes(tag) 
                  ? 'bg-blue-100 text-blue-700 cursor-default' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
            >
              #{tag}
              <span className="ml-1 text-gray-400 group-hover:text-gray-500 text-[10px]">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
