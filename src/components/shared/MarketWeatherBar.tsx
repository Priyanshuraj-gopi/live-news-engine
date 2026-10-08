"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { REGIONS_DATA } from "@/lib/region/config";

export function MarketWeatherBar() {
  const { region } = useAuth();
  const [usdInr, setUsdInr] = useState(86.85);
  const [temperature, setTemperature] = useState<number | null>(null);
  useEffect(() => { fetch("https://api.frankfurter.app/latest?from=USD&to=INR").then((r) => r.json()).then((d) => d?.rates?.INR && setUsdInr(Number(d.rates.INR))).catch(() => {}); }, []);
  useEffect(() => { const stateData = REGIONS_DATA[region.state] || REGIONS_DATA["Delhi NCR"]; const city = stateData.cities.find((item) => item.name.toLowerCase() === region.city.toLowerCase()) || stateData.cities[0]; if (!city) return; fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true`).then((r) => r.json()).then((d) => d?.current_weather?.temperature !== undefined && setTemperature(d.current_weather.temperature)).catch(() => {}); }, [region]);
  return <div className="market-strip"><Link href="/feed" className="breaking-label"><span className="status-pulse" /> BREAKING</Link><span className="breaking-copy">Live newsroom signal updates every 60 seconds</span><span>Market <strong>USD/INR ₹{usdInr.toFixed(2)}</strong></span>{temperature !== null && <span>{region.city}: <strong>{temperature}°C</strong></span>}<span className="market-note">Verified wire · refreshed automatically</span></div>;
}
