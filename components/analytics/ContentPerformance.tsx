import React from 'react'
import { ArrowUpIcon, ArrowDownIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'

// Sample content performance data
const contentData = [
  {
    id: 1,
    title: "New product reveal video #trending",
    date: "Mar 28, 2025",
    platform: "tiktok",
    thumbnail: "/placeholder-1.jpg",
    metrics: {
      views: 24600,
      likes: 2340,
      comments: 345,
      shares: 128,
      engagement: 11.4
    },
    trending: true
  },
  {
    id: 2,
    title: "Behind the scenes with the team",
    date: "Mar 23, 2025",
    platform: "instagram",
    thumbnail: "/placeholder-2.jpg",
    metrics: {
      views: 18300,
      likes: 1560,
      comments: 212,
      shares: 76,
      engagement: 10.1
    },
    trending: false
  },
  {
    id: 3,
    title: "Q&A Session: Answering your questions",
    date: "Mar 19, 2025",
    platform: "youtube",
    thumbnail: "/placeholder-3.jpg",
    metrics: {
      views: 12800,
      likes: 875,
      comments: 184,
      shares: 35,
      engagement: 8.5
    },
    trending: false
  },
  {
    id: 4,
    title: "Tutorial: How to use our new features",
    date: "Mar 15, 2025",
    platform: "tiktok",
    thumbnail: "/placeholder-4.jpg",
    metrics: {
      views: 32500,
      likes: 3120,
      comments: 412,
      shares: 184,
      engagement: 11.4
    },
    trending: true
  },
  {
    id: 5,
    title: "Customer testimonial compilation",
    date: "Mar 10, 2025",
    platform: "facebook",
    thumbnail: "/placeholder-5.jpg",
    metrics: {
      views: 8700,
      likes: 546,
      comments: 73,
      shares: 42,
      engagement: 7.6
    },
    trending: false
  }
]

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

export default function ContentPerformance() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Content Performance</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 transition duration-200">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-3 font-medium text-gray-500 text-sm">Content</th>
              <th className="pb-3 font-medium text-gray-500 text-sm">Date</th>
              <th className="pb-3 font-medium text-gray-500 text-sm">Views</th>
              <th className="pb-3 font-medium text-gray-500 text-sm">Likes</th>
              <th className="pb-3 font-medium text-gray-500 text-sm">Comments</th>
              <th className="pb-3 font-medium text-gray-500 text-sm">Shares</th>
              <th className="pb-3 font-medium text-gray-500 text-sm text-right">Engagement</th>
              <th className="pb-3 font-medium text-gray-500 text-sm"></th>
            </tr>
          </thead>
          <tbody>
            {contentData.map((content) => {
              const platformStyles = getPlatformStyles(content.platform)
              
              return (
                <tr key={content.id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150">
                  <td className="py-4 pr-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <div className={`w-full h-full ${platformStyles.border} border-l-4 flex items-center justify-center ${platformStyles.bg} ${platformStyles.text}`}>
                          {content.platform.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-3 flex flex-col">
                        <span className="font-medium text-gray-900 text-sm">{content.title}</span>
                        <span className={`text-xs ${platformStyles.text} capitalize mt-1`}>{content.platform}</span>
                      </div>
                      {content.trending && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                          Trending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-500">{content.date}</td>
                  <td className="py-4 text-sm font-medium text-gray-900">{content.metrics.views.toLocaleString()}</td>
                  <td className="py-4 text-sm text-gray-500">{content.metrics.likes.toLocaleString()}</td>
                  <td className="py-4 text-sm text-gray-500">{content.metrics.comments.toLocaleString()}</td>
                  <td className="py-4 text-sm text-gray-500">{content.metrics.shares.toLocaleString()}</td>
                  <td className="py-4 text-sm font-medium text-right">
                    <span className={`px-2 py-1 rounded-full ${
                      content.metrics.engagement > 10 
                        ? 'bg-green-100 text-green-800' 
                        : content.metrics.engagement > 7 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {content.metrics.engagement}%
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-gray-400 hover:text-gray-700">
                      <EllipsisHorizontalIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing 5 of 42 content items
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 transition duration-200">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition duration-200">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
