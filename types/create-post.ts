
import facebook from "@/public/images/logo/facebook.svg"
import instagram from "@/public/images/logo/ins.svg"
import tiktok from "@/public/images/logo/tiktok.svg"
import youtube from "@/public/images/logo/youtube.svg"
import x from "@/public/images/logo/x.svg"

export type PlatformType =
    | "TIKTOK"
    | "INSTAGRAM"
    | "YOUTUBE"
    | "FACEBOOK"
    | "X"

export interface Platform {
    id: PlatformType;
    name: string;
    icon: string;
    color: string;
    maxCaptionLength: number;
    supportsHashtags: boolean;
    supportsMultipleMedia: boolean;
    supportedMediaTypes: string[];
}

export interface Account {
    id: string;
    platformType: PlatformType;
    username: string;
    profilePicture?: string;
    isConnected: boolean;
}

export const PLATFORMS: Platform[] = [
    {
        id: "TIKTOK",
        name: "TikTok",
        icon: tiktok.src,
        color: "#000000",
        maxCaptionLength: 2200,
        supportsHashtags: true,
        supportsMultipleMedia: false,
        supportedMediaTypes: ["video/mp4", "video/quicktime"],
    },
    {
        id: "INSTAGRAM",
        name: "Instagram Reels",
        icon: instagram.src,
        color: "#E1306C",
        maxCaptionLength: 2200,
        supportsHashtags: true,
        supportsMultipleMedia: true,
        supportedMediaTypes: [
            "image/jpeg",
            "image/png",
            "video/mp4",
            "video/quicktime",
        ],
    },
    {
        id: "YOUTUBE",
        name: "YouTube Shorts",
        icon: youtube.src,
        color: "#FF0000",
        maxCaptionLength: 5000,
        supportsHashtags: true,
        supportsMultipleMedia: false,
        supportedMediaTypes: ["video/mp4", "video/quicktime"],
    },
    {
        id: "FACEBOOK",
        name: "Facebook",
        icon: facebook.src,
        color: "#1877F2",
        maxCaptionLength: 63206,
        supportsHashtags: true,
        supportsMultipleMedia: true,
        supportedMediaTypes: [
            "image/jpeg",
            "image/png",
            "video/mp4",
            "video/quicktime",
        ],
    },
    {
        id: "X",
        name: "X",
        icon: "🐦",
        color: "#1DA1F2",
        maxCaptionLength: 280,
        supportsHashtags: true,
        supportsMultipleMedia: true,
        supportedMediaTypes: ["image/jpeg", "image/png", "video/mp4"],
    }
];

// Mock accounts for demonstration
export const MOCK_ACCOUNTS: Account[] = [
    {
        id: "1",
        platformType: "TIKTOK",
        username: "company_official",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=CO",
        isConnected: true,
    },
    {
        id: "2",
        platformType: "TIKTOK",
        username: "marketing_account",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=MA",
        isConnected: true,
    },
    {
        id: "3",
        platformType: "INSTAGRAM",
        username: "company.official",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=CO",
        isConnected: true,
    },
    {
        id: "4",
        platformType: "YOUTUBE",
        username: "Company Channel",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=CC",
        isConnected: true,
    },
    {
        id: "5",
        platformType: "YOUTUBE",
        username: "Marketing Videos",
        profilePicture: "https://api.dicebear.com/7.x/initials/svg?seed=MV",
        isConnected: true,
    },
];

export function getPlatform(id: PlatformType): Platform | undefined {
    return PLATFORMS.find((platform) => platform.id === id);
}

export function getLowestCaptionLimit(accounts: Account[]): number {
    if (accounts.length === 0) return 5000;

    const platformIds = accounts.map((account) => account.platformType);
    const uniquePlatforms = Array.from(new Set(platformIds));
    const platforms = uniquePlatforms
        .map((id) => getPlatform(id))
        .filter(Boolean) as Platform[];

    return Math.min(...platforms.map((platform) => platform.maxCaptionLength));
}

export function getAccountsByPlatform(): Record<PlatformType, Account[]> {
    return MOCK_ACCOUNTS.reduce((grouped, account) => {
        if (!grouped[account.platformType]) {
            grouped[account.platformType] = [];
        }
        grouped[account.platformType].push(account);
        return grouped;
    }, {} as Record<PlatformType, Account[]>);
}
