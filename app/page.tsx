import SalesPage from "@/components/SalesPage";
import AnalyticsBoot from "@/components/analytics/AnalyticsBoot";
import ConsentBar from "@/components/analytics/ConsentBar";

export default function Home() {
  return (
    <>
      <AnalyticsBoot />
      <SalesPage />
      <ConsentBar />
    </>
  );
}
