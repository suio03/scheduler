import React from 'react'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

const accountStats = [
  { name: 'Followers', value: '45.2K', change: '-0.5%', increasing: false },
  { name: 'Engagement Rate', value: '3.8%', change: '+0.3%', increasing: true },
  { name: 'Average Views', value: '28.3K', change: '+12.7%', increasing: true },
  { name: 'Completion Rate', value: '62%', change: '+5.4%', increasing: true },
]

export default function AccountOverview() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-linear-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-linear-900">Account Overview</h3>
        <button className="text-sm text-blue-600 hover:underline transition-linear">
          View Details
        </button>
      </div>
      
      <div className="space-y-4">
        {accountStats.map((stat) => (
          <div key={stat.name} className="flex items-center justify-between">
            <p className="text-sm text-linear-500">{stat.name}</p>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-linear-900">{stat.value}</p>
              <div className={`flex items-center text-xs ${
                stat.increasing 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {stat.increasing ? (
                  <ArrowUpIcon className="w-3 h-3 mr-0.5" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3 mr-0.5" />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-linear-200">
        <h4 className="text-sm font-medium text-linear-900 mb-4">Top Performing Hashtags</h4>
        <div className="flex flex-wrap gap-2">
          {['#trending', '#fyp', '#viral', '#tutorial', '#newproduct'].map((tag) => (
            <span 
              key={tag} 
              className="px-3 py-1 bg-linear-50 text-linear-500 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-linear-200">
        <h4 className="text-sm font-medium text-linear-900 mb-4">Audience Demographics</h4>
        <div className="flex items-center">
          <div className="w-full bg-linear-100 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <span className="ml-2 text-xs text-linear-500">18-24</span>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-full bg-linear-100 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
          </div>
          <span className="ml-2 text-xs text-linear-500">25-34</span>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-full bg-linear-100 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
          </div>
          <span className="ml-2 text-xs text-linear-500">35+</span>
        </div>
      </div>
    </div>
  )
}
