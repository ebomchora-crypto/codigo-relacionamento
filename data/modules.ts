export interface ProductModule {
  number: string;
  title: string;
  description: string;
}

export const PRODUCT_MODULES: ProductModule[] = [
  {
    number: "01",
    title: "O Erro Invisível",
    description: "Entenda como reações impulsivas podem aumentar o desgaste emocional.",
  },
  {
    number: "02",
    title: "Quando a Pessoa Esfria",
    description: "Aprenda a reconhecer o afastamento e agir com mais consciência.",
  },
  {
    number: "03",
    title: "O Poder de Dar Espaço",
    description:
      "Compreenda a diferença entre respeitar limites e utilizar silêncio como estratégia de manipulação.",
  },
  {
    number: "04",
    title: "Comunicação Sem Carência",
    description: "Aprenda a expressar sentimentos sem cobranças excessivas.",
  },
  {
    number: "05",
    title: "Reconhecendo Reciprocidade",
    description: "Identifique quando existe esforço mútuo e quando uma conexão está desequilibrada.",
  },
  {
    number: "06",
    title: "Segurança Emocional",
    description: "Desenvolva atitudes para lidar melhor com incerteza, ansiedade e rejeição.",
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
