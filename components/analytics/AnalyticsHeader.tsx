import React from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default function AnalyticsHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Monitor performance and track engagement across your content
                </p>
            </div>

            <div className="flex items-center gap-4">
                <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="7days">Last 7 days</option>
                    <option value="30days" selected>Last 30 days</option>
                    <option value="90days">Last 90 days</option>
                    <option value="12months">Last 12 months</option>
                    <option value="custom">Custom range</option>
                </select>

                <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                    <span>Export</span>
                </button>
            </div>
        </div>
    )
}
