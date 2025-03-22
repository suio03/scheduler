'use client'

import React, { useState, useRef, useEffect } from 'react'
import { PhotoIcon, XCircleIcon, DocumentIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

// Maximum video size in bytes (4GB)
const MAX_VIDEO_SIZE = 4 * 1024 * 1024 * 1024
// Chunk size for upload (10MB)
const CHUNK_SIZE = 10 * 1024 * 1024

interface UploadProgress {
    status: 'idle' | 'uploading' | 'processing' | 'success' | 'error'
    progress: number
    message?: string
}

interface MediaUploaderProps {
    onFileChange?: (file: File | null, previewUrl: string | null) => void
}

export default function MediaUploader({ onFileChange }: MediaUploaderProps) {
    const [dragActive, setDragActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
        status: 'idle',
        progress: 0
    })
    const [videoInfo, setVideoInfo] = useState<{
        duration: number
        dimensions: { width: number; height: number }
    } | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Notify parent component when file changes
    useEffect(() => {
        if (onFileChange) {
            onFileChange(selectedFile, preview)
        }
    }, [selectedFile, preview, onFileChange])

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()

        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const validateFile = (file: File): boolean => {
        // Check file size
        if (file.size > MAX_VIDEO_SIZE) {
            setUploadProgress({
                status: 'error',
                progress: 0,
                message: 'File exceeds maximum size of 4GB'
            })
            return false
        }

        // Check file type for videos
        if (file.type.startsWith('video/')) {
            const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo']
            if (!validVideoTypes.includes(file.type)) {
                setUploadProgress({
                    status: 'error',
                    progress: 0,
                    message: 'Unsupported video format. Use MP4, MOV, or AVI'
                })
                return false
            }
        }

        return true
    }

    const handleFile = (file: File) => {
        // Reset states
        setUploadProgress({ status: 'idle', progress: 0 })

        if (!validateFile(file)) {
            return
        }

        setSelectedFile(file)

        // Create preview for images and videos
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else if (file.type.startsWith('video/')) {
            const videoUrl = URL.createObjectURL(file)
            setPreview(videoUrl)

            // Extract video metadata when loaded
            const video = document.createElement('video')
            video.onloadedmetadata = () => {
                setVideoInfo({
                    duration: video.duration,
                    dimensions: {
                        width: video.videoWidth,
                        height: video.videoHeight
                    }
                })

                // Check if video exceeds TikTok's maximum duration
                if (video.duration > 300) { // 5 minutes in seconds
                    setUploadProgress({
                        status: 'error',
                        progress: 0,
                        message: 'Video exceeds maximum duration of 5 minutes'
                    })
                }
            }
            video.src = videoUrl
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        setPreview(null)
        setVideoInfo(null)
        setUploadProgress({ status: 'idle', progress: 0 })

        // Revoke object URL if it exists
        if (preview && preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview)
        }
    }

    // Calculate total chunks based on file size
    const getTotalChunks = (fileSize: number): number => {
        return Math.ceil(fileSize / CHUNK_SIZE)
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>

            {!selectedFile ? (
                <div
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Drag and drop or click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">MP4, MOV up to 4GB (max 5 minutes)</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Select File
                    </button>
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="video/mp4,video/quicktime,image/*"
                        onChange={handleChange}
                    />
                </div>
            ) : (
                <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                            <DocumentIcon className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                {selectedFile.name}
                            </span>
                        </div>
                        <button
                            onClick={removeFile}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <XCircleIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {preview && selectedFile.type.startsWith('video/') && (
                        <div className="mt-2 rounded-md overflow-hidden bg-black">
                            {/* <video
                                ref={videoRef}
                                src={preview}
                                className="max-h-[200px] w-auto mx-auto"
                                controls
                            /> */}
                            {/* {videoInfo && (
                                <div className="mt-1 text-xs text-gray-500 flex justify-between px-1">
                                    <span>Duration: {Math.floor(videoInfo.duration / 60)}:{Math.floor(videoInfo.duration % 60).toString().padStart(2, '0')}</span>
                                    <span>{videoInfo.dimensions.width}×{videoInfo.dimensions.height}</span>
                                </div>
                            )} */}
                        </div>
                    )}

                    {preview && selectedFile.type.startsWith('image/') && (
                        <div className="mt-2 rounded-md overflow-hidden">
                            <img src={preview} alt="Preview" className="max-h-[200px] w-auto mx-auto" />
                        </div>
                    )}

                    {!preview && (
                        <div className="mt-2 bg-gray-100 rounded-md p-3 text-sm text-gray-500 text-center">
                            {selectedFile.type.startsWith('video/') ? 'Video file selected' : 'File selected'}
                        </div>
                    )}

                    {/* Upload status */}
                    {uploadProgress.status === 'error' && (
                        <div className="mt-2 bg-red-50 text-red-700 p-2 rounded-md text-sm">
                            {uploadProgress.message || 'Upload failed'}
                        </div>
                    )}

                    {uploadProgress.status === 'uploading' && (
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">Uploading chunks ({Math.round(uploadProgress.progress)}%)</span>
                                <ArrowPathIcon className="h-4 w-4 text-blue-500 animate-spin" />
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full"
                                    style={{ width: `${uploadProgress.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {uploadProgress.status === 'processing' && (
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-blue-500">Processing by TikTok...</span>
                                <ArrowPathIcon className="h-4 w-4 text-blue-500 animate-spin" />
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    )}

                    <div className="mt-3 flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            {selectedFile.type.startsWith('video/') && ` • ${getTotalChunks(selectedFile.size)} chunks`}
                        </p>

                        {uploadProgress.status !== 'uploading' && uploadProgress.status !== 'processing' && (
                            <p className="text-xs text-gray-500">
                                Ready to upload
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
