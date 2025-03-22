import React from 'react'
import { 
  CalendarIcon, 
  VideoCameraIcon, 
  ArrowTrendingUpIcon, 
  BellAlertIcon 
} from '@heroicons/react/24/outline'

const activities = [
  {
    id: 1,
    action: 'Post published',
    description: 'Morning routine video was published successfully',
    time: '2 hours ago',
    icon: VideoCameraIcon,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    id: 2,
    action: 'New follower spike',
    description: 'You gained 124 new followers in the last hour',
    time: '3 hours ago',
    icon: ArrowTrendingUpIcon,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 3,
    action: 'Post scheduled',
    description: 'New tutorial scheduled for tomorrow at 10:15 AM',
    time: '5 hours ago',
    icon: CalendarIcon,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    id: 4,
    action: 'Algorithm change',
    description: 'TikTok updated their algorithm, check news',
    time: '1 day ago',
    icon: BellAlertIcon,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
]

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-linear-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-linear-900">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:underline transition-linear">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start">
            <div className={`${activity.iconBg} ${activity.iconColor} p-2 rounded-md mt-0.5`}>
              <activity.icon className="w-4 h-4" />
            </div>
            
            <div className="ml-4 flex-1 min-w-0">
              <p className="text-sm font-medium text-linear-900">{activity.action}</p>
              <p className="text-xs text-linear-500 mt-0.5">{activity.description}</p>
              <p className="text-xs text-linear-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-linear-500 hover:text-linear-900 border border-dashed border-linear-300 rounded-md transition-linear hover:border-linear-500">
        Show More
      </button>
    </div>
  )
}
