import React from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'

export const metadata = {
    title: 'Social Media Scheduler Dashboard',
    description: 'Manage your TikTok content with ease',
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <main className="flex-1 overflow-auto p-6 hide-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    )
}
