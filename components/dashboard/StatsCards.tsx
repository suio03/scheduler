import React from 'react'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import { 
  ChartBarIcon, 
  ClockIcon, 
  VideoCameraIcon, 
  UserIcon 
} from '@heroicons/react/24/outline'

const stats = [
  {
    name: 'Total Views',
    value: '1.2M',
    change: '+12.3%',
    increasing: true,
    icon: ChartBarIcon,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    name: 'Scheduled Posts',
    value: '18',
    change: '+4',
    increasing: true,
    icon: ClockIcon,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    name: 'Total Content',
    value: '124',
    change: '+8',
    increasing: true,
    icon: VideoCameraIcon,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    name: 'Followers',
    value: '45.2K',
    change: '-0.5%',
    increasing: false,
    icon: UserIcon,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div 
          key={stat.name} 
          className="bg-white rounded-lg p-6 shadow-linear-sm hover:shadow-linear-md transition-linear hover-zoom"
        >
          <div className="flex items-center">
            <div className={`${stat.iconBg} ${stat.iconColor} p-3 rounded-md`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm font-medium text-linear-500">{stat.name}</p>
              <p className="text-2xl font-semibold text-linear-900">{stat.value}</p>
              <div className={`inline-flex items-center text-sm ${
                stat.increasing 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {stat.increasing ? (
                  <ArrowUpIcon className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3 mr-1" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
