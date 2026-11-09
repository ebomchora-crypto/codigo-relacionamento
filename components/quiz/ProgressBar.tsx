export default function ProgressBar({ value, max }: { value: number; max: number }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`Progresso: pergunta ${value} de ${max}`}
      className="flex w-full gap-1.5"
    >
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <span
            className="block h-full origin-left rounded-full bg-gold-fade transition-transform duration-500 ease-out"
            style={{ transform: `scaleX(${i < value ? 1 : 0})` }}
          />
        </span>
      ))}
    </div>
  );
}
