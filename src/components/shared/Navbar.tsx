"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/config";
import { RegionModal } from "./RegionModal";

const channels = ["India", "World", "Business", "Technology", "Sports", "Entertainment"];

export function Navbar() {
  const pathname = usePathname();
  const { language, region, setLanguage, setRegion } = useAuth();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [{ href: "/", label: "Home" }, { href: "/feed", label: "Live feed" }, { href: "/games", label: "Games" }, { href: "/debate", label: "Debate" }, { href: "/upload", label: "Submit" }];
  const currentLanguage = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES.en;

  return <header className="editorial-nav">
    <div className="utility-strip"><span>NewsEngine live desk</span><span>Purposeful journalism · multilingual by design</span><span className="utility-right">{region.city || "India"} · {currentLanguage.nativeName}</span></div>
    <div className="nav-inner"><Link href="/" className="brand" aria-label="Zee News home"><Image src="/logo.png" alt="Zee News" width={739} height={415} priority className="site-logo" /><span className="brand-caption"><strong>NewsEngine</strong><small>Live newsroom</small></span></Link><nav className="desktop-nav">{links.map((link) => <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""}>{link.label}</Link>)}</nav><div className="nav-controls"><button className="nav-control" onClick={() => setRegionOpen(true)}>{region.city || "India"}</button><div className="nav-dropdown"><button className="nav-control" aria-expanded={languageOpen} onClick={() => setLanguageOpen(!languageOpen)}>{currentLanguage.nativeName} <span className={`dropdown-chevron ${languageOpen ? "open" : ""}`} aria-hidden="true">⌄</span></button>{languageOpen && <div className="nav-menu">{Object.values(SUPPORTED_LANGUAGES).map((item) => <button key={item.code} onClick={() => { setLanguage(item.code); setLanguageOpen(false); }}>{item.nativeName}<small>{item.name}</small></button>)}</div>}</div><button className="menu-trigger" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? "Close" : "Menu"}</button></div></div>
    <nav className="channel-nav" aria-label="News categories">{channels.map((channel, index) => <Link key={channel} href={`/feed?category=${channel.toLowerCase()}`} className={index === 0 ? "channel-active" : ""}>{channel}</Link>)}<Link href="/feed" className="channel-live"><span className="status-pulse" /> Live wire</Link></nav>
    {menuOpen && <div className="mobile-nav">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}{channels.map((channel) => <Link key={channel} href={`/feed?category=${channel.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{channel}</Link>)}</div>}
    <RegionModal isOpen={regionOpen} onClose={() => setRegionOpen(false)} currentRegion={region} onSelectRegion={setRegion} />
  </header>;
}
