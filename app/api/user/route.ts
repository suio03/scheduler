import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/next-auth";
import prisma from "@/lib/prisma";



export async function GET(req: NextRequest) {
    // Check if the user is authenticated
    const session = await auth();
    // User who are not logged in can't access user data
    if (!session) {
        return NextResponse.json(
            { error: "Please login first!!" },
            { status: 401 }
        );
    }
    
    const userId = session?.user?.id;
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json(
            { error: "Please login first!!" },
            { status: 401 }
        );
    }
    
    const data = await req.json();
    const userId = session?.user?.id;
    
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data
        });
        
        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
