export interface Testimonial {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * Prints reais de conversas de WhatsApp enviados por leitores do guia.
 * Nenhum nome, número ou foto de perfil é exibido — apenas o conteúdo da
 * conversa, como recebido. Não adicione depoimentos fabricados aqui; se um
 * novo print real chegar, inclua o arquivo em public/testimonials/ e
 * adicione uma entrada correspondente.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    src: "/testimonials/whatsapp-1.png",
    alt: "Conversa de WhatsApp: leitor relata que parou de ficar ansioso esperando resposta e que a conversa melhorou depois de ler O Código do Silêncio.",
    width: 244,
    height: 355,
  },
  {
    src: "/testimonials/whatsapp-2.png",
    alt: "Conversa de WhatsApp: leitor conta que conseguia lidar melhor com o silêncio e falou sem cobrança nem drama, sem exagerar.",
    width: 246,
    height: 373,
  },
  {
    src: "/testimonials/whatsapp-3.png",
    alt: "Conversa de WhatsApp: leitor relata ter organizado as ideias antes de conversar e que a relação ficou mais leve, sem o clima pesado de antes.",
    width: 216,
    height: 344,
  },
  {
    src: "/testimonials/whatsapp-4.png",
    alt: "Conversa de WhatsApp: leitor diz estar com a rotina mais organizada, menos ansiedade e mais segurança para se comunicar.",
    width: 237,
    height: 320,
  },
];
