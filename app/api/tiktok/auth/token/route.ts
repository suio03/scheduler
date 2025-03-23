import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { handleTikTokOAuthCallback } from "@/lib/tiktok/auth";

export const dynamic = "force-dynamic";

/**
 * Exchange authorization code for tokens using PKCE
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

        // Get the code, state, and code verifier from the request body
        const { code, state, codeVerifier, redirectUri } = await req.json();

        // Validate required parameters
        if (!code || !state || !codeVerifier) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        try {
            // Process the authorization code with PKCE
            const account = await handleTikTokOAuthCallback(
                code,
                state,
                codeVerifier,
                redirectUri
            );

            return NextResponse.json({ account }, { status: 200 });
        } catch (error: any) {
            console.error(
                "TikTok API token exchange - Error in handleTikTokOAuthCallback:",
                error
            );

            // Extract the root cause of the error
            let rootError = error;
            let rootCause = error.message;
            let errorStack = error.stack || "";

            // Check if this is a known TikTok API error
            if (error.message.includes("TikTok API error")) {
                rootCause = error.message;
            }

            // Check for nested errors
            if (error.cause) {
                rootError = error.cause;
                rootCause = error.cause.message || rootCause;
            }

            // If it's an expired code error, provide more helpful message
            if (rootCause.includes("Authorization code is expired")) {
                // Return a more detailed error response
                return NextResponse.json(
                    {
                        error: "TikTok authorization code is expired. Please try connecting again.",
                        details:
                            "Authorization codes from TikTok can only be used once and expire quickly. This error typically happens if you refresh the page after authorizing or if there's a delay in processing.",
                        originalError: rootCause,
                        stack: errorStack,
                    },
                    { status: 400 } // Using 400 instead of 500 since this is an expected error
                );
            }

            // Return a more detailed error response
            return NextResponse.json(
                {
                    error: rootCause || "Failed to connect TikTok account",
                    details: errorStack,
                    originalError: error.message,
                },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error("TikTok API token exchange - Unhandled error:", error);

        return NextResponse.json(
            {
                error: error.message || "Failed to connect TikTok account",
                details: error.stack,
                type: "unhandled_exception",
            },
            { status: 500 }
        );
    }
}
