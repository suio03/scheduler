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
    const { publish_id } = await req.json();
    
    if (!publish_id) {
      return NextResponse.json(
        { error: 'Publish ID is required' },
        { status: 400 }
      );
    }
    
    // Get a valid access token
    const accessToken = await getValidAccessToken(accountId);
    
    // Check video status with TikTok API
    const response = await fetch(
      'https://open.tiktokapis.com/v2/post/publish/status/fetch/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publish_id,
        }),
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
    console.error('Error checking video status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check video status' },
      { status: 500 }
    );
  }
} 