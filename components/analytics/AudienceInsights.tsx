import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

// Sample data for audience demographics
const ageData = [
  { name: '18-24', value: 42 },
  { name: '25-34', value: 28 },
  { name: '35-44', value: 18 },
  { name: '45+', value: 12 },
]

const genderData = [
  { name: 'Female', value: 58 },
  { name: 'Male', value: 39 },
  { name: 'Other', value: 3 },
]

const locationData = [
  { name: 'United States', value: 45 },
  { name: 'United Kingdom', value: 12 },
  { name: 'Canada', value: 8 },
  { name: 'Australia', value: 7 },
  { name: 'Germany', value: 6 },
  { name: 'Other', value: 22 },
]

// Colors for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#FF8042']

export default function AudienceInsights() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Audience Insights</h2>
        <select className="text-sm bg-white border border-gray-200 rounded-md pl-3 pr-8 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer">
          <option value="tiktok">TikTok</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="youtube">YouTube</option>
        </select>
      </div>
      
      {/* Age Demographics */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Age Demographics</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, "Percentage"]}
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: '#D1D1D3',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Gender Distribution */}
      <div className="mb-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Gender Distribution</h3>
        <div className="flex items-center space-x-4">
          {genderData.map((item, index) => (
            <div key={item.name} className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{item.name}</span>
                <span className="text-xs font-medium text-gray-700">{item.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${item.value}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Top Locations */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Top Locations</h3>
        <div className="space-y-3">
          {locationData.map((item, index) => (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">{item.name}</span>
                <span className="text-xs font-medium text-gray-700">{item.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${item.value}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Active Hours */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Best Time to Post</h3>
        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
          <p className="text-sm text-green-700">
            Your audience is most active during:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Monday 6-8 PM
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Wednesday 7-9 PM
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Saturday 11 AM-1 PM
            </span>
          </div>
          <button className="mt-2 text-xs text-green-700 hover:underline">
            Schedule posts for these times
          </button>
        </div>
      </div>
    </div>
  )
}
