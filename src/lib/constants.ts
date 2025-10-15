export const APP_NAME = "EasyBusiness";

export const PLANS = [
  {
    name: "Plano Padrão",
    price: "R$49,90",
    priceSuffix: "/mês",
    description: "Ideal para equipes pequenas começando a organizar seus negócios.",
    features: [
      "Até 5 usuários simultâneos",
      "Controle de vendas e estoque",
      "Fluxo de caixa simples",
      "Emissão de nota informativa",
      "Suporte por e-mail",
    ],
    cta: "Começar agora",
  },
  {
    name: "Plano Plus",
    price: "R$89,90",
    priceSuffix: "/mês",
    description: "Perfeito para empresas em crescimento que precisam de mais recursos.",
    features: [
      "Usuários ilimitados",
      "Todas as funcionalidades do Padrão",
      "Dashboard com métricas avançadas",
      "Relatórios detalhados",
      "Suporte prioritário 24/7",
    ],
    cta: "Contratar Plus",
    isFeatured: true,
  },
];
