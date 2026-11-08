import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionLabel from "@/components/ui/SectionLabel";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <Container className="flex flex-col items-center gap-4 text-center">
        <SectionLabel>404</SectionLabel>
        <h1 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
          Esta página não existe.
        </h1>
        <p className="text-sm text-mist sm:text-base">
          O conteúdo que você procura pode ter sido movido ou não está mais disponível.
        </p>
        <Link
          href="/"
          className="focus-ring mt-4 rounded-full bg-gold-fade px-6 py-3 text-sm font-semibold text-ink"
        >
          Voltar ao início
        </Link>
      </Container>
    </div>
  );
}
