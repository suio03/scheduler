import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { AosInitializer } from '@/components/AosInitializer'
import Header from '@/components/dashboard/Header'
import Footer from '@/components/ui/footer'
import { Toaster } from 'react-hot-toast'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from "next-intl/server"
import { SessionProvider } from 'next-auth/react'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap'
})

const cabinet = localFont({
    src: [
        {
            path: '../../public/fonts/CabinetGrotesk-Medium.woff2',
            weight: '500',
        },
        {
            path: '../../public/fonts/CabinetGrotesk-Bold.woff2',
            weight: '700',
        },
        {
            path: '../../public/fonts/CabinetGrotesk-Extrabold.woff2',
            weight: '800',
        },
    ],
    variable: '--font-cabinet-grotesk',
    display: 'swap',
})

export const metadata = {
    title: 'Social Media Scheduler Dashboard',
    description: 'Manage your TikTok content with ease',
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const messages = await getMessages()
    return (
        <>
            <body className={`${inter.variable} ${cabinet.variable} font-inter antialiased bg-white text-gray-800 tracking-tight`}>
                <NextIntlClientProvider messages={messages}>
                    <SessionProvider>

                        <Header />
                        <AosInitializer />
                        <div className="flex flex-col min-h-screen overflow-hidden max-w-7xl mx-auto w-full rounded-xl">
                            {children}
                        </div>
                        <Footer />
                        <Toaster
                            position="top-center"
                            reverseOrder={false}
                            gutter={8}
                            containerStyle={{
                                top: 40,
                                left: 20,
                                right: 20,
                                bottom: 20,
                            }}
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: '#333',
                                    color: '#fff',
                                    maxWidth: '90vw',
                                    width: 'fit-content',
                                    padding: '12px 16px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    zIndex: 9999,
                                },
                                success: {
                                    style: {
                                        background: 'rgba(48, 151, 71, 0.9)',
                                    },
                                },
                                error: {
                                    style: {
                                        background: 'rgba(205, 50, 50, 0.9)',
                                    },
                                },
                            }}
                        />
                    </SessionProvider>
                </NextIntlClientProvider>
            </body>
        </>
    )
}
