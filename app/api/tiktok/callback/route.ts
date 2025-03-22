import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { handleTikTokOAuthCallback } from "@/lib/tiktok/auth";

// Mark this route as dynamic to prevent static rendering errors
export const dynamic = 'force-dynamic';

/**
 * Handle TikTok OAuth callback
 */
export async function GET(req: NextRequest) {
  try {
    // Check if the user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
    }

    // Get the authorization code and state from the URL
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    const errorDescription = url.searchParams.get("error_description");

    // Handle errors from TikTok
    if (error) {
      console.error("TikTok OAuth error:", error, errorDescription);
      return NextResponse.redirect(
        new URL(`/dashboard/accounts?error=${encodeURIComponent(errorDescription || error)}`, req.url)
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/dashboard/accounts?error=missing_params", req.url)
      );
    }

    // The code verifier will be retrieved from the client-side cookie in the browser
    // We'll pass the code and state to the handler, and the client will need to provide the code_verifier
    // This is handled in the frontend when the page loads after redirect
    
    // Process the authorization code
    const account = await handleTikTokOAuthCallback(code, state);

    // Redirect back to the accounts page with success message
    return NextResponse.redirect(
      new URL("/dashboard/accounts?success=connected", req.url)
    );
  } catch (error: any) {
    console.error("Error handling TikTok callback:", error);
    
    // Redirect back to the accounts page with error message
    return NextResponse.redirect(
      new URL(`/dashboard/accounts?error=${encodeURIComponent(error.message)}`, req.url)
    );
  }
} 