import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/tiktok/utils';

export async function POST(req: NextRequest) {
  try {
    // Get the account ID from the query parameters
    const accountId = req.nextUrl.searchParams.get('accountId');
    
    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }
    
    // Get chunk information from headers
    const chunkIndex = req.headers.get('x-chunk-index');
    const totalChunks = req.headers.get('x-total-chunks');
    const uploadUrl = req.headers.get('x-upload-url');
    
    if (!chunkIndex || !totalChunks || !uploadUrl) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }
    
    // Get the chunk data from the request
    const formData = await req.formData();
    const chunk = formData.get('video');
    
    if (!chunk || !(chunk instanceof Blob)) {
      return NextResponse.json(
        { error: 'Invalid chunk data' },
        { status: 400 }
      );
    }
    
    // Get a valid access token
    const accessToken = await getValidAccessToken(accountId);
    
    // Upload the chunk to TikTok
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'video/mp4',
        'Content-Range': `bytes ${parseInt(chunkIndex) * parseInt(totalChunks)}-${parseInt(chunkIndex) * parseInt(totalChunks) + chunk.size - 1}/${parseInt(totalChunks) * parseInt(chunkIndex)}`,
      },
      body: chunk,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `TikTok API error: ${errorData.error?.message || response.statusText}`
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error uploading chunk:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload chunk' },
      { status: 500 }
    );
  }
} 