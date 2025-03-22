/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useTranslations } from "next-intl"
import toast from "react-hot-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const ButtonAccount = () => {
    const session = useSession()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [credits, setCredits] = useState(0)
    const [freeCredits, setFreeCredits] = useState(0)
    const t = useTranslations('header')
    const user = session?.data?.user

    const handleSignOut = async () => {
        signOut({ callbackUrl: "/" })
    }
    const handleToMyMusic = async () => {
        window.location.href = "/my-music"
    }
    
    const handleBilling = async () => {
        setIsLoading(true)

        try {
            const response = await fetch('/api/stripe/create-portal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    returnUrl: window.location.href
                })
            })

            if (!response.ok) {
                const { error } = await response.json();
                toast.error(error)
                return
            }
            const { url } = await response.json();
            window.location.href = url
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/user')
                if (response.status === 200) {
                    const result = await response.json()
                    if (result?.user?.data) {
                        setCredits(result.user.data.credits || 0)
                        setFreeCredits(result.user.data.free || 0)
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }
        fetchUser()
    }, [])
    const getDisplayText = () => {
        if (credits > 0) {
            return `Credits: ${credits}`
        } else if (freeCredits > 0) {
            return `Credits: ${freeCredits}`
        }
        return session?.data?.user?.name || session?.data?.user?.email?.split('@')[0] || 'User'
    }
    if (session.status === "unauthenticated") return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border border-indigo-300 rounded-xl px-6">
                    {user?.image ? (
                        <img
                            src={user.image}
                            alt="Profile picture"
                            className="w-6 h-6 rounded-full shrink-0"
                            referrerPolicy="no-referrer"
                            width={24}
                            height={24}
                        />
                    ) : (
                        <span className="w-8 h-8 bg-base-100 flex justify-center items-center rounded-full shrink-0 capitalize">
                            {session?.data?.user?.name?.charAt(0) ||
                                session?.data?.user?.email?.charAt(0)}
                        </span>
                    )}
                    <p className="text-xs text-indigo-400">
                        {getDisplayText()}
                    </p>
                    {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 opacity-50"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-full rounded-xl bg-gray-900">
                <DropdownMenuItem onClick={handleToMyMusic} className="cursor-pointer text-indigo-400 hover:text-indigo-500 rounded-xl focus:bg-indigo-500 focus:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                    {t('library')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBilling} className="cursor-pointer text-indigo-400 hover:text-indigo-500 rounded-xl focus:bg-indigo-500 focus:text-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {t('billing')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 rounded-xl">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                            clipRule="evenodd"
                        />
                        <path
                            fillRule="evenodd"
                            d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {t('logout')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ButtonAccount
