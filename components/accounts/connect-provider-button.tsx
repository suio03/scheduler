"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import tiktokIcon from "@/public/images/logo/tiktok.svg"
import instagramIcon from "@/public/images/logo/ins.svg"
import facebookIcon from "@/public/images/logo/facebook.svg"
import youtubeIcon from "@/public/images/logo/youtube.svg"
import twitterIcon from "@/public/images/logo/x.svg"

export type SocialProvider = "TikTok" | "Youtube" | "Instagram" | "Facebook" | "X"

interface ConnectProviderButtonProps {
    provider: SocialProvider
    onSuccess?: (account: {
        id: string
        platformType: string
        accountName: string
        platformAccountId: string
    }) => void
}

// Generate a random string for PKCE which is Required by TikTok for OAuth2
function generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let text = ''
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

// Create a code challenge from the code verifier
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    // Hash the code verifier using SHA-256
    const encoder = new TextEncoder()
    const data = encoder.encode(codeVerifier)
    const digest = await crypto.subtle.digest('SHA-256', data)

    // Convert the hash to base64-url format
    const base64 = btoa(
        Array.from(new Uint8Array(digest))
            .map(byte => String.fromCharCode(byte))
            .join('')
    )

    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
}

export function ConnectProviderButton({ provider, onSuccess }: ConnectProviderButtonProps) {
    const t = useTranslations("Accounts")
    const [isConnecting, setIsConnecting] = useState(false)
    const getProviderConfig = (provider: SocialProvider) => {
        switch (provider) {
            case "TikTok":
                return {
                    authUrl: "https://www.tiktok.com/v2/auth/authorize/",
                    scope: "user.info.basic,video.upload,user.info.profile,user.info.stats",
                    clientKeyEnv: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY,
                    callbackPath: "/tiktok-callback",
                    icon: tiktokIcon.src,
                    usesPKCE: true
                }
            case "Youtube":
                return {
                    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
                    scope: "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube",
                    clientKeyEnv: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_KEY,
                    callbackPath: "/youtube-callback",
                    icon: youtubeIcon.src,
                    usesPKCE: false
                }
            case "Instagram":
                return {
                    authUrl: "https://api.instag ram.com/oauth/authorize",
                    scope: "user_profile,user_media",
                    clientKeyEnv: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_KEY,
                    callbackPath: "/instagram-callback",
                    icon: instagramIcon.src,
                    usesPKCE: false
                }
            case "Facebook":
                return {
                    authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
                    scope: "public_profile,pages_show_list",
                    clientKeyEnv: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_KEY,
                    callbackPath: "/facebook-callback",
                    icon: facebookIcon.src,
                    usesPKCE: false
                }
            case "X":
                return {
                    authUrl: "https://twitter.com/i/oauth2/authorize",
                    scope: "tweet.read users.read",
                    clientKeyEnv: process.env.NEXT_PUBLIC_TWITTER_CLIENT_KEY,
                    callbackPath: "/twitter-callback",
                    icon: twitterIcon.src,
                    usesPKCE: true
                }
        }
    }

    const handleConnect = async (provider: SocialProvider) => {
        setIsConnecting(true)

        switch (provider) {
            case "TikTok":
                const logoutFrame = document.createElement('iframe')
                logoutFrame.style.display = 'none'
                logoutFrame.src = 'https://www.tiktok.com/logout'
                document.body.appendChild(logoutFrame)
                // Wait for the logout process to complete
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        // Clean up the iframe
                        if (document.body.contains(logoutFrame)) {
                            document.body.removeChild(logoutFrame)
                        }
                        resolve()
                    }, 3000) // Adjust timeout as needed
                })
                break
            default:
                break
        }
        try {
            const config = getProviderConfig(provider)
            if (!config) {
                throw new Error(`Provider ${provider} is not supported yet`)
            }

            const actualClientKey = config.clientKeyEnv || ""

            if (!actualClientKey) {
                throw new Error(`No client key available for ${provider}`)
            }

            // Generate a random state value for CSRF protection 
            const array = new Uint8Array(30)
            window.crypto.getRandomValues(array)
            const state = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')

            // Get the redirect URI from the current origin
            const redirectUri = `${window.location.origin}${config.callbackPath}`

            // Construct the authorization URL
            const authUrl = new URL(config.authUrl)

            // Add common OAuth parameters
            if (provider === "TikTok") {
                authUrl.searchParams.append("client_key", actualClientKey)
            }
            if (provider === "Youtube") {
                authUrl.searchParams.append("client_id", actualClientKey)
                authUrl.searchParams.append("access_type", "offline") // Request refresh token
                authUrl.searchParams.append("prompt", "consent")
            }

            authUrl.searchParams.append("redirect_uri", redirectUri)
            authUrl.searchParams.append("scope", config.scope)
            authUrl.searchParams.append("state", state)
            authUrl.searchParams.append("response_type", "code")

            // Store provider and state in localStorage
            localStorage.setItem(`${provider.toLowerCase().replace(/\s|\(|\)/g, '_')}_auth_state`, state)

            // Add PKCE parameters if the provider uses it
            if (config.usesPKCE) {
                const codeVerifier = generateRandomString(64)
                const codeChallenge = await generateCodeChallenge(codeVerifier)

                localStorage.setItem(`${provider.toLowerCase().replace(/\s|\(|\)/g, '_')}_code_verifier`, codeVerifier)

                authUrl.searchParams.append("code_challenge", codeChallenge)
                authUrl.searchParams.append("code_challenge_method", "S256")
            }
            // Redirect the user to the authorization page
            window.location.href = authUrl.toString()
        } catch (error) {
            console.error(`Error initiating ${provider} connection:`, error)
            toast.error(t("connectError"))
            setIsConnecting(false)
        }
    }

    const config = getProviderConfig(provider)

    return (
        <Button
            onClick={() => handleConnect(provider)}
            disabled={isConnecting}
            className="flex items-center gap-2"
            variant="outline"
            size="sm"
        >
            {isConnecting ? (
                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <img src={config?.icon} alt={provider} className="w-5 h-5" />
            )}
            {t("connect")} {provider}
        </Button>
    )
} 