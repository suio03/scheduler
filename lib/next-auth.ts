import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import prisma from "./prisma";

interface CustomToken extends JWT {
    id: string;
}
const useSecure = process.env.NODE_ENV === 'production' || process.env.NEXTAUTH_URL?.startsWith('https');
const baseUrl = process.env.NEXTAUTH_URL || (useSecure ? 'https://localhost:3000' : 'http://localhost:3000');

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            authorization: {
                params: {
                    redirect_uri: `${baseUrl}/api/auth/callback/google`
                },
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google" && profile?.email && profile?.sub) {
                try {
                    // Create or update user with a single upsert operation
                    await prisma.user.upsert({
                        where: { id: profile.sub },
                        update: {
                            name: profile.name,
                            image: profile.picture,
                            emailVerified: new Date(),
                        },
                        create: {
                            id: profile.sub,
                            email: profile.email,
                            name: profile.name,
                            image: profile.picture,
                            emailVerified: new Date(),
                            subscriptionStatus: "FREE",
                        }
                    });
                    
                    return true;
                } catch (error) {
                    console.error("Error during sign in:", error);
                    return false;
                }
            }
            return true;
        },
        jwt({ token, user, account, profile }): CustomToken {
            if (user && profile) {
                token.id = profile.sub as string;
            }
            return token as CustomToken;
        },
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = (token as CustomToken).id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/signin",
        // error: '/auth/error', // Error code passed in query string as ?error=
        // signOut: '/auth/signout'
    },
    // You can define custom theme options here if needed
    // theme: {
    //   colorScheme: "auto", // "auto" | "dark" | "light"
    //   brandColor: "", // Hex color code
    //   logo: "" // Absolute URL to image
    // },
});
