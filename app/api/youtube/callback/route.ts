import { NextResponse, NextRequest } from "next/server";
import { redirect } from "next/navigation";

// Mark this route as dynamic to prevent static rendering errors
export const dynamic = "force-dynamic";

/**
 * API route for YouTube OAuth callback
 * This simply redirects to the client-side callback handler
 */
export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone();
    const params = url.searchParams;
    
    // Get code and state from the query string
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");
    
    // Redirect to the client-side callback handler
    const callbackUrl = new URL("/youtube-callback", process.env.NEXT_PUBLIC_APP_URL);
    
    // Preserve all params 
    params.forEach((value, key) => {
        callbackUrl.searchParams.append(key, value);
    });
    
    return NextResponse.redirect(callbackUrl);
}
