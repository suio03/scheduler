import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { YouTubeCallbackHandler } from "@/components/accounts/youtube-callback-handler"

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Accounts")

    return {
        title: t("connectingAccount"),
        description: t("connectingAccountDescription"),
    }
}

export default function YouTubeCallbackPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Connecting YouTube Account</h1>
                <p className="text-muted-foreground">Please wait while we complete the connection...</p>
                <YouTubeCallbackHandler />
            </div>
        </div>
    )
} 