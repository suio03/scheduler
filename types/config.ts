export type Theme =
    | "light"
    | "dark"
    | "cupcake"
    | "bumblebee"
    | "emerald"
    | "corporate"
    | "synthwave"
    | "retro"
    | "cyberpunk"
    | "valentine"
    | "halloween"
    | "garden"
    | "forest"
    | "aqua"
    | "lofi"
    | "pastel"
    | "fantasy"
    | "wireframe"
    | "black"
    | "luxury"
    | "dracula"
    | "";

export interface ConfigProps {
    appName: string;
    appDescription: string;
    domainName: string;
    stripe: {
        plans: {
            isFeatured?: boolean;
            planType?: string;
            priceId: string;
            name: string;
            description?: string;
            price: number;
            priceAnchor?: string;
            credits: number;
            features: {
                name: string;
            }[];
        }[];
        subscription: {
            name: string;
            credits: {
                monthly: number;
                yearly: number;
            };
            priceId: {
                monthly: string;
                yearly: string;
            }
        }[],
        oneTime: {
            name: string;
            priceId: string;
            credits: number;
        }[]
    };
    aws?: {
        bucket?: string;
        bucketUrl?: string;
        cdn?: string;
    };
    mailgun: {
        subdomain: string;
        fromNoReply: string;
        fromAdmin: string;
        supportEmail?: string;
        forwardRepliesTo?: string;
    };
    colors: {
        theme: Theme;
        main: string;
    };
    auth: {
        loginUrl: string;
        callbackUrl: string;
    };
}
