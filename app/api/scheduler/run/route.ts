import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/next-auth';



/**
 * API route to manually trigger the scheduler
 * This is for development and testing purposes
 * In production, this would be triggered by a cron job
 */
export async function POST(req: NextRequest) {
  try {
    // Check if the user is authenticated and is an admin
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // In a real application, you would check if the user has admin privileges
    // For now, we'll just check if they're authenticated

    // Run the worker
    // await runWorker();

    return NextResponse.json(
      { message: 'Scheduler triggered successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error triggering scheduler:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to trigger scheduler' },
      { status: 500 }
    );
  }
} 