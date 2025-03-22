"use client"
import Link from "next/link"
import { useState } from "react"
import { signIn } from 'next-auth/react'
import { useTranslations } from "next-intl"
import { XMarkIcon } from "@heroicons/react/24/outline"

export const runtime = 'edge'
export default function Login() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const t = useTranslations('signin')

    const handleLogin = async (provider: string) => {
        setIsLoading(true)
        try {
            const result = await signIn(provider, { redirect: false })
            if (result?.error) {
                console.error('Login failed:', result.error)
            }
        } catch (error) {
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        const dialog = document.getElementById('sign-in') as HTMLDialogElement
        if (dialog) {
            dialog.close()
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <main className="relative w-full max-w-md mx-4 p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#1A1B26] to-[#232432] shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]">
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 transition-colors group"
                    aria-label="Close dialog"
                >
                    <XMarkIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-200" />
                </button>

                {/* Home Link */}
                <div className="text-center mb-6">
                    <Link
                        href="/" 
                        className="inline-flex items-center px-4 py-2 text-gray-200 hover:text-gray-50 transition-colors"
                    >
                        <svg
                            className="fill-blue-500 group-hover:fill-blue-600 transition duration-150 ease-in-out w-8 h-8"
                            width="32"
                            height="32"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m7.799 4.47.325.434a19.264 19.264 0 0 0 4.518 4.204l.27.175-.013.257a17.638 17.638 0 0 1-.437 2.867l-.144.564a18.082 18.082 0 0 1-2.889 5.977c2.272.245 4.492.88 6.5 1.886 1.601.788 3.062 1.798 4.344 2.972l.142.135-.017.232a17.034 17.034 0 0 0 1.227 7.504l-.724.323c-1.555-2.931-4.113-5.287-7.19-6.632-3.075-1.351-6.602-1.622-9.857-.844-.822.194-1.532.094-2.146-.183a3.138 3.138 0 0 1-1.29-1.146l-.076-.133-.078-.154-.085-.201a2.893 2.893 0 0 1-.095-1.694c.174-.624.55-1.2 1.239-1.67 2.734-1.85 4.883-4.537 5.944-7.68.704-2.076.925-4.32.633-6.545l-.101-.647Zm4.674-.284.16.2a15.87 15.87 0 0 0 5.629 4.322c3.752 1.76 8.363 2.075 12.488.665.419-.14.78-.044 1.002.158l.106.12.066.11.026.063c.125.33.024.751-.4.994-3.404 1.905-5.92 5.05-6.98 8.573a13.967 13.967 0 0 0 .727 10.055l.241.484-.724.323c-.913-2.227-2.326-4.302-4.12-6.05l-.28-.262.026-.305a16.667 16.667 0 0 1 1.121-4.652l.206-.488c1.05-2.443 2.676-4.59 4.664-6.293-3.064.442-6.273.17-9.243-.858a19.036 19.036 0 0 1-4.072-1.93l-.204-.132.017-.322a18.337 18.337 0 0 0-.415-4.605l-.04-.17ZM10.957 0a18.125 18.125 0 0 1 1.424 3.792l.092.394-.174-.219A14.803 14.803 0 0 1 10.235.322L10.957 0ZM7.046 1.746c.277.725.494 1.463.653 2.206l.1.519-.012-.016a17.99 17.99 0 0 1-1.203-1.891l-.262-.495.724-.323Z" />
                        </svg>
                        {t('home')}
                    </Link>
                </div>

                {/* Sign In Text */}
                <p className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-50 text-center mb-12">
                    {t('signin')}
                </p>

                {/* Sign In Button Container */}
                <div className="space-y-8 max-w-xl mx-auto">
                    <button
                        onClick={() => handleLogin('google')}
                        disabled={isLoading}
                        className="w-full relative disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center py-3 px-6 rounded-lg bg-white/5">
                                <div className="w-5 h-5 border-2 border-gray-200/20 border-t-purple-500 rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="w-full flex items-center justify-center gap-3 px-6 py-3 
                                rounded-xl bg-white hover:bg-gray-50 
                                border border-gray-200/20
                                shadow-lg shadow-purple-500/10 
                                transition-all duration-200 
                                hover:shadow-purple-500/20"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="text-gray-800 font-medium">
                                    {t('signup')}
                                </span>
                            </div>
                        )}
                    </button>
                </div>
            </main>
        </div>
    )
}
