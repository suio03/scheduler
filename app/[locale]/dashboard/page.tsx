import React from 'react'
import StatsCards from '@/components/dashboard/StatsCards'
import UpcomingPosts from '@/components/dashboard/UpcomingPosts'
import PerformanceGraph from '@/components/dashboard/PerformanceGraph'
import AccountOverview from '@/components/dashboard/AccountOverview'
import RecentActivity from '@/components/dashboard/RecentActivity'

export default function Dashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-linear-900">Dashboard</h1>
            </div>

            <StatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <PerformanceGraph />
                    <UpcomingPosts />
                </div>
                <div className="space-y-6">
                    <AccountOverview />
                    <RecentActivity />
                </div>
            </div>
        </div>
    )
}
