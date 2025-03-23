import { NextResponse, NextRequest } from "next/server";
import { handleTikTokOAuthCallback } from "@/lib/tiktok/auth";

// Mark this route as dynamic to prevent static rendering errors
export const dynamic = "force-dynamic";

/**
 * API route to handle TikTok OAuth callback (GET request)
 */
export async function GET(req: NextRequest) {
    try {
        // Get the code and state from the query parameters
        const searchParams = req.nextUrl.searchParams;
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        // Validate parameters
        if (!code || !state) {
            return NextResponse.redirect(
                new URL("/settings/accounts?error=missing_params", req.url)
            );
        }

        // Handle the OAuth callback
        await handleTikTokOAuthCallback(code, state);

        // Redirect to the accounts page with success message
        return NextResponse.redirect(
            new URL("/settings/accounts?success=connected", req.url)
        );
    } catch (error: any) {
        console.error("Error handling TikTok OAuth callback:", error);

        // Redirect to the accounts page with error message
        return NextResponse.redirect(
            new URL(
                `/settings/accounts?error=${encodeURIComponent(
                    error.message || "unknown_error"
                )}`,
                req.url
            )
        );
    }
}

/**
 * API route to handle TikTok webhook notifications (POST request)
 */
export async function POST(req: NextRequest) {
    try {
        // Log the webhook payload for debugging
        const body = await req.json();
        // Process the webhook notification
        // TODO: Implement webhook processing logic based on TikTok's documentation

        // Return a 200 OK response to acknowledge receipt
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error("Error processing TikTok webhook:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process webhook" },
            { status: 500 }
        );
    }
}
