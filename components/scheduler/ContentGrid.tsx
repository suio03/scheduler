'use client'
import React, { useState } from 'react'
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline'

const contentItems = [
  {
    id: 1,
    title: "New Product Launch Video #trending",
    description: "Introducing our latest product with key features and benefits",
    thumbnail: "/placeholder-1.jpg",
    platform: "tiktok",
    status: "scheduled",
    scheduledFor: "2025-03-16T10:00:00",
    engagement: {
      views: 0,
      likes: 0,
      comments: 0
    }
  },
  {
    id: 2,
    title: "Behind the scenes with the team",
    description: "A day in the life at our office, showing our team culture",
    thumbnail: "/placeholder-2.jpg",
    platform: "instagram",
    status: "published",
    scheduledFor: "2025-03-14T14:30:00",
    engagement: {
      views: 1250,
      likes: 328,
      comments: 42
    }
  },
  {
    id: 3,
    title: "Tutorial: How to use our new features",
    description: "Step-by-step guide for getting the most out of our product",
    thumbnail: "/placeholder-3.jpg",
    platform: "tiktok",
    status: "draft",
    scheduledFor: null,
    engagement: {
      views: 0,
      likes: 0,
      comments: 0
    }
  },
  {
    id: 4,
    title: "Customer testimonial compilation",
    description: "Real customers sharing their experiences with our products",
    thumbnail: "/placeholder-4.jpg",
    platform: "facebook",
    status: "scheduled",
    scheduledFor: "2025-03-18T13:15:00",
    engagement: {
      views: 0,
      likes: 0,
      comments: 0
    }
  },
  {
    id: 5,
    title: "Product comparison video",
    description: "Comparing our product to competitors and highlighting advantages",
    thumbnail: "/placeholder-5.jpg",
    platform: "youtube",
    status: "published",
    scheduledFor: "2025-03-10T09:00:00",
    engagement: {
      views: 3287,
      likes: 412,
      comments: 89
    }
  },
  {
    id: 6,
    title: "Upcoming event announcement",
    description: "Details about our upcoming virtual meetup event",
    thumbnail: "/placeholder-6.jpg",
    platform: "instagram",
    status: "scheduled",
    scheduledFor: "2025-03-19T15:45:00",
    engagement: {
      views: 0,
      likes: 0,
      comments: 0
    }
  }
]

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not scheduled"
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime = (dateString: string | null) => {
  if (!dateString) return ""
  
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getPlatformStyles = (platform: string) => {
  switch (platform) {
    case 'tiktok':
      return {
        bg: 'bg-red-50',
        border: 'border-red-500',
        text: 'text-red-600'
      }
    case 'instagram':
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-500',
        text: 'text-purple-600'
      }
    case 'facebook':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-600'
      }
    case 'youtube':
      return {
        bg: 'bg-red-50',
        border: 'border-red-700',
        text: 'text-red-700'
      }
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-500',
        text: 'text-gray-600'
      }
  }
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'published':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800'
      }
    case 'scheduled':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800'
      }
    case 'draft':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800'
      }
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800'
      }
  }
}

export default function ContentGrid() {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle item selection
  const toggleItemSelection = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  // Handle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(contentItems.map(item => item.id))
    }
    setSelectAll(!selectAll)
  }

  // Show bulk actions when items are selected
  React.useEffect(() => {
    setShowBulkActions(selectedItems.length > 0)
  }, [selectedItems])

  // Bulk delete items
  const bulkDeleteItems = () => {
    setIsDeleting(true)
    // Simulate API call for deletion
    setTimeout(() => {
      // In a real app, you would delete these items from your database
      setIsDeleting(false)
      setSelectedItems([])
      setSelectAll(false)
    }, 1000)
  }

  // Bulk reschedule items (placeholder function)
  const bulkRescheduleItems = () => {
    // This would open a modal/dialogue in a real app
    alert(`Rescheduling ${selectedItems.length} items`)
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Content</h2>
          
          {showBulkActions && (
            <div className="ml-4 flex items-center space-x-2">
              <span className="text-sm text-gray-500">{selectedItems.length} selected</span>
              <button 
                onClick={bulkRescheduleItems}
                className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                Reschedule
              </button>
              <button 
                onClick={bulkDeleteItems}
                disabled={isDeleting}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <input
              id="select-all"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            <label htmlFor="select-all" className="ml-2 text-sm text-gray-500">
              Select all
            </label>
          </div>
          <span className="text-sm text-gray-500">Showing {contentItems.length} items</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentItems.map((item) => {
          const platformStyles = getPlatformStyles(item.platform)
          const statusStyles = getStatusStyles(item.status)
          
          return (
            <div 
              key={item.id} 
              className={`bg-white rounded-lg border ${selectedItems.includes(item.id) ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group cursor-pointer`}
              >
              <div className="relative h-40 bg-gray-200 overflow-hidden">
                {/* Selection checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 uppercase font-medium">Thumbnail</span>
                </div>
                
                {/* Platform badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-md ${platformStyles.bg} ${platformStyles.text} text-xs font-medium border ${platformStyles.border} capitalize`}>
                  {item.platform}
                </div>
                
                {/* Status badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-md ${statusStyles.bg} ${statusStyles.text} text-xs font-medium capitalize`}>
                  {item.status}
                </div>
                
                {/* Action buttons that appear on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-2">
                    <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200">
                      <PencilIcon className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200">
                      <TrashIcon className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div 
                className="p-4"
                onClick={() => toggleItemSelection(item.id)}
              >
                <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {item.status === 'published' ? (
                    <div className="flex justify-between text-sm">
                      <div className="text-gray-500">Views</div>
                      <div className="font-medium text-gray-900">{item.engagement.views.toLocaleString()}</div>
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-gray-500">
                      {item.scheduledFor ? (
                        <>
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <span>{formatDate(item.scheduledFor)}</span>
                          <ClockIcon className="w-4 h-4 ml-3 mr-1" />
                          <span>{formatTime(item.scheduledFor)}</span>
                        </>
                      ) : (
                        <span className="italic">Not scheduled yet</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
