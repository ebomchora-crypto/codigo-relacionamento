export interface ProductModule {
  number: string;
  title: string;
  description: string;
}

export const PRODUCT_MODULES: ProductModule[] = [
  {
    number: "01",
    title: "O Erro Invisível",
    description: "Reconhecer o gesto que afasta a pessoa sem você perceber.",
  },
  {
    number: "02",
    title: "Quando a Pessoa Esfria",
    description: "Ler os sinais de afastamento sem entrar em pânico.",
  },
  {
    number: "03",
    title: "O Poder de Dar Espaço",
    description: "Dar espaço sem se anular e sem usar o silêncio como jogo.",
  },
  {
    number: "04",
    title: "Comunicação Sem Carência",
    description: "Pedir atenção sem cobrar e sem parecer carente.",
  },
  {
    number: "05",
    title: "Reconhecendo Reciprocidade",
    description: "Ver se o esforço é dos dois ou só seu.",
  },
  {
    number: "06",
    title: "Segurança Emocional",
    description: "Aguentar a incerteza sem agir no impulso.",
  },
];

export const PRODUCT_BENEFITS: string[] = [
  "Compreenda melhor o afastamento emocional.",
  "Aprenda a conversar sem cobranças excessivas.",
  "Desenvolva mais segurança emocional.",
  "Reconheça sinais de reciprocidade.",
  "Estabeleça limites com clareza.",
  "Evite atitudes impulsivas em conversas difíceis.",
];
