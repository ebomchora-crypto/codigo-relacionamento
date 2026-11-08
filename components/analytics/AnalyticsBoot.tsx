"use client";

import { useEffect } from "react";
import { loadMetaPixel } from "@/lib/analytics/pixel";
import { trackPageView } from "@/lib/analytics/events";
import { getConsent } from "@/lib/analytics/consent";

export default function AnalyticsBoot() {
  useEffect(() => {
    trackPageView();
    if (getConsent() === "accepted") {
      loadMetaPixel();
    }
  }, []);

  return null;
}
