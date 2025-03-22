/* eslint-disable @next/next/no-img-element */
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import ButtonAccount from "./button-account"

// It automatically redirects user to callbackUrl (config.auth.callbackUrl) after login, which is normally a private page for users to manage their accounts.
// If the user is already logged in, it will show their profile picture & redirect them to callbackUrl immediately.
const ButtonSignin = () => {
    const t = useTranslations('header')
    const session = useSession()
    if (session.status === "authenticated") {
        return (
            <ButtonAccount />
        )
    }


    return (
        <div>
            <button
                className="cursor-pointer bg-indigo-900 px-4 py-2 rounded-xl text-white tracking-wider shadow-xl hover:bg-indigo-950 hover:scale-105 duration-500 hover:ring-1 font-mono text-center inline-block min-w-fit whitespace-nowrap"
                onClick={() => (document.getElementById('sign-in') as HTMLDialogElement).showModal()}
            >
                {t('signin')}
            </button>
        </div>
    )
}

export default ButtonSignin