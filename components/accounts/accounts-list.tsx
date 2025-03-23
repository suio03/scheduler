"use client"

import { useState, useEffect, ReactNode } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrashIcon, PersonIcon, PlusIcon } from "@radix-ui/react-icons"
import { toast } from "react-hot-toast"
import { ConnectProviderButton, SocialProvider } from "./connect-provider-button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"

interface PlatformAccount {
    id: string
    platformType: string
    accountName: string
    platformAccountId: string
    metadata?: {
        displayName?: string
        avatarUrl?: string
        openId?: string
        bioDescription?: string
        followerCount?: number
        followingCount?: number
        likesCount?: number
        videoCount?: number
        isLoggedOut?: boolean
        thumbnailUrl?: string
        description?: string
        subscriberCount?: number
        [key: string]: any
    }
}

interface AccountsListProps {
    fallback: ReactNode
}

export function AccountsList({ fallback }: AccountsListProps) {
    const t = useTranslations("Accounts")
    const [accounts, setAccounts] = useState<PlatformAccount[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const providers: SocialProvider[] = ["TikTok", "Youtube", "Instagram", "Facebook", "X"]

    useEffect(() => {
        async function fetchAccounts() {
            try {
                const response = await fetch("/api/platform-accounts", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch accounts")
                }

                const data = await response.json()
                setAccounts(data.accounts || [])
            } catch (error) {
                console.error("Error fetching accounts:", error)
                toast.error(t("fetchError"))
            } finally {
                setIsLoading(false)
            }
        }

        fetchAccounts()
    }, [t])

    const handleDisconnect = async (accountId: string, platformType: string) => {
        try {
            const response = await fetch("/api/platform-accounts", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId, platformType }),
            })

            if (!response.ok) {
                throw new Error("Failed to disconnect account")
            }

            setAccounts(accounts.filter(account => account.id !== accountId))
            toast.success(t("disconnectSuccess"))
        } catch (error) {
            console.error("Error disconnecting account:", error)
            toast.error(t("disconnectError"))
        }
    }

    // Group accounts by platform type
    const groupedAccounts = accounts.reduce((acc, account) => {
        const platformType = account.platformType.toUpperCase()
        if (!acc[platformType]) {
            acc[platformType] = []
        }
        acc[platformType].push(account)
        return acc
    }, {} as Record<string, PlatformAccount[]>)

    // Get the list of platforms that have accounts
    const platformsWithAccounts = Object.keys(groupedAccounts)

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden border border-border/40">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-3">
                                <Skeleton className="h-16 w-full mt-2" />
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-full" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-9 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (accounts.length === 0) {
        return fallback
    }

    const renderAccountCard = (account: PlatformAccount) => (
        <Card key={account.id} className="overflow-hidden border border-border/40 transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                    {account.metadata?.avatarUrl || account.metadata?.thumbnailUrl ? (
                        <img
                            src={account.metadata.avatarUrl || account.metadata.thumbnailUrl}
                            alt={account.metadata?.displayName || account.accountName}
                            className="w-12 h-12 rounded-full object-cover border border-border/30"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <PersonIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                    )}
                    <div>
                        <CardTitle className="text-base">
                            <a href={account.metadata?.profileDeepLink || ""} target="_blank" rel="noopener noreferrer">
                                {account.metadata?.displayName || account.accountName}
                            </a>
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                {account.metadata && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {account.metadata.bioDescription || account.metadata.description}
                    </p>
                )}
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-muted/40 p-2 rounded-md">
                        <p className="text-xs text-muted-foreground">Followers</p>
                        <p className="font-medium">{account.metadata?.followerCount?.toLocaleString() || account.metadata?.subscriberCount?.toLocaleString() || 0}</p>
                    </div>
                    <div className="bg-muted/40 p-2 rounded-md">
                        <p className="text-xs text-muted-foreground">Videos</p>
                        <p className="font-medium">{account.metadata?.videoCount?.toLocaleString() || 0}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                <div className="w-full">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDisconnect(account.id, account.platformType)}
                        className="w-full gap-1 hover:bg-destructive/90"
                    >
                        <TrashIcon className="h-4 w-4" />
                        {t("disconnect")}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="sm" className="gap-1">
                            <PlusIcon className="h-4 w-4" />
                            {t("connectedAccounts")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <div className="p-2 flex flex-col gap-1">
                            <p className="px-2 py-1 text-sm font-medium text-muted-foreground">
                                {t("selectProvider")}
                            </p>
                            {providers.map((provider) => (
                                <ConnectProviderButton
                                    key={provider}
                                    provider={provider}
                                    onSuccess={(newAccount) => {
                                        setAccounts([...accounts, newAccount])
                                    }}
                                />
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-8">
                {platformsWithAccounts.map(platform => (
                    <div key={platform} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold">{platform}</h2>
                            <div className="h-px flex-1 bg-border"></div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {groupedAccounts[platform].map(renderAccountCard)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 