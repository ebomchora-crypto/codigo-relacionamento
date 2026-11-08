import { BarChart3 } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-white/15 py-16 text-center">
      <BarChart3 size={28} className="text-mist" />
      <p className="text-sm text-mist">
        Ainda não há dados registrados. As métricas aparecem aqui conforme visitantes interagem com
        o quiz.
      </p>
    </div>
  );
}
