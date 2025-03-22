import React from 'react'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Sample data for follower growth
const followerData = [
  { date: 'Mar 01', followers: 24500 },
  { date: 'Mar 05', followers: 25800 },
  { date: 'Mar 10', followers: 27200 },
  { date: 'Mar 15', followers: 29400 },
  { date: 'Mar 20', followers: 32100 },
  { date: 'Mar 25', followers: 35800 },
  { date: 'Mar 30', followers: 38200 },
]

export default function GrowthMetrics() {
  const growthStats = [
    { name: 'Total Followers', value: '38.2K', change: '+56.3%', increasing: true },
    { name: 'New Followers', value: '13.7K', change: '+123.8%', increasing: true },
    { name: 'Follower Growth Rate', value: '1.32%', change: '+0.4%', increasing: true },
    { name: 'Avg. Daily Growth', value: '457', change: '+28.5%', increasing: true },
  ]

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Growth Metrics</h2>
        <select className="text-sm bg-white border border-gray-200 rounded-md pl-3 pr-8 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer">
          <option value="followers">Followers</option>
          <option value="engagement">Engagement</option>
          <option value="reach">Reach</option>
        </select>
      </div>
      
      {/* Follower growth chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={followerData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E9E9EB" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#7C7C7E' }} 
              axisLine={{ stroke: '#E9E9EB' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#7C7C7E' }} 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              formatter={(value: number) => [value.toLocaleString(), "Followers"]}
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                borderColor: '#D1D1D3',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="followers" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Growth stats */}
      <div className="space-y-4">
        {growthStats.map((stat) => (
          <div key={stat.name} className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{stat.name}</p>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900">{stat.value}</p>
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
      
      {/* Projected growth */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Projected Growth</h3>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <div className="flex items-start">
            <div className="flex-1">
              <p className="text-sm text-blue-700">
                Based on your current growth rate, you'll reach:
              </p>
              <p className="text-sm font-medium text-blue-800 mt-1">
                50K followers by May 15, 2025
              </p>
              <p className="text-sm font-medium text-blue-800">
                100K followers by December 10, 2025
              </p>
            </div>
            <div className="ml-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-semibold">+11.8K</span>
              </div>
              <div className="text-center mt-1">
                <span className="text-xs text-blue-600">Next month</span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600">
            Maintaining your posting schedule and engagement rate is key to achieving these projections.
          </div>
        </div>
      </div>
    </div>
  )
}
