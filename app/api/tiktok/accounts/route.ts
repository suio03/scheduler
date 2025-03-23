import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/next-auth";
import prisma from "@/lib/prisma";
import { disconnectTikTokAccount } from "@/lib/tiktok/auth";



/**
 * Get all TikTok accounts for the authenticated user
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

        // Get all TikTok accounts for the user
        const accounts = await prisma.platformAccount.findMany({
            where: {
                userId: session.user.id,
                platformType: "TIKTOK",
            },
            select: {
                id: true,
                platformType: true,
                accountName: true,
                platformAccountId: true,
                metadata: true,
            }
        });

        return NextResponse.json({ accounts }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching TikTok accounts:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch TikTok accounts" },
            { status: 500 }
        );
    }
}

/**
 * Delete a TikTok account
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

        // Get the account ID from the request body
        const { accountId } = await req.json();

        if (!accountId) {
            return NextResponse.json(
                { error: "Account ID is required" },
                { status: 400 }
            );
        }

        // Disconnect the TikTok account
        await disconnectTikTokAccount(accountId);

        return NextResponse.json(
            { message: "TikTok account disconnected successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error disconnecting TikTok account:", error);
        return NextResponse.json(
            { error: error.message || "Failed to disconnect TikTok account" },
            { status: 500 }
        );
    }
}


export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { accountId, accountName } = await req.json();

    if (!accountId) {
        return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }

    const account = await prisma.platformAccount.create({
        data: {
            userId: session.user.id,
            platformType: "TIKTOK",
            platformAccountId: accountId,
            accountName: accountName,   
        },
    });

    return NextResponse.json({ account }, { status: 200 });
}