"use client"

import Link from "next/link"
import SignInModal from "@/components/sign-modal"
import LanSwitcher from "../lan-switcher"
import ButtonSignin from "../button/button-sign"
import { useTranslations } from "next-intl"
import Logo from "@/public/images/logo.svg"
const cta: JSX.Element = <ButtonSignin />

// Add this interface above the Header component
interface ToolMenuItem {
    href: string
    icon: React.ReactNode
    title: string
    description: string
}

export default function Header() {
    const t = useTranslations('header')

    return (
        <header className="z-30 mt-2 w-full md:mt-5">
            <div className="mx-auto max-w-6xl px-2">
                <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-indigo-900/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-sm">
                    {/* Site branding */}
                    <div className="flex flex-1 items-center">
                        <img src={Logo.src} alt="Logo" className="w-16 h-16" />
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex md:grow">
                        {/* Desktop menu links */}
                        <ul className="flex grow flex-wrap items-center justify-center gap-4 text-sm lg:gap-8">
                            <li>
                                <Link
                                    href="/pricing"
                                    className="flex items-center px-2 py-1 text-gray-200 transition hover:text-indigo-500 lg:px-3"
                                >
                                    {t('pricing')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/discover"
                                    className="flex items-center px-2 py-1 text-gray-200 transition hover:text-indigo-500 lg:px-3"
                                >
                                    {t('discover')}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center px-2 py-1 text-gray-200 transition hover:text-indigo-500 lg:px-3"
                                >
                                    Dashboard
                                </Link>
                            </li>

                        </ul>
                    </nav>
                    {/* Desktop sign in links */}
                    <ul className="flex flex-1 items-center justify-end gap-3">
                        <div className="flex justify-end flex-1">{cta}</div>
                        <LanSwitcher />
                    </ul>
                </div>
            </div>
            <dialog id="sign-in" className="modal rounded-3xl">
                <SignInModal />
            </dialog>
        </header>
    )
}
