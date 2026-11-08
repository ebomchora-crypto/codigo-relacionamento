import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <Container className="max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-ink-soft p-8">
          <SectionLabel>Painel administrativo</SectionLabel>
          <h1 className="mt-3 font-display text-xl font-semibold text-paper">Entrar</h1>

          <form action="/api/admin/login" method="POST" className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm text-mist">
              Senha
              <input
                type="password"
                name="password"
                required
                autoFocus
                className="focus-ring rounded-xl border border-white/15 bg-ink px-4 py-3 text-paper outline-none placeholder:text-mist/50"
                placeholder="••••••••"
              />
            </label>

            {searchParams.error && (
              <p role="alert" className="text-sm text-red-400">
                Senha incorreta. Tente novamente.
              </p>
            )}

            <button
              type="submit"
              className="focus-ring mt-2 rounded-full bg-gold-fade px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-105"
            >
              Acessar métricas
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}
