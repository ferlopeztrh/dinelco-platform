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
  { label: "Nuestros clientes", href: "/clientes" },
  { label: "Sobre nosotros", href: "/nosotros" },
  {
    label: "Documentación",
    submenu: [
      {
        category: "Referencia",
        links: [
          {
            label: "Documentación",
            href: "https://docs.dinelco.com",
            description: "Guías y referencia de todas las APIs",
          },
          {
            label: "Explorador de API",
            href: "https://docs.dinelco.com/api-explorer",
            description: "Probá los endpoints en vivo",
          },
        ],
      },
      {
        category: "Ayuda",
        links: [
          {
            label: "CAC — 021 620 6000",
            href: "tel:0216206000",
            description: "Centro de Atención al Cliente",
          },
        ],
      },
    ],
  },
  { label: "Precios", href: "/precios" },
];
