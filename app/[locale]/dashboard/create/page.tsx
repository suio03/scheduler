// app/dashboard/create-post/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

import MediaUploader from "@/components/creator/media-uploader"
import AccountSelector from "@/components/creator/account-selector"
import CaptionInput from "@/components/creator/caption-input"
import PostPreview from "@/components/creator/post-preview"
import DateTimePicker from "@/components/creator/datetime-picker"

// Types
import { Account } from "@/types/create-post"

interface FormData {
    caption: string
    scheduledFor: Date | null
    accounts: Account[]
    mediaFiles: File[]
}

const CreatePostPage = () => {
    const [selectedAccounts, setSelectedAccounts] = useState<Account[]>([])
    const [videoFile, setVideoFile] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [hashtags, setHashtags] = useState<string[]>([])
    const form = useForm<FormData>({
        defaultValues: {
            caption: "",
            scheduledFor: null,
            accounts: [],
            mediaFiles: [],
        },
    })

    // Extract hashtags from caption when it changes
    useEffect(() => {
        const caption = form.watch("caption") || ""
        const extractedHashtags = caption.match(/#\w+/g) || []
        setHashtags(extractedHashtags)
    }, [form.watch("caption")])

    const handleVideoUpload = (files: File[]) => {
        setVideoFile(files)
        form.setValue("mediaFiles", files)
    }

    const handleAccountChange = (accounts: Account[]) => {
        setSelectedAccounts(accounts)
        form.setValue("accounts", accounts)
    }

    const onSubmit = async (data: FormData) => {
        if (selectedAccounts.length === 0) {
            toast.error("Please select at least one account")
            return
        }

        if (videoFile.length === 0) {
            toast.error("Please upload a video")
            return
        }

        setIsSubmitting(true)

        try {
            // Here you'd implement the actual API call to create the post
            console.log("Submitting post data:", data)

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            toast.success("Your post has been scheduled successfully!")

            // Reset form
            form.reset()
            setVideoFile([])
            setSelectedAccounts([])
        } catch (error) {
            console.error("Error creating post:", error)
            toast.error("Failed to schedule your post. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container max-w-6xl py-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Upload and Caption */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <MediaUploader onUpload={handleVideoUpload} files={videoFile} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <CaptionInput form={form} selectedAccounts={selectedAccounts} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <AccountSelector
                                    selectedAccounts={selectedAccounts}
                                    onChange={handleAccountChange}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <DateTimePicker form={form} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right column - Preview */}
                    <div>
                        <Card className="sticky top-6">
                            <CardContent className="pt-6">
                                <PostPreview
                                    caption={form.watch("caption")}
                                    hashtags={hashtags}
                                    mediaFiles={videoFile}
                                    username={selectedAccounts.length > 0 ? selectedAccounts[0].username : "your_username"}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="px-8"
                    >
                        {isSubmitting ? "Scheduling..." : "Schedule Post"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CreatePostPage