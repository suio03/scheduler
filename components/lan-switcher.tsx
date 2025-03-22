'use client'
import { Fragment } from 'react'
import { usePathname } from 'next/navigation'
import { LanguageIcon } from '@heroicons/react/24/outline'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const languages = [
    { name: 'English', href: '/en', locale: 'en', country: '🇺🇲' },
    { name: '日本語', href: '/jp', locale: 'jp', country: '🇯🇵' },
    { name: ' 中文', href: '/ch', locale: 'ch', country: '🇨🇳' },
    { name: '한국어', href: '/ko', locale: 'ko', country: '🇰🇷' },
    // 西班牙语
    { name: 'Español', href: '/es', locale: 'es', country: '🇪🇸' },
    // 法语
    { name: 'Français', href: '/fr', locale: 'fr', country: '🇫🇷' },
    // 德语
    { name: 'Deutsch', href: '/de', locale: 'de', country: '🇩🇪' },
    // 意大利语
    { name: 'Italiano', href: '/it', locale: 'it', country: '🇮🇹' },
    // 葡萄牙语
    { name: 'Português', href: '/pt', locale: 'pt', country: '🇵🇹' },
    // 俄语
    { name: 'Русский', href: '/ru', locale: 'ru', country: '🇷🇺' },
    // 阿拉伯语
    { name: 'العربية', href: '/ar', locale: 'ar', country: '🇸🇦' },
    // 印地语
    { name: 'हिंदी', href: '/hi', locale: 'hi', country: '🇮🇳' },
    { name: 'Nederlands', href: '/nl', locale: 'nl', country: '🇳🇱' },
]

export default function LanSwitcher() {
    const pathname = usePathname();
    const pathItems = pathname.split('/').filter(item => item !== '');
    // Default locale
    let currentLocale = 'EN';
    let toPath = '';

    if (pathname === '/') {
        toPath = '';
    } else if (pathItems.length === 1) {
        const [firstItem] = pathItems;
        if (isLocale(firstItem)) {
            currentLocale = firstItem.toUpperCase();
        } else {
            toPath = firstItem;
        }
    } else {
        const [firstItem, ...restItems] = pathItems;
        if (isLocale(firstItem)) {
            currentLocale = firstItem.toUpperCase();
            toPath = restItems.join('/');
        } else {
            currentLocale = 'EN';
            toPath = pathItems.join('/');
        }
    }
    
    function isLocale(item: string) {
        return /^[a-z]{2}$/.test(item);  // Checks for two lowercase letters only
    }
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-slate-100 focus:outline-none">
                <LanguageIcon className="h-5 w-5" />
                <span className='text font-light font-mono mr-1'>{currentLocale}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="start" 
                className="w-48 max-h-60 overflow-auto"
            >
                {languages.map((item, index) => (
                    <DropdownMenuItem key={index} asChild>
                        <a 
                            className="cursor-pointer flex items-center gap-2 py-2 px-3 hover:text-indigo-600" 
                            href={`/${item.locale}/${toPath}`}
                        >
                            <span>{item.country}</span> <span>{item.name}</span>
                        </a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
