export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Início",
      href: "/",
    },
    {
      label: "Usuários",
      href: "/users",
    },
  ],
  navMenuItems: [
    {
      label: "Início",
      href: "/",
    },
    {
      label: "Usuários",
      href: "/users",
    },
    {
      label: "Sair ",
      href: "/logout",
    },
  ],
};
