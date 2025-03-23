// app/dashboard/create-post/MediaUploader.tsx
"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
    X,
    Video,
    AlertCircle,
    CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface MediaUploaderProps {
    onUpload: (files: File[]) => void
    files: File[]
}

const MediaUploader = ({ onUpload, files }: MediaUploaderProps) => {
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [uploadSuccess, setUploadSuccess] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setUploadError(null)
        setUploadSuccess(false)

        // Filter only video files
        const videoFiles = acceptedFiles.filter(file => file.type.startsWith('video/'))
        if (videoFiles.length === 0) {
            setUploadError("Please upload a video file.")
            return
        }
        
        // Only keep the most recent video
        const latestVideo = videoFiles[videoFiles.length - 1]
        onUpload([latestVideo])
        
        // Simulate upload progress for the video
        let progress = 0
        const interval = setInterval(() => {
            progress += 5
            setUploadProgress(prev => ({
                ...prev,
                [latestVideo.name]: progress
            }))

            if (progress >= 100) {
                clearInterval(interval)
                setUploadSuccess(true)
            }
        }, 100)
    }, [onUpload])

    const removeFile = () => {
        onUpload([])
        setUploadProgress({})
        setUploadSuccess(false)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/*': ['.mp4', '.mov', '.avi']
        },
        maxSize: 100 * 1024 * 1024, // 100MB
        maxFiles: 1,
        multiple: false,
        onDropRejected: (rejections) => {
            const errors = rejections.map(rejection => {
                if (rejection.errors[0].code === 'file-too-large') {
                    return `${rejection.file.name} is too large. Maximum size is 100MB.`
                }
                if (rejection.errors[0].code === 'too-many-files') {
                    return 'Only one video file can be uploaded at a time.'
                }
                if (rejection.errors[0].code === 'file-invalid-type') {
                    return `${rejection.file.name} is not a valid video file. Accepted formats: MP4, MOV, AVI.`
                }
                return `${rejection.file.name}: ${rejection.errors[0].message}`
            })
            setUploadError(errors.join(' '))
        }
    })

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Video Upload</h2>

            {files.length === 0 ? (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 hover:border-primary/50'
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <Video className="h-10 w-10 text-gray-400" />
                        <p className="text-lg font-medium">
                            {isDragActive ? 'Drop your video here' : 'Drag & drop your video here'}
                        </p>
                        <p className="text-sm text-gray-500">
                            or click to browse (videos up to 100MB)
                        </p>
                        <Button type="button" variant="outline" size="sm" className="mt-2">
                            Select Video
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <Video className="h-6 w-6 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium truncate max-w-[300px]">{files[0].name}</p>
                                <p className="text-xs text-gray-500">{(files[0].size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={removeFile}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    {uploadProgress[files[0].name] && uploadProgress[files[0].name] < 100 ? (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span>Uploading...</span>
                                <span>{uploadProgress[files[0].name]}%</span>
                            </div>
                            <Progress value={uploadProgress[files[0].name]} className="h-2" />
                        </div>
                    ) : uploadSuccess ? (
                        <Alert className="bg-green-50 border-green-100">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-700">
                                Video uploaded successfully
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Progress value={100} className="h-2" />
                    )}
                </div>
            )}

            {uploadError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}

export default MediaUploader