import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { handleYouTubeOAuthCallback } from "@/lib/youtube/auth";

export const dynamic = "force-dynamic";

/**
 * Exchange authorization code for tokens
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

        // Get the code, state, and redirect URI from the request body
        const { code, state, redirectUri } = await req.json();

        // Validate required parameters
        if (!code || !state) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        try {
            // Process the authorization code
            const account = await handleYouTubeOAuthCallback(
                code,
                state,
                redirectUri
            );

            return NextResponse.json({ account }, { status: 200 });
        } catch (error: any) {
            console.error(
                "YouTube API token exchange - Error in handleYouTubeOAuthCallback:",
                error
            );

            // Extract the root cause of the error
            let rootError = error;
            let rootCause = error.message;
            let errorStack = error.stack || "";

            // Check if this is a known YouTube API error
            if (error.message.includes("YouTube API error")) {
                rootCause = error.message;
            }

            // Check for nested errors
            if (error.cause) {
                rootError = error.cause;
                rootCause = error.cause.message || rootCause;
            }

            // Return a more detailed error response
            return NextResponse.json(
                {
                    error: rootCause || "Failed to connect YouTube account",
                    details: errorStack,
                    originalError: error.message,
                },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("YouTube API token exchange - Unhandled error:", error);

        return NextResponse.json(
            {
                error: error.message || "Failed to connect YouTube account",
                details: error.stack,
                type: "unhandled_exception",
            },
            { status: 500 }
        );
    }
}
