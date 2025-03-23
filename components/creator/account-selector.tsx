// app/dashboard/create-post/AccountSelector.tsx
"use client"

import { useState } from 'react'
import { Check, User, ChevronDown, ChevronUp } from 'lucide-react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { PLATFORMS, Account, PlatformType, getAccountsByPlatform } from '@/types/create-post'

interface AccountSelectorProps {
    selectedAccounts: Account[]
    onChange: (accounts: Account[]) => void
}

const AccountSelector = ({ selectedAccounts, onChange }: AccountSelectorProps) => {
    // Group accounts by platform
    const accountsByPlatform = getAccountsByPlatform()

    // Track which platform cards are expanded
    const [expandedPlatforms, setExpandedPlatforms] = useState<PlatformType[]>(
        Object.keys(accountsByPlatform).length > 0
            ? [Object.keys(accountsByPlatform)[0] as PlatformType]
            : []
    )

    const togglePlatformExpanded = (platformId: PlatformType) => {
        setExpandedPlatforms(prev =>
            prev.includes(platformId)
                ? prev.filter(id => id !== platformId)
                : [...prev, platformId]
        )
    }

    const handleToggleAccount = (account: Account) => {
        const isSelected = selectedAccounts.some(a => a.id === account.id)

        if (isSelected) {
            onChange(selectedAccounts.filter(a => a.id !== account.id))
        } else {
            onChange([...selectedAccounts, account])
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">Select Accounts</h2>
                <p className="text-sm text-gray-500 mt-1">Choose which accounts to post to</p>
            </div>

            <div className="space-y-4">
                {PLATFORMS.map(platform => {
                    const accounts = accountsByPlatform[platform.id] || []
                    if (accounts.length === 0) return null

                    const isExpanded = expandedPlatforms.includes(platform.id)
                    const selectedAccountsForPlatform = selectedAccounts.filter(
                        account => account.platformType === platform.id
                    )

                    return (
                        <Collapsible
                            key={platform.id}
                            open={isExpanded}
                            onOpenChange={() => togglePlatformExpanded(platform.id)}
                            className="border rounded-lg overflow-hidden"
                        >
                            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
                                <div className="flex items-center">
                                    <div
                                        className="flex items-center justify-center w-10 h-10 rounded-md mr-3"
                                        style={{ backgroundColor: `${platform.color}20` }}
                                    >
                                        <img src={platform.icon} alt={platform.name} className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{platform.name}</h3>
                                        <p className="text-xs text-gray-500">
                                            {accounts.length} account{accounts.length !== 1 ? 's' : ''}
                                            {selectedAccountsForPlatform.length > 0 &&
                                                ` (${selectedAccountsForPlatform.length} selected)`
                                            }
                                        </p>
                                    </div>
                                </div>
                                {isExpanded ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                                <div className="px-4 pb-4 divide-y">
                                    {accounts.map(account => {
                                        const isSelected = selectedAccounts.some(a => a.id === account.id)

                                        return (
                                            <div
                                                key={account.id}
                                                className={`
                          flex items-center justify-between py-3 cursor-pointer
                          ${isSelected ? 'bg-primary/5' : 'hover:bg-gray-50'}
                        `}
                                                onClick={() => handleToggleAccount(account)}
                                            >
                                                <div className="flex items-center">
                                                    <Avatar className="h-8 w-8 mr-3">
                                                        {account.profilePicture ? (
                                                            <AvatarImage src={account.profilePicture} alt={account.username} />
                                                        ) : (
                                                            <AvatarFallback>
                                                                <User className="h-4 w-4" />
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">{account.username}</p>
                                                        {!account.isConnected && (
                                                            <Badge variant="destructive" className="text-xs mt-1">
                                                                Disconnected
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className={`
                          w-5 h-5 rounded-md border ${isSelected
                                                        ? 'bg-primary border-primary text-white'
                                                        : 'border-gray-300'
                                                    } flex items-center justify-center
                        `}>
                                                    {isSelected && <Check className="h-3 w-3" />}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    )
                })}
            </div>

            {selectedAccounts.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium mb-1">Selected Accounts:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedAccounts.map(account => {
                            const platform = PLATFORMS.find(p => p.id === account.platformType)

                            return (
                                <Badge
                                    key={account.id}
                                    variant="outline"
                                    className="flex items-center gap-1 px-2 py-1"
                                >
                                    <span>{platform?.icon}</span>
                                    <span>{account.username}</span>
                                </Badge>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AccountSelector