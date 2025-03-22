import React from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from 'recharts'

// Sample data for the charts
const performanceData = [
  { date: 'Mar 01', views: 4200, likes: 315, comments: 94, shares: 28 },
  { date: 'Mar 05', views: 3800, likes: 287, comments: 76, shares: 31 },
  { date: 'Mar 10', views: 6500, likes: 489, comments: 134, shares: 56 },
  { date: 'Mar 15', views: 8900, likes: 675, comments: 189, shares: 67 },
  { date: 'Mar 20', views: 7400, likes: 562, comments: 168, shares: 49 },
  { date: 'Mar 25', views: 9800, likes: 742, comments: 207, shares: 85 },
  { date: 'Mar 30', views: 12600, likes: 968, comments: 276, shares: 104 },
]

// Sample data for engagement rate by platform
const engagementData = [
  { platform: 'TikTok', rate: 5.8 },
  { platform: 'Instagram', rate: 3.2 },
  { platform: 'Facebook', rate: 1.9 },
  { platform: 'YouTube', rate: 4.5 },
]

export default function PerformanceOverview() {
  const metrics = [
    { name: 'Total Views', value: '52.4K', change: '+28.6%', increasing: true },
    { name: 'Total Likes', value: '4,038', change: '+32.1%', increasing: true },
    { name: 'Comments', value: '1,144', change: '+18.7%', increasing: true },
    { name: 'Shares', value: '420', change: '+45.2%', increasing: true },
  ]

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Performance Overview</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-200">
            Views
          </button>
          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
            Engagement
          </button>
          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition duration-200">
            Growth
          </button>
        </div>
      </div>
      
      {/* Key metrics summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">{metric.name}</p>
            <p className="text-xl font-semibold text-gray-900 mt-1">{metric.value}</p>
            <div className={`text-sm mt-1 ${metric.increasing ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>
      
      {/* Main performance chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={performanceData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E9E9EB" />
            <XAxis 
              dataKey="date" 
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
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.2}
            />
            <Area 
              type="monotone" 
              dataKey="likes" 
              stroke="#82ca9d" 
              fill="#82ca9d" 
              fillOpacity={0.2}
            />
            <Area 
              type="monotone" 
              dataKey="comments" 
              stroke="#ffc658" 
              fill="#ffc658" 
              fillOpacity={0.2}
            />
            <Area 
              type="monotone" 
              dataKey="shares" 
              stroke="#ff8042" 
              fill="#ff8042" 
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Engagement rate by platform */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Engagement Rate by Platform</h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={engagementData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E9E9EB" />
              <XAxis dataKey="platform" tick={{ fill: '#7C7C7E' }} />
              <YAxis 
                tick={{ fill: '#7C7C7E' }} 
                axisLine={{ stroke: '#E9E9EB' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, "Engagement Rate"]}
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: '#D1D1D3',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar dataKey="rate" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
