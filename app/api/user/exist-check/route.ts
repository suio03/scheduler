import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";



export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
        return NextResponse.json(
            { error: "User ID parameter is required" },
            { status: 400 }
        );
    }
    
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                subscriptionStatus: true
            }
        });
        
        if (!user) {
            return NextResponse.json(
                { exists: false },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ 
            exists: true,
            user
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}