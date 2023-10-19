import "./globals.scss";
import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "AI Travel",
    description: "This website helps you personalize your travel plans.",
    keywords:
        "travel, ai-generator, trip, vacation, holiday, plan, itinerary, packing, list, checklist, ai, chatgpt, openai, nextjs, react, tailwindcss, vercel",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="main-body">
                    {children}
                    <Analytics />
                </div>
            </body>
        </html>
    );
}
