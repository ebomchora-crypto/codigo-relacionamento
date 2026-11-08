import FunnelExperience from "@/components/FunnelExperience";
import AnalyticsBoot from "@/components/analytics/AnalyticsBoot";
import ConsentBar from "@/components/analytics/ConsentBar";

export default function Home() {
  return (
    <>
      <AnalyticsBoot />
      <FunnelExperience />
      <ConsentBar />
    </>
  );
}
