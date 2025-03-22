"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export type SocialProvider = "TikTok" | "Youtube" | "Instagram" | "Facebook" | "X (Twitter)"

interface ConnectProviderButtonProps {
    provider: SocialProvider
    onSuccess?: (account: {
        id: string
        platformType: string
        accountName: string
        platformAccountId: string
    }) => void
    clientKey?: string
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

export function ConnectProviderButton({ provider, onSuccess, clientKey }: ConnectProviderButtonProps) {
    const t = useTranslations("Accounts")
    const [isConnecting, setIsConnecting] = useState(false)
    
    const getProviderConfig = (provider: SocialProvider) => {
        switch(provider) {
            case "TikTok":
                return {
                    authUrl: "https://www.tiktok.com/v2/auth/authorize/",
                    scope: "user.info.basic,video.upload,user.info.profile,user.info.stats",
                    clientKeyEnv: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY,
                    callbackPath: "/tiktok-callback",
                    icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.321 5.562a5.122 5.122 0 0 1-5.121-5.121h-3.606v16.242c0 2.014-1.635 3.649-3.648 3.649a3.649 3.649 0 0 1-3.648-3.649 3.649 3.649 0 0 1 3.648-3.649c.37 0 .724.064 1.058.177v-3.738a7.364 7.364 0 0 0-1.058-.079A7.392 7.392 0 0 0 0 16.683a7.392 7.392 0 0 0 7.394 7.394 7.392 7.392 0 0 0 7.394-7.394V9.993a8.795 8.795 0 0 0 4.533 1.25V7.636a5.133 5.133 0 0 1-4.533-2.074z" />
                        </svg>
                    ),
                    usesPKCE: true
                }
            case "Youtube":
                return {
                    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
                    scope: "https://www.googleapis.com/auth/youtube.readonly",
                    clientKeyEnv: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_KEY,
                    callbackPath: "/youtube-callback",
                    icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                    ),
                    usesPKCE: false
                }
            case "Instagram":
                return {
                    authUrl: "https://api.instagram.com/oauth/authorize",
                    scope: "user_profile,user_media",
                    clientKeyEnv: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_KEY,
                    callbackPath: "/instagram-callback",
                    icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                        </svg>
                    ),
                    usesPKCE: false
                }
            case "Facebook":
                return {
                    authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
                    scope: "public_profile,pages_show_list",
                    clientKeyEnv: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_KEY,
                    callbackPath: "/facebook-callback",
                    icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    ),
                    usesPKCE: false
                }
            case "X (Twitter)":
                return {
                    authUrl: "https://twitter.com/i/oauth2/authorize",
                    scope: "tweet.read users.read",
                    clientKeyEnv: process.env.NEXT_PUBLIC_TWITTER_CLIENT_KEY,
                    callbackPath: "/twitter-callback",
                    icon: (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    ),
                    usesPKCE: true
                }
        }
    }

    const handleConnect = async () => {
        setIsConnecting(true)
        try {
            const config = getProviderConfig(provider)
            
            if (!config) {
                throw new Error(`Provider ${provider} is not supported yet`)
            }
            
            const actualClientKey = clientKey || config.clientKeyEnv || ""
            
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
            authUrl.searchParams.append("client_id", actualClientKey)
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
            onClick={handleConnect}
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
                config?.icon
            )}
            {t("connect")} {provider}
        </Button>
    )
} 