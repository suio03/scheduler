import React from 'react'
import ContentCalendar from '@/components/scheduler/ContentCalendar'
import ScheduleFilters from '@/components/scheduler/ScheduleFilters'
import ContentGrid from '@/components/scheduler/ContentGrid'
import ScheduleHeader from '@/components/scheduler/ScheduleHeader'

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <ScheduleHeader />
      <ScheduleFilters />
      <ContentCalendar />
      <ContentGrid />
    </div>
  )
}
