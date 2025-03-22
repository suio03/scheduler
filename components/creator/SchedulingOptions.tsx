'use client'
import React, { useState } from 'react'
import { CalendarDaysIcon, ClockIcon, GlobeAltIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export default function SchedulingOptions() {
  const [scheduleType, setScheduleType] = useState('now')
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Scheduling Options</h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="schedule-type" 
                value="now" 
                checked={scheduleType === 'now'}
                onChange={() => setScheduleType('now')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
              />
              <span className="ml-2 text-sm text-gray-700">Post now</span>
            </label>
            
            <label className="flex items-center">
              <input 
                type="radio" 
                name="schedule-type" 
                value="schedule" 
                checked={scheduleType === 'schedule'}
                onChange={() => setScheduleType('schedule')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
              />
              <span className="ml-2 text-sm text-gray-700">Schedule for later</span>
            </label>
            
            <label className="flex items-center">
              <input 
                type="radio" 
                name="schedule-type" 
                value="optimal" 
                checked={scheduleType === 'optimal'}
                onChange={() => setScheduleType('optimal')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
              />
              <span className="ml-2 text-sm text-gray-700">Optimal time</span>
            </label>
          </div>
          
          {scheduleType === 'optimal' && (
            <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-start">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700">
                  Our AI will analyze your audience activity patterns and post at the optimal time for maximum engagement.
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Recommended time: <strong>Tuesday at 6:00 PM</strong>
                </p>
              </div>
            </div>
          )}
          
          {scheduleType === 'schedule' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="date" 
                    className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="time" 
                    className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <GlobeAltIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none">
                <option>Pacific Time (UTC-8)</option>
                <option>Eastern Time (UTC-5)</option>
                <option>Central European Time (UTC+1)</option>
                <option>Japan Standard Time (UTC+9)</option>
                <option>Australian Eastern Time (UTC+10)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <input 
                id="auto-tag" 
                type="checkbox" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="auto-tag" className="ml-2 text-sm text-gray-700">
                Auto-generate hashtags based on content
              </label>
            </div>
            
            <div className="mt-3 flex items-center">
              <input 
                id="auto-caption" 
                type="checkbox" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="auto-caption" className="ml-2 text-sm text-gray-700">
                Suggest caption improvements for better engagement
              </label>
            </div>
            
            <div className="mt-3 flex items-center">
              <input 
                id="cross-post" 
                type="checkbox" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="cross-post" className="ml-2 text-sm text-gray-700">
                Cross-post to other platforms
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
