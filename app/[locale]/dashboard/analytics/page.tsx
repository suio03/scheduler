'use client'
import React from 'react'
import PerformanceOverview from '@/components/analytics/PerformanceOverview'
import ContentPerformance from '@/components/analytics/ContentPerformance'
import AudienceInsights from '@/components/analytics/AudienceInsights'
import GrowthMetrics from '@/components/analytics/GrowthMetrics'
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader'
import AnalyticsFilters from '@/components/analytics/AnalyticsFilters'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <AnalyticsHeader />
      <AnalyticsFilters />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PerformanceOverview />
          <ContentPerformance />
        </div>
        <div className="space-y-6">
          <GrowthMetrics />
          <AudienceInsights />
        </div>
      </div>
    </div>
  )
}
