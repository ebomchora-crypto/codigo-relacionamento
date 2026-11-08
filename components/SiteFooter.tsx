import Container from "@/components/ui/Container";
import { PRODUCT_NAME } from "@/data/product";

export default function SiteFooter() {
  return (
    <footer className="bg-ink pb-32 pt-10 sm:pb-10">
      <Container className="flex flex-col items-center gap-3 text-center">
        <p className="font-display text-sm text-gold-soft">{PRODUCT_NAME}</p>
        <p className="max-w-sm text-xs leading-relaxed text-mist/70">
          Este conteúdo tem caráter educativo sobre comunicação e inteligência emocional. Não
          substitui acompanhamento psicológico profissional e não garante reconciliação ou
          controle sobre os sentimentos de terceiros.
        </p>
        <p className="text-xs text-mist/50">
          © {new Date().getFullYear()} {PRODUCT_NAME}. Todos os direitos reservados.
        </p>
      </Container>
    </footer>
  );
}
