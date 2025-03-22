import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/tiktok/utils';

export async function GET(req: NextRequest) {
  try {
    // Get the account ID from the query parameters
    const accountId = req.nextUrl.searchParams.get('accountId');
    
    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }
    
    // Get a valid access token
    const accessToken = await getValidAccessToken(accountId);
    
    // Query creator info from TikTok API
    const response = await fetch(
      'https://open.tiktokapis.com/v2/post/publish/creator_info/query/',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
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
    console.error('Error fetching creator info:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch creator info' },
      { status: 500 }
    );
  }
} 