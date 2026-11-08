"use client";

import { useEffect, useRef } from "react";
import ResultHero from "@/components/results/ResultHero";
import ProductShowcase from "@/components/offer/ProductShowcase";
import ModulesList from "@/components/offer/ModulesList";
import SocialProof from "@/components/offer/SocialProof";
import PricingOffer from "@/components/offer/PricingOffer";
import FaqAccordion from "@/components/offer/FaqAccordion";
import SiteFooter from "@/components/SiteFooter";
import { RESULT_PROFILES } from "@/data/results";
import { trackViewContent } from "@/lib/analytics/events";
import type { Dimension } from "@/types/quiz";

export default function ResultsExperience({ profile }: { profile: Dimension }) {
  const offerRef = useRef<HTMLDivElement>(null);
  const viewTracked = useRef(false);

  const resultProfile = RESULT_PROFILES[profile] ?? RESULT_PROFILES.balanced;

  useEffect(() => {
    const target = offerRef.current;
    if (!target) return;

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

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  function scrollToOffer() {
    offerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <ResultHero profile={resultProfile} onViewOffer={scrollToOffer} />
      <div ref={offerRef}>
        <ProductShowcase />
      </div>
      <ModulesList />
      <SocialProof />
      <PricingOffer />
      <FaqAccordion />
      <SiteFooter />
    </div>
  );
}
