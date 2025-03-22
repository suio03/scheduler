import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { TikTokApiClient } from "@/lib/tiktok/api";
import { dateToUnixTimestamp } from "@/lib/tiktok/utils";

// Mark this route as dynamic to prevent static rendering errors
export const dynamic = 'force-dynamic';

/**
 * Get all posts for the authenticated user
 */
export async function GET(req: NextRequest) {
    try {
        // Check if the user is authenticated
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Get query parameters
        const searchParams = req.nextUrl.searchParams;
        const platformAccountId = searchParams.get("platformAccountId");
        const status = searchParams.get("status");

        // Build the query
        const query: any = {
            userId: session.user.id,
        };

        if (platformAccountId) {
            query.platformAccountId = platformAccountId;
        }

        if (status) {
            query.status = status;
        }

        // Get all posts for the user
        const posts = await prisma.post.findMany({
            where: query,
            include: {
                platformAccount: true,
                media: true,
            },
            orderBy: {
                scheduledFor: "desc",
            },
        });

        return NextResponse.json({ posts }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch posts" },
            { status: 500 }
        );
    }
}

/**
 * Create a new post
 */
export async function POST(req: NextRequest) {
    try {
        // Check if the user is authenticated
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Get the request body
        const body = await req.json();
        const {
            platformAccountId,
            mediaId,
            content,
            scheduledFor,
            privacy = "PUBLIC",
            disableComment = false,
            disableDuet = false,
            disableStitch = false,
        } = body;

        // Validate required fields
        if (!platformAccountId || !mediaId) {
            return NextResponse.json(
                { error: "Platform account ID and media ID are required" },
                { status: 400 }
            );
        }

        // Check if the platform account exists and belongs to the user
        const platformAccount = await prisma.platformAccount.findFirst({
            where: {
                id: platformAccountId,
                userId: session.user.id,
                platformType: "tiktok",
            },
        });

        if (!platformAccount) {
            return NextResponse.json(
                { error: "Platform account not found or unauthorized" },
                { status: 404 }
            );
        }

        // Check if the media exists and is ready
        const media = await prisma.media.findFirst({
            where: {
                id: mediaId,
                status: "ready",
            },
        });

        if (!media) {
            return NextResponse.json(
                { error: "Media not found or not ready" },
                { status: 404 }
            );
        }

        // Create the post
        const post = await prisma.post.create({
            data: {
                userId: session.user.id,
                platformAccountId,
                mediaId,
                content,
                scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
                status: scheduledFor ? "scheduled" : "draft",
                metadata: {
                    privacy,
                    disableComment,
                    disableDuet,
                    disableStitch,
                },
            },
        });

        // If the post is scheduled for immediate publishing
        if (!scheduledFor) {
            try {
                // Initialize TikTok API client
                const tiktokClient = new TikTokApiClient(platformAccountId);

                // Publish the video
                const publishResponse = await tiktokClient.publishVideo(
                    media.path, // This should be the TikTok video ID
                    content,
                    privacy,
                    {
                        disable_comment: disableComment,
                        disable_duet: disableDuet,
                        disable_stitch: disableStitch,
                    }
                );

                // Update the post with the platform post ID
                await prisma.post.update({
                    where: { id: post.id },
                    data: {
                        platformPostId: publishResponse.publish_id,
                        publishedAt: new Date(),
                        status: "published",
                    },
                });
            } catch (error: any) {
                // Update the post with error status
                await prisma.post.update({
                    where: { id: post.id },
                    data: {
                        status: "failed",
                        failureReason: error.message,
                    },
                });

                throw error;
            }
        } else {
            // Create a scheduler job for the post
            await prisma.schedulerJob.create({
                data: {
                    jobId: `publish-${post.id}`,
                    postId: post.id,
                    type: "publish",
                    status: "waiting",
                    nextAttempt: new Date(scheduledFor),
                },
            });
        }

        return NextResponse.json({ post }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create post" },
            { status: 500 }
        );
    }
}

/**
 * Update a post
 */
export async function PUT(req: NextRequest) {
    try {
        // Check if the user is authenticated
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Get the request body
        const body = await req.json();
        const {
            postId,
            content,
            scheduledFor,
            privacy,
            disableComment,
            disableDuet,
            disableStitch,
        } = body;

        // Validate required fields
        if (!postId) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            );
        }

        // Check if the post exists and belongs to the user
        const post = await prisma.post.findFirst({
            where: {
                id: postId,
                userId: session.user.id,
            },
        });

        if (!post) {
            return NextResponse.json(
                { error: "Post not found or unauthorized" },
                { status: 404 }
            );
        }

        // Check if the post can be updated
        if (post.status !== "draft" && post.status !== "scheduled") {
            return NextResponse.json(
                { error: "Only draft or scheduled posts can be updated" },
                { status: 400 }
            );
        }

        // Update the post
        const updateData: any = {};

        if (content !== undefined) {
            updateData.content = content;
        }

        if (scheduledFor !== undefined) {
            updateData.scheduledFor = scheduledFor
                ? new Date(scheduledFor)
                : null;
            updateData.status = scheduledFor ? "scheduled" : "draft";
        }

        // Update metadata if any of the privacy settings are provided
        if (
            privacy !== undefined ||
            disableComment !== undefined ||
            disableDuet !== undefined ||
            disableStitch !== undefined
        ) {
            const metadata = (post.metadata as any) || {};

            if (privacy !== undefined) metadata.privacy = privacy;
            if (disableComment !== undefined)
                metadata.disableComment = disableComment;
            if (disableDuet !== undefined) metadata.disableDuet = disableDuet;
            if (disableStitch !== undefined)
                metadata.disableStitch = disableStitch;

            updateData.metadata = metadata;
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: updateData,
        });

        // Update the scheduler job if the scheduled time changed
        if (scheduledFor !== undefined) {
            if (scheduledFor) {
                // Create or update the scheduler job
                await prisma.schedulerJob.upsert({
                    where: { jobId: `publish-${postId}` },
                    update: {
                        status: "waiting",
                        nextAttempt: new Date(scheduledFor),
                    },
                    create: {
                        jobId: `publish-${postId}`,
                        postId,
                        type: "publish",
                        status: "waiting",
                        nextAttempt: new Date(scheduledFor),
                    },
                });
            } else {
                // Delete the scheduler job if the post is no longer scheduled
                await prisma.schedulerJob.deleteMany({
                    where: { jobId: `publish-${postId}` },
                });
            }
        }

        return NextResponse.json({ post: updatedPost }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update post" },
            { status: 500 }
        );
    }
}

/**
 * Delete a post
 */
export async function DELETE(req: NextRequest) {
    try {
        // Check if the user is authenticated
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Get the post ID from the query parameters
        const searchParams = req.nextUrl.searchParams;
        const postId = searchParams.get("postId");

        if (!postId) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            );
        }

        // Check if the post exists and belongs to the user
        const post = await prisma.post.findFirst({
            where: {
                id: postId,
                userId: session.user.id,
            },
        });

        if (!post) {
            return NextResponse.json(
                { error: "Post not found or unauthorized" },
                { status: 404 }
            );
        }

        // Delete the scheduler job if it exists
        await prisma.schedulerJob.deleteMany({
            where: { jobId: `publish-${postId}` },
        });

        // Delete the post
        await prisma.post.delete({
            where: { id: postId },
        });

        return NextResponse.json(
            { message: "Post deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete post" },
            { status: 500 }
        );
    }
}
