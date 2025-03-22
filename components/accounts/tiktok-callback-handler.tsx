"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function TikTokCallbackHandler() {
    const t = useTranslations("Accounts")
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        const handleCallback = async () => {
            // Check if we're already processing to prevent multiple attempts
            if (isProcessing) return;
            
            const code = searchParams.get("code")
            const state = searchParams.get("state")
            const error = searchParams.get("error")
            const errorDescription = searchParams.get("error_description")

            // If there's no code or state, or if there's an error, do nothing
            if (!code || !state || error) {
                if (error) {
                    console.error("TikTok OAuth error:", error, errorDescription)
                    router.push(`/dashboard/accounts?error=${encodeURIComponent(errorDescription || error)}`)
                    toast.error(errorDescription || error || t("connectError"))
                }
                return
            }

            // Check if we're on the callback page
            if (window.location.pathname.includes("/tiktok-callback")) {
                // Check if this authorization code has been processed before
                const processedCodes = JSON.parse(localStorage.getItem("tiktok_processed_codes") || "[]")
                if (processedCodes.includes(code)) {
                    return
                }
                
                setIsProcessing(true)

                try {
                    // Get the stored state and code verifier from localStorage
                    const storedState = localStorage.getItem("tiktok_auth_state")
                    const codeVerifier = localStorage.getItem("tiktok_code_verifier")

                    
                    if (typeof window !== 'undefined') {
                        // Check what other auth-related items might be in localStorage
                        const localStorageKeys = Object.keys(localStorage)
                    }

                    // Verify the state parameter to prevent CSRF attacks
                    if (!storedState || state !== storedState) {
                        console.error("TikTok Auth DEBUG - State validation failed. Received:", state, "Stored:", storedState)
                        throw new Error("Invalid state parameter - possible CSRF attack")
                    }

                    if (!codeVerifier) {
                        console.error("TikTok Auth DEBUG - Code verifier not found in localStorage")
                        throw new Error("Code verifier not found")
                    }

                    // Get the redirect URI that was used for the authorization request
                    const redirectUri = `${window.location.origin}/tiktok-callback`

                    // Save this code as being processed
                    processedCodes.push(code)
                    localStorage.setItem("tiktok_processed_codes", JSON.stringify(processedCodes))

                    // Exchange the code for tokens - only attempt this once per code
                    const response = await fetch("/api/tiktok/auth/token", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            code,
                            state,
                            codeVerifier,
                            redirectUri
                        }),
                    })


                    if (!response.ok) {
                        const responseText = await response.text()
                        
                        try {
                            const errorData = JSON.parse(responseText)
                            throw new Error(errorData.error || "Failed to connect TikTok account")
                        } catch (parseError) {
                            throw new Error(`Failed to connect TikTok account: ${responseText}`)
                        }
                    }

                    // Only clear localStorage after successful token exchange
                    localStorage.removeItem("tiktok_auth_state")
                    localStorage.removeItem("tiktok_code_verifier")

                    // Redirect to the accounts page with success message
                    router.push("/dashboard/accounts?success=connected")
                    toast.success(t("connectSuccess"))
                } catch (error: any) {
                    console.error("Error handling TikTok callback:", error)
                    router.push(`/dashboard/accounts?error=${encodeURIComponent(error.message)}`)
                    toast.error(error.message || t("connectError"))
                } finally {
                    setIsProcessing(false)
                }
            }
        }

        handleCallback()
    }, [searchParams, router, t, isProcessing])

    // This component doesn't render anything
    return null
} 