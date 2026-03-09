export type SubLink = { label: string; href: string; description?: string };
export type SubSection = { category: string; links: SubLink[] };
export type NavItem = {
  label: string;
  href?: string;
  submenu?: SubSection[];
};

export const NAV_LINKS: NavItem[] = [
  {
    label: "Productos",
    submenu: [
      {
        category: "Pagos",
        links: [
          {
            label: "Dinelco Checkout",
            href: "/productos/checkout",
            description: "Pagos online para tu sitio web",
          },
          {
            label: "DLink",
            href: "/productos/dlink",
            description: "Enlaces de pago compartibles",
          },
          {
            label: "POS",
            href: "/productos/pos",
            description: "Terminales físicas para tu comercio",
          },
          {
            label: "Pagos recurrentes",
            href: "/productos/recurrentes",
            description: "Débitos automáticos",
          },
        ],
      },
      {
        category: "Herramientas",
        links: [
          {
            label: "Catastro de tarjetas",
            href: "/productos/catastro",
            description: "API para registro de tarjetas",
          },
        ],
      },
      {
        category: "Plataforma",
        links: [
          {
            label: "Portal Dinelco",
            href: "/productos/portal",
            description: "Gestión completa de tu empresa",
          },
        ],
      },
    ],
  },
  {
    label: "Documentación",
    submenu: [
      {
        category: "Conoce",
        links: [
          {
            label: "Centro de conocimiento",
            href: "https://docs.dinelco.com/api-explorer",
            description:
              "Mantenete al día con las novedades de la plataforma fintech",
          },
        ],
      },
      {
        category: "Desarrolladores",
        links: [
          {
            label: "Documentación para desarrolladores",
            href: "https://docs.dinelco.com",
            description: "Empezar a integrar",
          },
          {
            label: "Referencias API",
            href: "https://docs.dinelco.com/api-explorer",
            description: "Guías y referencia de todas las APIs",
          },
        ],
      },
    ],
  },
  { label: "Sobre nosotros", href: "/nosotros" },
];
