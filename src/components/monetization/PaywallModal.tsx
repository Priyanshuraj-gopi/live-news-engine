"use client";

import React, { useState } from "react";
import { activateSubscription, PaywallQuota } from "@/lib/monetization/engine";
import {
  Sparkles,
  CheckCircle,
  X,
  Shield,
  Zap,
  Volume2,
  Award,
  CreditCard,
  Crown,
} from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribed?: (quota: PaywallQuota) => void;
}

export function PaywallModal({
  isOpen,
  onClose,
  onSubscribed,
}: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated = activateSubscription(selectedPlan);
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        if (onSubscribed) onSubscribed(updated);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-card border border-primary/30 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-2 text-center pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-primary/20 text-primary text-xs font-bold border border-primary/30">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>ZEE MEDIA CITIZEN PRO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Elevate Your Reading Experience
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            You've reached your daily quota of 5 free ground dispatches. Unlock unrestricted multi-lingual intelligence.
          </p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Unlimited Briefs</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Zero daily reading caps across all 7 Indian languages.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>100% Ad-Free Wire</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Zero banner interruptions or sponsored cards.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Volume2 className="w-4 h-4 text-sky-500" />
              <span>Voice AI & Motion</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              High-fidelity Web Speech audio and HD Remotion video reels.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Award className="w-4 h-4 text-purple-500" />
              <span>Credibility Boost</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Instant Level 3 Contributor badge and fast-track debate entry.
            </p>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => setSelectedPlan("monthly")}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedPlan === "monthly"
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border bg-card hover:bg-muted/40"
            }`}
          >
            <div className="text-xs font-semibold text-muted-foreground">Monthly</div>
            <div className="text-2xl font-black text-foreground mt-1">₹99</div>
            <div className="text-[10px] text-muted-foreground">Billed monthly</div>
          </div>

          <div
            onClick={() => setSelectedPlan("annual")}
            className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
              selectedPlan === "annual"
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border bg-card hover:bg-muted/40"
            }`}
          >
            <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500 text-white shadow-sm">
              Save 33%
            </span>
            <div className="text-xs font-semibold text-muted-foreground">Annual Pass</div>
            <div className="text-2xl font-black text-foreground mt-1">₹799</div>
            <div className="text-[10px] text-muted-foreground">₹66 / month</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleSubscribe}
            disabled={isProcessing || success}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold text-sm shadow-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {success ? (
              <>
                <CheckCircle className="w-5 h-5 text-white" />
                <span>Citizen Pro Unlocked!</span>
              </>
            ) : isProcessing ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Activating Pro Pass...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Unlock Citizen Pro ({selectedPlan === "annual" ? "₹799/yr" : "₹99/mo"})</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-muted-foreground">
            Cancel anytime with 1-click. 100% money-back guarantee within 7 days.
          </p>
        </div>
      </div>
    </div>
  );
}
