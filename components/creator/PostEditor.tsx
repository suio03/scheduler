'use client'

import React, { useState } from 'react'
import { MapPinIcon, UserIcon, LinkIcon } from '@heroicons/react/24/outline'
import MediaUploader from './MediaUploader'
import HashtagSelector from './HashtagSelector'
import SchedulingOptions from './SchedulingOptions'

interface PostEditorProps {
    onFileChange?: (file: File | null, previewUrl: string | null) => void;
    onCaptionChange?: (caption: string) => void;
}

export default function PostEditor({ onFileChange, onCaptionChange }: PostEditorProps) {
    const [captionText, setCaptionText] = useState<string>('');
    const [captionLength, setCaptionLength] = useState<number>(0);
    
    const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setCaptionText(text);
        setCaptionLength(text.length);
        
        if (onCaptionChange) {
            onCaptionChange(text);
        }
    };
    
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Create New Post</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Fill in the details below to create your post
                </p>
            </div>

            <div className="p-6">
                <div className="space-y-6">
                    {/* Platform Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                        <div className="flex flex-wrap gap-3">
                            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input type="radio" name="platform" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" defaultChecked />
                                <span className="ml-2 text-gray-900">TikTok</span>
                            </label>
                            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input type="radio" name="platform" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                <span className="ml-2 text-gray-900">Instagram</span>
                            </label>
                            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input type="radio" name="platform" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                <span className="ml-2 text-gray-900">Facebook</span>
                            </label>
                            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input type="radio" name="platform" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                <span className="ml-2 text-gray-900">YouTube</span>
                            </label>
                        </div>
                    </div>

                    {/* Media Upload */}
                    <MediaUploader onFileChange={onFileChange} />

                    {/* Title & Caption */}
                    <div>
                        <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
                        <input
                            type="text"
                            id="post-title"
                            className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter a title for your post"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="post-caption" className="block text-sm font-medium text-gray-700">Caption</label>
                            <span className="text-xs text-gray-500">{captionLength}/2200</span>
                        </div>
                        <textarea
                            id="post-caption"
                            rows={5}
                            value={captionText}
                            onChange={handleCaptionChange}
                            className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Write a caption for your post..."
                            maxLength={2200}
                        ></textarea>
                    </div>

                    {/* Hashtags */}
                    <HashtagSelector />

                    {/* Advanced Options Accordion */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <button className="flex items-center justify-between w-full text-left">
                                <span className="text-sm font-medium text-gray-700">Advanced Options</span>
                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Add a location"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tag People</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Tag collaborators or friends"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Add Link</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LinkIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="url"
                                        className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SchedulingOptions />
                </div>
            </div>
        </div>
    )
}
