'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    HomeIcon,
    CalendarIcon,
    ChartBarIcon,
    PencilSquareIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline'

const navItems = [
    { name: 'Create Post', icon: PencilSquareIcon, href: '/dashboard/create', exact: false },
    { name: 'Dashboard', icon: HomeIcon, href: '/dashboard', exact: true },
    { name: 'Analytics', icon: ChartBarIcon, href: '/dashboard/analytics', exact: false },
    { name: 'Accounts', icon: UserGroupIcon, href: '/dashboard/accounts', exact: false },
    { name: 'Scheduler', icon: CalendarIcon, href: '/dashboard/schedule', exact: false },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 bg-white border-r border-linear-100 hidden md:flex flex-col h-screen">
            <nav className="flex-1 px-4 space-y-1 mt-16">
                {navItems.map((item) => {
                    // Check if the current path matches this nav item
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all
              ${isActive
                                    ? 'bg-indigo-50 text-linear-900 rounded-xl'
                                    : 'text-linear-500 hover:bg-linear-50 hover:text-linear-900 rounded-xl'
                                }`}
                        >
                            <item.icon
                                className={`flex-shrink-0 w-5 h-5 mr-3 ${isActive
                                        ? 'text-linear-900'
                                        : 'text-linear-400 group-hover:text-linear-900'
                                    }`}
                            />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-linear-100">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-linear-200 rounded-full flex items-center justify-center text-linear-900">
                        UL
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-linear-900">User Name</p>
                        <p className="text-xs text-linear-500">Free Plan</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
