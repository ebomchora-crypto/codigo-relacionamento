/**
 * Gancho da primeira tela: mini conversa com "visualizado" + digitando.
 * CSS puro, leve. Faz a pessoa se reconhecer em 1 segundo.
 */
export default function HookBanner() {
  return (
    <div className="animate-fade-up">
      <p className="font-display text-[1.45rem] font-semibold leading-tight text-paper min-[380px]:text-[1.85rem]">
        Visualizou e <span className="text-gold-soft">sumiu?</span>
      </p>
      <div className="mt-2.5 flex items-end gap-3">
        <div className="relative max-w-[15rem] rounded-2xl rounded-br-md bg-[#1f3b2e] px-3.5 py-2.5 text-[0.95rem] text-paper">
          Oi, tudo bem? 🙂
          <span className="ml-2 inline-flex translate-y-0.5 items-center text-[11px] text-[#53bdeb]" aria-label="visualizado">
            ✓✓
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white/10 px-3 py-3" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-dot-bounce rounded-full bg-mist"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
