import React from 'react'
import { CalendarIcon, ClockIcon, PencilIcon } from '@heroicons/react/24/outline'

const upcomingPosts = [
  {
    id: 1,
    thumbnail: '/placeholder-1.jpg',
    title: 'New product teaser video #trending',
    scheduledFor: '2025-03-16T09:00:00',
    status: 'scheduled',
  },
  {
    id: 2,
    thumbnail: '/placeholder-2.jpg',
    title: 'Behind the scenes footage with team',
    scheduledFor: '2025-03-17T12:30:00',
    status: 'scheduled',
  },
  {
    id: 3,
    thumbnail: '/placeholder-3.jpg',
    title: 'Q&A session answering top questions',
    scheduledFor: '2025-03-18T15:45:00',
    status: 'scheduled',
  },
  {
    id: 4,
    thumbnail: '/placeholder-4.jpg',
    title: 'Tutorial: How to use our new features',
    scheduledFor: '2025-03-19T10:15:00',
    status: 'draft',
  },
]

export default function UpcomingPosts() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-linear-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-linear-900">Upcoming Posts</h3>
        <button className="text-sm text-blue-600 hover:underline transition-linear">
          View Calendar
        </button>
      </div>
      
      <div className="space-y-4">
        {upcomingPosts.map((post) => (
          <div 
            key={post.id} 
            className={`flex items-center p-4 rounded-md transition-linear hover-zoom border 
            ${post.status === 'scheduled' 
              ? 'border-linear-200' 
              : 'border-orange-200 bg-orange-50'}
            `}
          >
            <div className="w-12 h-12 bg-linear-200 rounded overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs">
                TikTok
              </div>
            </div>
            
            <div className="ml-4 flex-1 min-w-0">
              <p className="text-sm font-medium text-linear-900 truncate">{post.title}</p>
              <div className="flex items-center mt-1 text-xs text-linear-500">
                <CalendarIcon className="w-3 h-3 mr-1" />
                <span>{formatDate(post.scheduledFor)}</span>
                <ClockIcon className="w-3 h-3 ml-3 mr-1" />
                <span>{formatTime(post.scheduledFor)}</span>
                {post.status === 'draft' && (
                  <span className="ml-3 px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full">
                    Draft
                  </span>
                )}
              </div>
            </div>
            
            <div className="ml-4 flex space-x-2">
              <button className="p-2 text-linear-500 hover:text-linear-900 transition-linear hover-zoom">
                <PencilIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-linear-500 hover:text-linear-900 border border-dashed border-linear-300 rounded-md transition-linear hover:border-linear-500">
        + Add New Post
      </button>
    </div>
  )
}
