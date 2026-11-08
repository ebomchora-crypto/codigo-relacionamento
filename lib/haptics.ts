export function haptic(ms = 10): void {
  if (typeof navigator === "undefined") return;
  try {
    navigator.vibrate?.(ms);
  } catch {
    // Sem suporte (iOS Safari, desktop). Ignorar.
  }
}
