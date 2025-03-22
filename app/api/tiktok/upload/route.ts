import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { TikTokApiClient } from "@/lib/tiktok/api";

// Mark this route as dynamic to prevent static rendering errors
export const dynamic = 'force-dynamic';

// Increase the body size limit for video uploads (default is 4MB)
// TODO: Need to increase the limit, The tiktok allowed size is 30GB

/**
 * Upload a video to TikTok
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

        // Get the form data
        const formData = await req.formData();
        const platformAccountId = formData.get("platformAccountId") as string;
        const videoFile = formData.get("video") as File;
        const title = formData.get("title") as string;

        // Validate required fields
        if (!platformAccountId || !videoFile) {
            return NextResponse.json(
                { error: "Platform account ID and video file are required" },
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

        // Create a media record
        const media = await prisma.media.create({
            data: {
                originalName: videoFile.name,
                fileSize: videoFile.size,
                mimeType: videoFile.type,
                path: "", // Will be updated after upload
                status: "uploading",
            },
        });

        // Initialize TikTok API client
        const tiktokClient = new TikTokApiClient(platformAccountId);

        try {
            // Initialize video upload
            const initResponse = await tiktokClient.initVideoUpload();

            // Convert the file to a Blob
            const buffer = await videoFile.arrayBuffer();
            const blob = new Blob([buffer], { type: videoFile.type });

            // Upload the video (for simplicity, we're uploading as a single chunk)
            await tiktokClient.uploadVideoChunk(
                initResponse.upload_url,
                blob,
                0,
                1
            );

            // Complete the upload
            const completeResponse = await tiktokClient.completeVideoUpload(
                initResponse.upload_url
            );

            // Update the media record
            await prisma.media.update({
                where: { id: media.id },
                data: {
                    path: completeResponse.video_id,
                    status: "ready",
                },
            });

            return NextResponse.json(
                {
                    message: "Video uploaded successfully",
                    mediaId: media.id,
                    videoId: completeResponse.video_id,
                },
                { status: 200 }
            );
        } catch (error: any) {
            // Update the media record with error status
            await prisma.media.update({
                where: { id: media.id },
                data: {
                    status: "error",
                    metadata: { error: error.message },
                },
            });

            throw error;
        }
    } catch (error: any) {
        console.error("Error uploading video to TikTok:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload video to TikTok" },
            { status: 500 }
        );
    }
}
