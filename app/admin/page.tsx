import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, isValidAdminToken } from "@/lib/admin/auth";
import { getMetricsSnapshot } from "@/lib/analytics/store";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";
import MetricCard from "@/components/admin/MetricCard";
import EmptyState from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!isValidAdminToken(token)) {
    redirect("/admin/login");
  }

  const snapshot = await getMetricsSnapshot();

  return (
    <div className="min-h-screen bg-ink py-10">
      <Container className="max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <SectionLabel>Painel administrativo</SectionLabel>
            <h1 className="mt-2 font-display text-2xl font-semibold text-paper">
              Métricas do funil
            </h1>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="focus-ring rounded-full border border-white/15 px-4 py-2 text-xs text-mist hover:text-paper"
            >
              Sair
            </button>
          </form>
        </div>

        <div className="mt-6 rounded-xl border border-gold/20 bg-gold/5 p-4 text-xs leading-relaxed text-mist">
          Estes números vêm de um armazenamento local temporário (ver{" "}
          <code className="text-gold-soft">lib/analytics/store.ts</code>), adequado para
          desenvolvimento e demonstração. Em produção na Vercel, conecte um banco de dados
          persistente para números confiáveis entre deploys — a interface deste painel não precisa
          mudar.
        </div>

        {!snapshot.hasData ? (
          <div className="mt-8">
            <EmptyState />
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <MetricCard label="Visitantes" value={snapshot.visitors} />
              <MetricCard label="Inícios do quiz" value={snapshot.quizStarts} />
              <MetricCard label="Conclusões" value={snapshot.quizCompletions} />
              <MetricCard
                label="Taxa de conclusão"
                value={
                  snapshot.completionRate !== null
                    ? `${Math.round(snapshot.completionRate * 100)}%`
                    : "—"
                }
              />
              <MetricCard label="Visualizações da oferta" value={snapshot.offerViews} />
              <MetricCard label="Cliques no checkout" value={snapshot.checkoutClicks} />
              <MetricCard label="Compras confirmadas" value={snapshot.purchasesConfirmed} />
            </div>

            {snapshot.dropoffByQuestion.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-lg font-semibold text-paper">
                  Abandono por pergunta
                </h2>
                <div className="mt-4 flex flex-col gap-2">
                  {snapshot.dropoffByQuestion.map((row) => (
                    <div
                      key={row.questionId}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-ink-soft px-4 py-3 text-sm"
                    >
                      <span className="text-paper">Pergunta {row.questionId}</span>
                      <span className="text-mist">
                        {row.sessionsReached} alcançaram · {row.dropped} abandonaram em seguida
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {snapshot.byCampaign.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-lg font-semibold text-paper">
                  Conversão por campanha (UTM)
                </h2>
                <div className="mt-4 flex flex-col gap-2">
                  {snapshot.byCampaign.map((row) => (
                    <div
                      key={row.campaign}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-ink-soft px-4 py-3 text-sm"
                    >
                      <span className="text-paper">{row.campaign}</span>
                      <span className="text-mist">
                        {row.visitors} visitantes · {row.checkoutClicks} cliques · {row.purchases}{" "}
                        compras
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
