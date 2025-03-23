// app/dashboard/create-post/CaptionInput.tsx
"use client"

import { useState, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { Account, getLowestCaptionLimit } from '@/types/create-post'

interface CaptionInputProps {
    form: UseFormReturn<any>
    selectedAccounts: Account[]
}

const CaptionInput = ({ form, selectedAccounts }: CaptionInputProps) => {
    const [characterCount, setCharacterCount] = useState(0)
    const [hashtagCount, setHashtagCount] = useState(0)

    const caption = form.watch('caption') || ''

    // Calculate character limit based on selected accounts
    const characterLimit = getLowestCaptionLimit(selectedAccounts)

    // Calculate warning threshold (90% of limit)
    const warningThreshold = Math.floor(characterLimit * 0.9)

    // Character count status
    const isApproachingLimit = characterCount >= warningThreshold && characterCount < characterLimit
    const isOverLimit = characterCount > characterLimit

    // Update character count and hashtag count
    useEffect(() => {
        setCharacterCount(caption.length)

        // Count hashtags (words starting with #)
        const hashtags = caption.match(/#\w+/g)
        setHashtagCount(hashtags ? hashtags.length : 0)
    }, [caption])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold">Caption & Hashtags</h2>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">
                                    Add your caption and hashtags in a single text field. Character limits vary by platform,
                                    and we'll show you the lowest limit from your selected platforms.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className={`text-sm ${isOverLimit ? 'text-destructive font-medium' :
                    isApproachingLimit ? 'text-amber-500' :
                        'text-gray-500'
                    }`}>
                    {characterCount}/{characterLimit}
                </div>
            </div>

            <div className="space-y-2">
                <Textarea
                    placeholder="Write your caption here... Add #hashtags directly in your text"
                    className="min-h-32 resize-y"
                    {...form.register('caption')}
                />

                <div className="flex justify-between text-sm">
                    <div className="text-gray-500">
                        Hashtags: {hashtagCount}
                    </div>

                    {selectedAccounts.length === 0 && (
                        <div className="text-gray-500 italic">
                            Select accounts to see character limits
                        </div>
                    )}
                    Select platforms to see character limits
                </div>
            </div>
            {
                isOverLimit && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Your caption exceeds the character limit for some of your selected accounts.
                            Please reduce the length to ensure it can be posted to all accounts.
                        </AlertDescription>
                    </Alert>
                )
            }

            {
                isApproachingLimit && (
                    <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            You're approaching the character limit for some of your selected accounts.
                        </AlertDescription>
                    </Alert>
                )
            }
        </div>

    )
}

export default CaptionInput