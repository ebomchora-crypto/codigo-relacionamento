"use client";

import { useEffect, useRef, useState } from "react";
import OfferHero from "@/components/offer/OfferHero";
import Identification from "@/components/sales/Identification";
import ChatExample from "@/components/offer/ChatExample";
import InlineQuiz from "@/components/sales/InlineQuiz";
import BenefitsGrid from "@/components/offer/BenefitsGrid";
import SocialProof from "@/components/offer/SocialProof";
import PricingOffer from "@/components/offer/PricingOffer";
import FaqAccordion from "@/components/offer/FaqAccordion";
import FinalCta from "@/components/offer/FinalCta";
import StickyCta from "@/components/offer/StickyCta";
import SiteFooter from "@/components/SiteFooter";
import { trackViewContent } from "@/lib/analytics/events";

/**
 * Página de venda direta: botão de compra desde a primeira tela, quiz curto
 * embutido no meio e o checkout sempre a um toque (botão fixo no celular).
 */
export default function SalesPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const viewTracked = useRef(false);
  const [pastHero, setPastHero] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const pricing = pricingRef.current;
    if (!hero || !pricing) return;

    const heroObserver = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    const pricingObserver = new IntersectionObserver(
      ([entry]) => {
        setPricingVisible(entry.isIntersecting);
        if (entry.isIntersecting && !viewTracked.current) {
          viewTracked.current = true;
          trackViewContent();
        }
      },
      { threshold: 0.3 },
    );
    heroObserver.observe(hero);
    pricingObserver.observe(pricing);
    return () => {
      heroObserver.disconnect();
      pricingObserver.disconnect();
    };
  }, []);

  function scrollToQuiz() {
    document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main>
      <div ref={heroRef}>
        <OfferHero onQuiz={scrollToQuiz} />
      </div>
      <Identification />
      <ChatExample />
      <InlineQuiz />
      <BenefitsGrid />
      <SocialProof />
      <div ref={pricingRef}>
        <PricingOffer />
      </div>
      <FaqAccordion />
      <FinalCta />
      <SiteFooter />
      <StickyCta visible={pastHero && !pricingVisible} />
    </main>
  );
}
