'use client'

import React from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts'

const data = [
  { name: 'Jan', views: 1000, likes: 400, comments: 240 },
  { name: 'Feb', views: 1200, likes: 480, comments: 320 },
  { name: 'Mar', views: 1500, likes: 620, comments: 380 },
  { name: 'Apr', views: 1800, likes: 780, comments: 420 },
  { name: 'May', views: 2200, likes: 950, comments: 520 },
  { name: 'Jun', views: 2800, likes: 1200, comments: 680 },
  { name: 'Jul', views: 3300, likes: 1500, comments: 820 },
]

export default function PerformanceGraph() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-linear-sm h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-linear-900">Performance Overview</h3>
        <div className="flex space-x-2">
          <select className="bg-linear-50 text-linear-900 border border-linear-200 rounded-xl w-36 text-sm px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-linear-300 transition-linear">
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year" selected>Last 6 months</option>
          </select>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E9E9EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#7C7C7E' }} 
            axisLine={{ stroke: '#E9E9EB' }}
          />
          <YAxis 
            tick={{ fill: '#7C7C7E' }} 
            axisLine={{ stroke: '#E9E9EB' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              borderColor: '#D1D1D3',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="views" 
            stackId="1" 
            stroke="#4F46E5" 
            fill="#4F46E5" 
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="likes" 
            stackId="2" 
            stroke="#3B82F6" 
            fill="#3B82F6" 
            fillOpacity={0.6}
          />
          <Area 
            type="monotone" 
            dataKey="comments" 
            stackId="3" 
            stroke="#0EA5E9" 
            fill="#0EA5E9" 
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
