import { NextResponse, NextRequest } from "next/server";
import { createCustomerPortal } from "@/lib/stripe";
import { auth } from "@/lib/next-auth"



export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const session = await auth();

        // User who are not logged in can't make a purchase
        if (!session) {
            return NextResponse.json(
                { error: "You must be logged in to view billing information." },
                { status: 401 }
            );
        } else if (!body.returnUrl) {
            return NextResponse.json(
                { error: "Return URL is required" },
                { status: 400 }
            );
        }

        const { data: user } = await fetch(`${process.env.WORKER_URL}/api/users?email=${session?.user?.email}`, {
            headers: {
                Authorization: `Bearer ${process.env.API_SECRET}`,
            },
        }).then((res) => res.json());
        if (!user.customer_id) {
            return NextResponse.json(
                {
                    error: "You don't have a billing account yet. Make a purchase first.",
                },
                { status: 400 }
            );
        }

        const stripePortalUrl = await createCustomerPortal({
            customerId: user.customer_id,
            returnUrl: body.returnUrl,
        });
        return NextResponse.json({
            url: stripePortalUrl,
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e?.message }, { status: 500 });
    }
}
