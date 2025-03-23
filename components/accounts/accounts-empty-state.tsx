import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectProviderButton } from "./connect-tiktok-button"

export function AccountsEmptyState() {
    const t = useTranslations("Accounts")

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t("noAccountsTitle")}</CardTitle>
                <CardDescription>{t("noAccountsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="rounded-full bg-muted p-6 mb-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </div>
                <p className="text-center text-sm text-muted-foreground max-w-md mb-6">
                    {t("connectAccountsPrompt")}
                </p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <ConnectProviderButton provider="TikTok" clientKey={process.env.TIKTOK_CLIENT_KEY || ""} />
            </CardFooter>
        </Card>
    )
} 