"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"

// This component is used to create Stripe Checkout Sessions
// It calls the /api/stripe/create-checkout route with the priceId, successUrl and cancelUrl
// Users must be authenticated. It will prefill the Checkout data with their email and/or credit card (if any)
// You can also change the mode to "subscription" if you want to create a subscription instead of a one-time payment
const ButtonCheckout = ({
    priceId,
    mode = "subscription",
    extraStyle,
    children,
    planName
}: {
    priceId: string
    mode?: "payment" | "subscription"
    extraStyle?: string
    children: React.ReactNode
    planName: string
}) => {
    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const t = useTranslations("stripe")
    const handlePayment = async () => {
        if (planName === "Free") {
            window.location.href = "/"
            return
        }
        if (!priceId) return // Guard clause for empty priceId
        
        setIsLoading(true)
        try {
            const response = await fetch("/api/stripe/create-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    priceId,
                    mode,
                    successUrl: window.location.href,
                    cancelUrl: window.location.href,
                }),
            })

            if (!response.ok) {
                if (response.status === 401) {
                    (document.getElementById('sign-in') as HTMLDialogElement)?.showModal()
                    return
                }
                throw new Error('Payment initialization failed')
            }

            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch (e) {
            console.error('Payment error:', e)
            // You might want to show an error toast here
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            className={`${extraStyle} relative`}
            onClick={handlePayment}
            disabled={isLoading || !priceId}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Loading...</span>
                </div>
            ) : (
                <>{children}</>
            )}
        </button>
    )
}

export default ButtonCheckout
