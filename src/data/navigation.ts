export interface NavLink {
  label: string;
  href: string;
}

export const mainNavLinks: NavLink[] = [
  { label: 'Products', href: '/products' },
  { label: 'Support', href: '/support' },
  { label: 'Contact', href: '/contact' },
];

export const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  products: [
    { label: 'All Products', href: '/products' },
    { label: 'Compare', href: '/compare' },
  ],
  support: [
    { label: 'FAQ', href: '/support' },
    { label: 'Contact', href: '/contact' },
    { label: 'Returns', href: '/returns' },
  ],
};
