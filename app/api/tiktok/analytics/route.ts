import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/next-auth';
import prisma from '@/lib/prisma';
import { TikTokApiClient } from '@/lib/tiktok/api';



/**
 * Get analytics data for a post
 */
export async function GET(req: NextRequest) {
  try {
    // Check if the user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Get the post
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        userId: session.user.id,
      },
      include: {
        platformAccount: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found or unauthorized' },
        { status: 404 }
      );
    }

    // Check if the post has been published
    if (post.status !== 'published' || !post.platformPostId) {
      return NextResponse.json(
        { error: 'Post has not been published yet' },
        { status: 400 }
      );
    }

    // Initialize TikTok API client
    const tiktokClient = new TikTokApiClient(post.platformAccountId);
    
    // Get video metrics
    const metrics = await tiktokClient.getVideoMetrics(post.platformPostId);
    
    // Return the metrics
    return NextResponse.json({
      postId: post.id,
      platformPostId: post.platformPostId,
      metrics: {
        likeCount: metrics.like_count,
        commentCount: metrics.comment_count,
        viewCount: metrics.view_count,
        shareCount: metrics.share_count,
        profileVisits: metrics.profile_visits,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching post analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch post analytics' },
      { status: 500 }
    );
  }
}

/**
 * Get aggregated analytics data for a platform account
 */
export async function POST(req: NextRequest) {
  try {
    // Check if the user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await req.json();
    const { platformAccountId, startDate, endDate } = body;
    
    if (!platformAccountId) {
      return NextResponse.json(
        { error: 'Platform account ID is required' },
        { status: 400 }
      );
    }

    // Check if the platform account exists and belongs to the user
    const platformAccount = await prisma.platformAccount.findFirst({
      where: {
        id: platformAccountId,
        userId: session.user.id,
        platformType: 'tiktok',
      },
    });

    if (!platformAccount) {
      return NextResponse.json(
        { error: 'Platform account not found or unauthorized' },
        { status: 404 }
      );
    }

    // Parse dates
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
    const end = endDate ? new Date(endDate) : new Date();

    // Get all published posts for the platform account within the date range
    const posts = await prisma.post.findMany({
      where: {
        platformAccountId,
        status: 'published',
        publishedAt: {
          gte: start,
          lte: end,
        },
      },
    });

    // Initialize TikTok API client
    const tiktokClient = new TikTokApiClient(platformAccountId);
    
    // Get metrics for each post
    const metricsPromises = posts.map(async (post) => {
      if (!post.platformPostId) return null;
      
      try {
        return await tiktokClient.getVideoMetrics(post.platformPostId);
      } catch (error) {
        console.error(`Error fetching metrics for post ${post.id}:`, error);
        return null;
      }
    });
    
    const metricsResults = await Promise.all(metricsPromises);
    
    // Filter out null results and aggregate metrics
    const validMetrics = metricsResults.filter(Boolean);
    
    const aggregatedMetrics = {
      totalPosts: validMetrics.length,
      totalLikes: validMetrics.reduce((sum, m) => sum + (m?.like_count || 0), 0),
      totalComments: validMetrics.reduce((sum, m) => sum + (m?.comment_count || 0), 0),
      totalViews: validMetrics.reduce((sum, m) => sum + (m?.view_count || 0), 0),
      totalShares: validMetrics.reduce((sum, m) => sum + (m?.share_count || 0), 0),
      totalProfileVisits: validMetrics.reduce((sum, m) => sum + (m?.profile_visits || 0), 0),
      averageLikes: validMetrics.length > 0 ? validMetrics.reduce((sum, m) => sum + (m?.like_count || 0), 0) / validMetrics.length : 0,
      averageComments: validMetrics.length > 0 ? validMetrics.reduce((sum, m) => sum + (m?.comment_count || 0), 0) / validMetrics.length : 0,
      averageViews: validMetrics.length > 0 ? validMetrics.reduce((sum, m) => sum + (m?.view_count || 0), 0) / validMetrics.length : 0,
    };
    
    return NextResponse.json({
      platformAccountId,
      startDate: start,
      endDate: end,
      metrics: aggregatedMetrics,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching account analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch account analytics' },
      { status: 500 }
    );
  }
} 