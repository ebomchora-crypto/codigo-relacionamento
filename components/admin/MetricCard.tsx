export default function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink-soft p-4">
      <p className="text-xs text-mist">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-gold-soft">{value}</p>
    </div>
  );
}
