import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/shared/Navbar";
import { MarketWeatherBar } from "@/components/shared/MarketWeatherBar";

export const metadata: Metadata = { title: "NewsEngine AI | Multilingual News Intelligence", description: "A calmer way to turn verified reporting into useful, multilingual news experiences." };
export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5, themeColor: "#f5f1eb" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><AuthProvider><Navbar /><MarketWeatherBar /><main>{children}</main><footer className="site-footer"><span>NewsEngine AI · Verified stories, useful formats.</span><span><a href="/terms">Terms</a> · <a href="/privacy">Privacy</a></span></footer></AuthProvider></body></html>;
}
