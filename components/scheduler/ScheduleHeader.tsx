import React from 'react'
import Link from 'next/link'
import { PlusIcon, CalendarIcon, TableCellsIcon } from '@heroicons/react/24/outline'

export default function ScheduleHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Content Scheduler</h1>
        <p className="text-sm text-gray-500 mt-1">
          Plan, schedule, and manage your content across platforms
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
          <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-800 border-r border-gray-200">
            <CalendarIcon className="w-5 h-5 mr-2" />
            <span>Calendar</span>
          </button>
          <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50">
            <TableCellsIcon className="w-5 h-5 mr-2" />
            <span>List</span>
          </button>
        </div>
        
        <Link href="/dashboard/create" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
          <PlusIcon className="w-5 h-5 mr-2" />
          <span>Create Post</span>
        </Link>
      </div>
    </div>
  )
}
