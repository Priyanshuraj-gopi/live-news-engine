"use client";

import React, { useState } from "react";
import { REGIONS_DATA, resolveRegionFromCoords, CityData } from "@/lib/region/config";
import { Region } from "@/types";
import { MapPin, Navigation, Check, X } from "lucide-react";

interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRegion: Region;
  onSelectRegion: (region: Region) => void;
}

export function RegionModal({ isOpen, onClose, currentRegion, onSelectRegion }: RegionModalProps) {
  const [selectedState, setSelectedState] = useState<string>(currentRegion.state);
  const [locating, setLocating] = useState<boolean>(false);

  if (!isOpen) return null;

  const states = Object.keys(REGIONS_DATA);
  const activeStateData = REGIONS_DATA[selectedState] || REGIONS_DATA["Delhi NCR"];

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const resolved = resolveRegionFromCoords(latitude, longitude);
        onSelectRegion(resolved);
        setLocating(false);
        onClose();
      },
      (error) => {
        console.warn("Geolocation error", error);
        setLocating(false);
        alert("Could not detect location. Please pick your city manually.");
      },
      { timeout: 8000 }
    );
  };

  const handleCitySelect = (city: CityData) => {
    onSelectRegion({
      country: "India",
      state: selectedState,
      city: city.name,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-base">Select Your Location</h2>
              <p className="text-xs text-muted-foreground">Hyperlocal news curated for your city</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Auto-detect banner */}
        <div className="p-4 border-b border-border bg-primary/5">
          <button
            onClick={handleUseGPS}
            disabled={locating}
            className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${locating ? "animate-spin" : ""}`} />
            <span>{locating ? "Detecting nearest city..." : "Auto-detect Nearest City (GPS)"}</span>
          </button>
        </div>

        {/* State and City Selector Columns */}
        <div className="grid grid-cols-2 flex-1 overflow-hidden divide-x divide-border">
          {/* States Column */}
          <div className="overflow-y-auto p-2 space-y-1">
            <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              States
            </p>
            {states.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  selectedState === st
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <span>{st}</span>
                {selectedState === st && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>

          {/* Cities Column */}
          <div className="overflow-y-auto p-2 space-y-1">
            <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cities in {selectedState}
            </p>
            {activeStateData.cities.map((city) => {
              const isSelected = currentRegion.city === city.name && currentRegion.state === selectedState;
              return (
                <button
                  key={city.name}
                  onClick={() => handleCitySelect(city)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <span>{city.name}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-muted/20 text-xs text-muted-foreground flex justify-between items-center">
          <span>Current: <strong className="text-foreground">{currentRegion.city}, {currentRegion.state}</strong></span>
          <button onClick={onClose} className="px-3 py-1 text-xs rounded-md border border-border hover:bg-muted">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
