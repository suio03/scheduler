import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import configFile from "@/config";
import { findCheckoutSession } from "@/lib/stripe";

export const dynamic = 'force-dynamic';

// Initialize Stripe only if the API key is available
// This prevents errors during build time
const getStripeClient = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    console.warn("Stripe API key not found");
    return null;
  }
  
  return new Stripe(apiKey, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });
};

// Create stripe client lazily only when needed
let stripeClient: Stripe | null = null;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Helper function to find plan details from both plans and subscriptions
const findPlanDetails = (priceId: string) => {
    // Check subscription plans
    for (const sub of configFile.stripe.subscription) {
        if (sub.priceId.monthly === priceId) {
            return {
                ...sub,
                isYearly: false,
                credits: sub.credits.monthly,
                type: 'subscription'
            };
        }
        if (sub.priceId.yearly === priceId) {
            return {
                ...sub,
                isYearly: true,
                credits: sub.credits.yearly,
                type: 'subscription'
            };
        }
    }

    // Check one-time plans
    const oneTimePlan = configFile.stripe.oneTime.find(plan => plan.priceId === priceId);
    if (oneTimePlan) {
        return {
            ...oneTimePlan,
            type: 'oneTime'
        };
    }

    return null;
};

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = headers().get("stripe-signature");
    
    // Initialize Stripe client if not already done
    if (!stripeClient) {
        stripeClient = getStripeClient();
    }
    
    // If Stripe client couldn't be initialized, return an error
    if (!stripeClient) {
        console.error("Stripe client not initialized - missing API key");
        return NextResponse.json(
            { error: "Stripe client not initialized" },
            { status: 500 }
        );
    }

    let eventType;
    let event;

    // verify Stripe event is legit
    try {
        event = await stripeClient.webhooks.constructEventAsync(
            body,
            signature || "",
            webhookSecret || ""
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed. ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    eventType = event.type;

    try {
        switch (eventType) {
            case "checkout.session.completed": {
                try {
                    const stripeObject: Stripe.Checkout.Session = event.data
                        .object as Stripe.Checkout.Session;

                    const session = await findCheckoutSession(stripeObject.id);
                    const email = session?.customer_email || session?.customer_details?.email;
                    const customerId = session?.customer;
                    const priceId = session?.line_items?.data[0]?.price?.id;
                    if (!email) {
                        console.error('No email found in session:', session);
                        break;
                    }

                    if (!priceId) {
                        console.error('No priceId found in session:', session);
                        break;
                    }

                    const plan = findPlanDetails(priceId);
                    if (!plan) {
                        console.error('No plan found for priceId:', priceId);
                        break;
                    }

                    // Add error handling for the fetch request
                    const response = await fetch(
                        `${process.env.WORKER_URL}/api/users?email=${email}`, 
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${process.env.API_SECRET}`,
                            },
                        }
                    );

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('User fetch failed:', {
                            status: response.status,
                            statusText: response.statusText,
                            body: errorText
                        });
                        throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
                    }

                    const userData = await response.json();
                    const user = userData.data;
                    if (!user) {
                        // Create new user if they don't exist
                        const createResponse = await fetch(`${process.env.WORKER_URL}/api/users`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${process.env.API_SECRET}`,
                            },
                            body: JSON.stringify({
                                email,
                                has_access: true,
                                customer_id: customerId,
                                price_id: priceId,
                                credits: plan.credits,  // Start with initial plan credits
                            }),
                        });

                        if (!createResponse.ok) {
                            const errorText = await createResponse.text();
                            console.error('User creation failed:', {
                                status: createResponse.status,
                                statusText: createResponse.statusText,
                                body: errorText
                            });
                            throw new Error(`Failed to create user: ${createResponse.status} ${createResponse.statusText}`);
                        }
                    } else {
                        // Update existing user
                        const updateCredits = (user.credits || 0) + plan.credits;
                        const updateResponse = await fetch(`${process.env.WORKER_URL}/api/users`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${process.env.API_SECRET}`,
                            },
                            body: JSON.stringify({
                                id: user.id,
                                has_access: true,
                                customer_id: customerId,
                                price_id: priceId,
                                credits: updateCredits,
                            }),
                        });

                        if (!updateResponse.ok) {
                            const errorText = await updateResponse.text();
                            console.error('User update failed:', {
                                status: updateResponse.status,
                                statusText: updateResponse.statusText,
                                body: errorText
                            });
                            throw new Error(`Failed to update user: ${updateResponse.status} ${updateResponse.statusText}`);
                        }
                    }

                } catch (error) {
                    console.error('Error in checkout.session.completed:', error);
                    // Don't throw the error - we want to return a 200 to Stripe
                    // but log it for debugging
                }
                break;
            }

            case "checkout.session.expired": {
                // User didn't complete the transaction
                // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance

                // TODO: need to active this when production
                // const stripeObject: Stripe.Checkout.Session = event.data
                //     .object as Stripe.Checkout.Session;

                // const session = await findCheckoutSession(stripeObject.id);
                // const email = session?.customer_details;
                // const toEmail = { to: email.email };
                // try {
                //     await sendCoupon(toEmail);
                // } catch (e) {
                //     console.error("Email issue:" + e?.message);
                // }
                break;
            }
            // TODO: need to active this when people subscription is updated
            case "customer.subscription.updated": {
                // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
                // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
                // You can update the user data to show a "Cancel soon" badge for instance
                break;
            }

            case "customer.subscription.deleted": {
                // The customer subscription stopped
                // ❌ Revoke access to the product
                const stripeObject: Stripe.Subscription = event.data
                    .object as Stripe.Subscription;
                const subscription = await stripeClient.subscriptions.retrieve(
                    stripeObject.id
                );
                const stripeCustomerId = subscription.customer as string;
                try {
                    const user = await fetch(`${process.env.WORKER_URL}/api/user/stripe/${stripeCustomerId}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${process.env.API_SECRET}`,
                        },
                    }).then((res) => res.json());

                    if (!user) {
                        console.error(
                            `No user found with customer ID: ${stripeCustomerId}`
                        );
                        break;
                    }

                    await fetch(`${process.env.WORKER_URL}/api/users`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${process.env.API_SECRET}`,
                        },
                        body: JSON.stringify({
                            id: user.id,
                            has_access: false,
                            credits: 0,
                            price_id: null,
                        }),
                    });

                } catch (e: any) {
                    console.error("Error revoking access: ", e.message);
                }
                break;
            }

            case "invoice.paid": {
                // Customer just paid an invoice (for instance, a recurring payment for a subscription)
                // ✅ Grant access to the product
                const stripeObject: Stripe.Invoice = event.data
                    .object as Stripe.Invoice;
                const priceId = stripeObject.lines.data[0]?.price?.id;
                const customerId = stripeObject.customer;
                
                
                const plan = findPlanDetails(priceId || "");
                
                if (!plan) {
                    console.error('No plan found for price ID:', priceId);
                    break;
                }

                const userResponse = await fetch(`${process.env.WORKER_URL}/api/user/stripe/${customerId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.API_SECRET}`,
                    },
                });
                
                const user = await userResponse.json();
                if (!user) {
                    console.error('No user found for customer:', customerId);
                    break;
                }

                // Make sure the invoice is for the same plan (priceId) the user subscribed to
                if (user.price_id !== priceId) {
                    break;
                }

                // Update user with new credits
                await fetch(`${process.env.WORKER_URL}/api/users`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.API_SECRET}`,
                    },
                    body: JSON.stringify({
                        id: user.id,
                        has_access: true,
                        credits: plan.credits,
                    }),
                });

                break;
            }

            case "invoice.payment_failed":
                // A payment failed (for instance the customer does not have a valid payment method)
                // ❌ Revoke access to the product
                // ⏳ OR wait for the customer to pay (more friendly):
                //      - Stripe will automatically email the customer (Smart Retries)
                //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

                break;

            default:
            // Unhandled event type
        }
    } catch (e: any) {
        console.error("stripe error: ", e.message);
    }

    return NextResponse.json({});
}
