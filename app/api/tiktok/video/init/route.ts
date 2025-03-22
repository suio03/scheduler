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
    
    // Get request body
    const body = await req.json();
    
    // Get a valid access token
    const accessToken = await getValidAccessToken(accountId);
    
    // Initialize video upload with TikTok API
    const response = await fetch(
      'https://open.tiktokapis.com/v2/post/publish/video/init/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `TikTok API error: ${errorData.error?.message || response.statusText}`
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error initializing video upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize video upload' },
      { status: 500 }
    );
  }
} 