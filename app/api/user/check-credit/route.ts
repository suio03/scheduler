import { NextResponse, type NextRequest } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("userId")
    
    if (!id) {
        return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
        )
    }
    
    const hasEnoughCredit = await checkUserSubscription(id)
    return NextResponse.json({ hasEnoughCredit })
}

const checkUserSubscription = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        })
        
        if (!user) {
            return false
        }
        
        // Check if user has a paid subscription or is in trial
        return user.subscriptionStatus === "paid" || user.subscriptionStatus === "trial"
    } catch (error) {
        console.error("Error checking subscription:", error)
        return false // Fail-safe: assume insufficient if check fails
    }
}