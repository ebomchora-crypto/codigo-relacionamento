"use client";

import { useEffect, useRef, useState } from "react";
import ResultHero from "@/components/results/ResultHero";
import PainBridge from "@/components/offer/PainBridge";
import ChatExample from "@/components/offer/ChatExample";
import BenefitsGrid from "@/components/offer/BenefitsGrid";
import SocialProof from "@/components/offer/SocialProof";
import PricingOffer from "@/components/offer/PricingOffer";
import FaqAccordion from "@/components/offer/FaqAccordion";
import FinalCta from "@/components/offer/FinalCta";
import StickyCta from "@/components/offer/StickyCta";
import SiteFooter from "@/components/SiteFooter";
import { RESULT_PROFILES } from "@/data/results";
import { trackViewContent } from "@/lib/analytics/events";
import type { Dimension, ScoreBreakdown } from "@/types/quiz";

export default function ResultsExperience({ profile, score }: { profile: Dimension; score: ScoreBreakdown }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const offerRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const viewTracked = useRef(false);
  const [pastHero, setPastHero] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);

  const resultProfile = RESULT_PROFILES[profile] ?? RESULT_PROFILES.balanced;

  useEffect(() => {
    const offer = offerRef.current;
    if (!offer) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !viewTracked.current) {
            viewTracked.current = true;
            trackViewContent();
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(offer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const pricing = pricingRef.current;
    if (!hero || !pricing) return;

    const heroObserver = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    const pricingObserver = new IntersectionObserver(([entry]) => {
      setPricingVisible(entry.isIntersecting);
    });
    heroObserver.observe(hero);
    pricingObserver.observe(pricing);
    return () => {
      heroObserver.disconnect();
      pricingObserver.disconnect();
    };
  }, []);

  function scrollToOffer() {
    offerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <div ref={heroRef}>
        <ResultHero profile={resultProfile} score={score} onViewOffer={scrollToOffer} />
      </div>
      <PainBridge profile={resultProfile} />
      <ChatExample />
      <BenefitsGrid />
      <SocialProof />
      <div ref={offerRef}>
        <div ref={pricingRef}>
          <PricingOffer />
        </div>
      </div>
      <FaqAccordion />
      <FinalCta />
      <SiteFooter />
      <StickyCta visible={pastHero && !pricingVisible} />
    </div>
  );
}
