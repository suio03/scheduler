import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User {
        id: string;
        fullName: string;
        email: string;
        avatarUrl: string;
        createdAt: string;
        credits: number;
        customerId: string | null;
        free: number;
        hasAccess: boolean;
        priceId: string | null;
        // Add any other properties you see in your user object
    }

    interface Session {
        user: {
            /** The user's id. */
            id: string;
        } & DefaultSession["user"];
    }
}
