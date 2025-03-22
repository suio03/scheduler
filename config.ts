import { ConfigProps } from "./types/config";

const config = {
    // REQUIRED
    appName: "AI Music Generator",
    // REQUIRED: a short description of your app for SEO tags (can be overwritten)
    appDescription:
        "Experience the future of image generation with Red Panda Image Generator. Create stunning images from text in seconds. Start creating for free!",
    // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
    domainName: "muzix.app",
    stripe: {
        // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
        subscription: [
            {
                name: "Virtuoso",
                credits: {
                    monthly: 200,
                    yearly: 2400,
                },
                priceId: {
                    // development
                    // monthly: "price_1QVw4WGIX0AH0IWOCBdQDRuM",
                    // yearly: "price_1QVw4BGIX0AH0IWO3AeX3xFd",
                    // production
                    monthly: "price_1QVyVWGIX0AH0IWOiRSGE1OT",
                    yearly: "price_1QVyVcGIX0AH0IWOatuYPOsy",
                }
            },
            {
                name: "Maestro",
                credits: {
                    monthly: 1000,
                    yearly: 12000,
                },
                priceId: {
                    // development
                    // monthly: "price_1QVw2QGIX0AH0IWOBysKytoq",
                    // yearly: "price_1QVw3dGIX0AH0IWOeCF3ipcB",
                    // production
                    monthly: "price_1QVyVkGIX0AH0IWO5OUEgEkA",
                    yearly: "price_1QVyVgGIX0AH0IWOsKJCP0nF",
                }
            }
        ],
        oneTime: [
            {
                name: "Pro Pack",
                // development
                // priceId: "price_1QedpIGIX0AH0IWOpROFDtDM",
                // production
                priceId: "price_1QeeEGGIX0AH0IWObaJdeD1y",
                credits: 500,
            },
            {
                name: "Extra Pack",
                // development
                // priceId: "price_1QedcsGIX0AH0IWOMfnIbe6W",
                // production
                priceId: "price_1QeeEJGIX0AH0IWOQV0uhnq6",
                credits: 200,
            }
        ]
    },
    aws: {
        // If you use AWS S3/Cloudfront, put values in here
        bucket: "bucket-name",
        bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
        cdn: "https://cdn-id.cloudfront.net/",
    },
    mailgun: {
        // subdomain to use when sending emails, if you don't have a subdomain, just remove it. Highly recommended to have one (i.e. mg.yourdomain.com or mail.yourdomain.com)
        subdomain: "lyl",
        // REQUIRED — Email 'From' field to be used when sending magic login links
        fromNoReply: `Suno Downloader <>`,
        // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
        fromAdmin: `Suno Downloader <>`,
        // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
        supportEmail: "support@sunodownloader.io",
        // When someone replies to supportEmail sent by the app, forward it to the email below (otherwise it's lost). If you set supportEmail to empty, this will be ignored.
        forwardRepliesTo: "laughinglyl90@gmail.com",
    },
    colors: {
        // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
        theme: "light",
        // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
        // OR you can just do this to use a custom color: main: "#f37055". HEX only.
        main: "",
    },
    auth: {
        // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
        loginUrl: "/signin",
        // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
        callbackUrl: "/",
    },
} as ConfigProps;

export default config;
