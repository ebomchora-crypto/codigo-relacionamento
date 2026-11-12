# O Código do Silêncio — Quiz Funnel

Quiz funnel completo em Next.js (App Router) + TypeScript + Tailwind CSS +
Framer Motion para o e-book **O Código do Silêncio: Como Reativar o
Interesse Sem Parecer Carente**.

Fluxo: página de venda direta (botão de compra na primeira tela) com o quiz de 5 perguntas embutido no meio da página; o resultado aparece no próprio quiz, com o botão de compra →
resultado personalizado → apresentação do produto → módulos → prévia de
conteúdo → oferta (Kiwify) → FAQ.

---

## 1. Como executar localmente

Pré-requisitos: Node.js 18.18+ (testado com Node 22) e npm.

```bash
npm install
cp .env.example .env.local
```

Edite `.env.local` com seus valores reais (veja a seção 8). Em seguida:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

Para rodar o build de produção localmente (recomendado antes de publicar):

```bash
npm run build
npm run start
```

Outros comandos úteis:

```bash
npm run typecheck   # checagem de tipos TypeScript
npm run lint        # ESLint (regras do Next.js)
```

---

## 2. Como configurar o checkout da Kiwify

O botão "Quero acessar o guia" (e qualquer outro CTA de compra) usa a
variável de ambiente:

```
NEXT_PUBLIC_KIWIFY_CHECKOUT_URL="https://pay.kiwify.com.br/gPJXKem"
```

Já está configurada com a URL real informada. Para trocar o produto/link,
basta alterar essa variável — nenhum componente precisa ser editado
(`lib/checkout/kiwify.ts` monta a URL final preservando os parâmetros UTM
capturados na chegada do visitante).

### Webhook de confirmação de pagamento (evento Purchase)

O evento `Purchase` **nunca** é disparado no clique do botão nem no retorno
para uma página de agradecimento — apenas quando a Kiwify confirma o
pagamento via webhook servidor-a-servidor, evitando falsos positivos e
duplicidade.

1. No painel da Kiwify, cadastre um Webhook apontando para:
   `https://SEU-DOMINIO/api/webhooks/kiwify?token=SEU_TOKEN`
2. Defina `KIWIFY_WEBHOOK_TOKEN` em `.env.local`/nas variáveis de ambiente
   da Vercel com o mesmo valor usado no `token` da URL acima.
3. O endpoint (`app/api/webhooks/kiwify/route.ts`) valida o token, confirma
   que o `order_status` é de pagamento aprovado e registra a compra nas
   métricas internas. Se as credenciais da Meta Conversions API estiverem
   configuradas (passo 3 abaixo), ele também replica o evento `Purchase`
   para a API de Conversões, com deduplicação por `event_id`.

---

## 3. Como configurar o Meta Pixel

```
NEXT_PUBLIC_META_PIXEL_ID="1406287875905767"
```

Já configurado com o ID real informado. O Pixel é carregado manualmente em
`lib/analytics/pixel.ts` (sem depender de bibliotecas de terceiros) e só é
ativado **depois que o visitante aceita o aviso de cookies** (LGPD) exibido
na parte inferior da tela — veja `components/analytics/ConsentBar.tsx`.

Eventos implementados (`lib/analytics/events.ts`):

| Evento              | Quando dispara                                         |
| -------------------- | ------------------------------------------------------- |
| `PageView`           | Carregamento inicial (dentro do próprio init do Pixel) |
| `ViewContent`        | Quando a seção de oferta entra na tela (IntersectionObserver) |
| `QuizStart` (custom)         | Início do quiz |
| `QuizAnswer` (custom)        | A cada resposta — envia apenas o número da pergunta, nunca o conteúdo da resposta |
| `QuizComplete` (custom)      | Ao concluir as 5 perguntas |
| `InitiateCheckout`   | Clique efetivo no botão de compra, antes do redirecionamento |
| `Purchase`           | **Somente** pelo webhook servidor-a-servidor da Kiwify (ver seção 2) |

Qualquer falha ao carregar o script da Meta (bloqueador de anúncios,
offline, CSP) é silenciosa e nunca impede o funcionamento do quiz —
`lib/analytics/pixel.ts` e `lib/analytics/events.ts` envolvem todas as
chamadas em `try/catch`.

### Meta Conversions API (opcional, recomendado)

Para deduplicar `Purchase` entre o Pixel do navegador e o servidor, defina:

```
META_CONVERSIONS_API_ACCESS_TOKEN="..."
META_CONVERSIONS_API_TEST_EVENT_CODE=""   # opcional, para testes no Events Manager
```

Sem essas variáveis, o `Purchase` continua sendo confirmado normalmente via
webhook — apenas não é replicado para a CAPI.

---

## 4. Capa do e-book

A capa real está em `public/images/ebook-cover-hd.jpg` e é exibida por
`components/offer/EbookCoverArt.tsx`. O arquivo original recebido tinha só
175x175 px; ele foi ampliado com super-resolução (Real-ESRGAN 4x) para 1000x1000.
Se você tiver a arte original em alta resolução, substitua o arquivo mantendo
o nome (ou use um nome novo e ajuste o `src` do componente, para evitar cache
do otimizador de imagens).

---

## 5. Como editar perguntas e resultados

Todo o conteúdo fica separado da camada visual, em `data/`:

- `data/questions.ts` — as 5 perguntas, alternativas (com emoji) e a dimensão associada
  a cada alternativa (usada na pontuação).
- `data/results.ts` — os 4 perfis de resultado (título, texto,
  recomendações).
- `data/modules.ts` — os 6 módulos do produto e a lista de benefícios.
- `data/faq.ts` — perguntas frequentes.

A lógica de pontuação (quais perguntas pontuam, pesos, critério de
desempate e o que torna um resultado "neutro") está documentada em
detalhes nos comentários de `lib/scoring/engine.ts`. Resumo:

- Apenas as perguntas 2, 3, 4, 6 e 7 pontuam (perguntas de **comportamento
  real**). A pergunta 1 é apenas contextual e as perguntas 5 e 8 são sobre
  **objetivos pessoais** — usadas só para dar contexto, nunca para
  classificar emocionalmente o visitante.
- A dimensão com mais pontos vence. Empates seguem uma ordem de desempate
  documentada e determinística.
- O "Perfil D" (equilíbrio) funciona como resultado neutro: ele é exibido
  sempre que nenhuma dimensão de dificuldade (ansiedade, limites,
  comunicação) supera o padrão equilibrado — e seu texto não atribui
  nenhum problema específico ao leitor.

---

## 6. Como alterar o preço

```
NEXT_PUBLIC_PRICE="29.90"
NEXT_PUBLIC_PRICE_COMPARE=""
```

`NEXT_PUBLIC_PRICE` é o preço exibido em todas as seções da oferta.
`NEXT_PUBLIC_PRICE_COMPARE`, se preenchido com um valor **real e
comprovável**, exibe o preço "de" riscado ao lado — deixe vazio para não
exibir nenhuma comparação (o código nunca inventa descontos).

---

## 7. Como publicar na Vercel

1. Suba este repositório para o GitHub/GitLab/Bitbucket (ou use a CLI da
   Vercel diretamente).
2. Importe o projeto em [vercel.com/new](https://vercel.com/new).
3. Configure as variáveis de ambiente do `.env.example` no painel do
   projeto (Settings → Environment Variables) — todas, incluindo
   `ADMIN_PASSWORD` e `KIWIFY_WEBHOOK_TOKEN`.
4. Defina `NEXT_PUBLIC_SITE_URL` com o domínio final (necessário para os
   metadados Open Graph e o sitemap).
5. Deploy. O framework é detectado automaticamente (Next.js).
6. Configure o webhook da Kiwify apontando para
   `https://SEU-DOMINIO/api/webhooks/kiwify?token=SEU_TOKEN` (ver seção 2).

---

## 8. Quais integrações precisam de credenciais

| Integração | Variável | Obrigatória? | Observação |
|---|---|---|---|
| Checkout Kiwify | `NEXT_PUBLIC_KIWIFY_CHECKOUT_URL` | Sim | Já preenchida com a URL real fornecida. |
| Meta Pixel | `NEXT_PUBLIC_META_PIXEL_ID` | Sim, para rastreamento | Já preenchido com o ID real fornecido. |
| Webhook Kiwify → Purchase | `KIWIFY_WEBHOOK_TOKEN` | Sim, para confirmar compras | Sem isso, o evento `Purchase` nunca é confirmado (comportamento seguro por padrão). |
| Meta Conversions API | `META_CONVERSIONS_API_ACCESS_TOKEN` | Opcional | Sem isso, o Purchase funciona normalmente via Pixel/webhook, só não é replicado via CAPI. |
| Painel administrativo | `ADMIN_PASSWORD` | Sim, para acessar `/admin` | Troque o valor padrão antes de publicar. |
| Banco de dados de métricas | — | **Recomendado para produção** | Ver aviso na seção 9. |

---

## 9. Painel administrativo (`/admin`) e armazenamento de métricas

Acesse `/admin` e autentique-se com a senha definida em `ADMIN_PASSWORD`.
O painel mostra: visitantes, inícios e conclusões do quiz, taxa de
conclusão, abandono por pergunta, visualizações da oferta, cliques no
checkout, compras confirmadas e conversão por campanha (UTM). Quando não
há dados, um estado vazio é exibido — nenhum número é inventado.

**Importante:** a implementação padrão (`lib/analytics/store.ts`) grava os
eventos em um arquivo local (`os.tmpdir()`), o que é perfeito para
desenvolvimento e para demonstrar a arquitetura, mas **não é confiável em
produção na Vercel**, porque o sistema de arquivos das funções serverless é
efêmero. Para produção, implemente `appendEvent`/`readEvents` nesse mesmo
arquivo usando um banco persistente (Vercel KV, Redis, Postgres, Supabase
etc.) — nenhuma outra parte do projeto precisa mudar, pois tanto o
endpoint de tracking (`app/api/track/route.ts`) quanto o painel
(`app/admin/page.tsx`) dependem apenas de `getMetricsSnapshot()`.

Nenhuma resposta pessoal do quiz é armazenada — apenas contadores
agregados por `sessionId` anônimo, o número da pergunta e o `utm_campaign`.

---

## 10. Testes executados e resultados

Build de produção (`npm run build`) e checagem de tipos
(`npm run typecheck`) passam sem erros. Além disso, a experiência completa
foi exercitada de ponta a ponta com Playwright (Chromium) contra o build de
produção:

- ✅ Todas as 5 perguntas e as 4 alternativas de cada uma — fluxo completo
  testado em viewport mobile (390px), sem erros de console/página.
- ✅ Botão "voltar" — volta para a pergunta anterior corretamente e
  permite responder novamente.
- ✅ Persistência de respostas — estado salvo em `sessionStorage`, chave
  `ocds:quiz-state:v1`.
- ✅ Motor de pontuação — testado de forma exaustiva com um script que
  percorre as 4⁵ combinações possíveis de respostas pontuáveis; os 4
  perfis (ansiedade, limites, comunicação, equilíbrio/neutro) são todos
  alcançáveis e o critério de desempate é sempre determinístico (nunca
  lança exceção, nunca retorna `undefined`).
- ✅ Resultado "neutro" (Perfil D) confirmado como alcançável e correto
  quando nenhuma dimensão de dificuldade supera o padrão equilibrado.
- ✅ Navegação mobile — testada em 320px, 375px, 390px e 430px: **nenhuma
  rolagem horizontal** em nenhuma largura.
- ✅ Integração do checkout — clique em "Quero acessar o guia" dispara
  `InitiateCheckout` e redireciona para a URL da Kiwify preservando os
  parâmetros UTM capturados na chegada (testado interceptando a navegação).
- ✅ Eventos do Meta Pixel — `init`, `PageView`, `QuizStart` verificados na
  fila do `fbq` após consentimento aceito; pixel **não** carrega quando o
  consentimento é recusado; carregamento do script da Meta bloqueado
  (simulando ad blocker) não gera erro nem interrompe o quiz.
- ✅ `Purchase` nunca é referenciado em código client-side — existe apenas
  no endpoint de webhook, disparado só após confirmação real de pagamento.
- ✅ Painel administrativo — login rejeita senha incorreta, aceita a senha
  correta, exibe estado vazio honesto sem dados fictícios e, após uso real
  do quiz, exibe números reais agregados (incluindo abandono por
  pergunta).
- ✅ Páginas inexistentes retornam HTTP 404 com a tela customizada.
- ✅ Acessibilidade básica — navegação por teclado (Tab/Enter) percorre
  botão "voltar" → alternativas na ordem de leitura; todas as alternativas
  são `<button>` nativos com `aria-pressed`; progress bar com
  `role="progressbar"` e atributos ARIA; `prefers-reduced-motion` reduz
  animações globalmente via CSS.
- ✅ `npm audit` — sem vulnerabilidades exploráveis em código de produção
  conhecidas no momento da entrega além de advisories do Next.js 14.2.x
  para os quais não há patch disponível dentro da série 14 (ver observação
  abaixo); `postcss` foi fixado na versão corrigida via `overrides`. As
  demais vulnerabilidades remanescentes pertencem exclusivamente à cadeia
  de lint (`eslint-config-next` → `glob`/`minimatch`), que não é
  empacotada no build de produção.

> **Observação de segurança:** o projeto está na última versão disponível
> da série Next.js 14.2.x (`14.2.35`) no momento da entrega. Algumas
> advisories do Next.js listadas pelo `npm audit` só têm correção publicada
> na série 15.x. Nenhuma delas afeta funcionalidades usadas por este
> projeto (não há Server Actions, não há `next/image` com
> `remotePatterns`, não há middleware customizado). Recomenda-se
> acompanhar os releases do Next.js e migrar quando uma janela de
> manutenção permitir testar a série 15.

---

## 11. Estrutura do projeto

```
app/                      Rotas (App Router)
  page.tsx                 Página principal (monta o funil)
  admin/                    Painel administrativo
  api/                       Rotas de API (tracking, webhook, admin auth)
components/
  quiz/                     Motor do quiz (perguntas, progresso, transição)
  results/                  Tela de resultado personalizado
  offer/                    Apresentação do produto, módulos, prova social, oferta, FAQ
  admin/                    Componentes do painel administrativo
  analytics/                Pixel boot + aviso de cookies (LGPD)
  ui/                       Componentes de interface reutilizáveis
lib/
  scoring/                  Motor de classificação do quiz
  analytics/                Meta Pixel, eventos, tracking interno, consentimento
  checkout/                 Montagem da URL de checkout da Kiwify
  admin/                    Autenticação do painel administrativo
  session.ts                Persistência de respostas em sessionStorage
data/                      Conteúdo do produto (perguntas, resultados, módulos, FAQ, preço)
types/                     Tipos TypeScript compartilhados
public/                    Assets estáticos
```

---

## Imagens

As fotos em `public/images/` vêm do [Pexels](https://www.pexels.com/license/)
(licença gratuita, uso comercial permitido, atribuição não obrigatória) e são
usadas apenas como fundo decorativo (`components/ui/PhotoBackdrop.tsx`). Para
trocar, substitua o arquivo (use um nome novo para evitar cache do otimizador
de imagens) e ajuste `data/results.ts` ou os
componentes da oferta.

---

## Limitações conhecidas e avisos de transparência

- A capa do e-book exibida é um mockup placeholder (ver seção 4).
- A seção de prova social não exibe depoimentos fictícios — enquanto não
  houver avaliações reais e verificadas, mostra uma prévia honesta do
  conteúdo dos módulos (ver `components/offer/SocialProof.tsx`).
- O armazenamento de métricas padrão não é persistente em produção na
  Vercel (ver seção 9).
- O conteúdo tem caráter educativo sobre comunicação e inteligência
  emocional. Não garante reconciliação, não promete controlar os
  sentimentos de terceiros e não substitui acompanhamento psicológico
  profissional.
