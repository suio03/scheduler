'use client'
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@radix-ui/react-icons"
import { ConnectProviderButton, SocialProvider } from "./connect-provider-button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"

export function AccountsEmptyState() {
    const t = useTranslations("Accounts")
    const providers: SocialProvider[] = ["TikTok", "Youtube", "Instagram", "Facebook", "X"]

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
                    {t("pleaseConnectAccount")}
                </p>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="gap-1">
                            <PlusIcon className="h-4 w-4" />
                            {t("connectAccount")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                        <div className="p-2 flex flex-col gap-1">
                            <p className="px-2 py-1 text-sm font-medium text-muted-foreground">
                                {t("selectProvider")}
                            </p>
                            {providers.map((provider) => (
                                <ConnectProviderButton
                                    key={provider}
                                    provider={provider}
                                    onSuccess={(newAccount) => {
                                        window.location.reload();
                                    }}
                                />
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </CardFooter>
        </Card>
    )
} 