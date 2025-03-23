import { NextResponse, NextRequest } from "next/server";
import { startTikTokOAuth } from "@/lib/tiktok/auth";
import { auth } from "@/lib/next-auth";

// Mark this route as dynamic to prevent static rendering errors
export const dynamic = "force-dynamic";

/**
 * API route to initiate TikTok OAuth flow
 */
export async function GET(req: NextRequest) {
    try {
        // Check if the user is authenticated
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        // Start the OAuth flow
        const authUrl = await startTikTokOAuth();

        // Return the authorization URL
        return NextResponse.json({ authUrl }, { status: 200 });
    } catch (error: any) {
        console.error("Error starting TikTok OAuth flow:", error);
        return NextResponse.json(
            { error: error.message || "Failed to start TikTok OAuth flow" },
            { status: 500 }
        );
    }
}
