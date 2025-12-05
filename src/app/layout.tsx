import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Premium Hardware Co. | Innovation Redefined',
  description: 'Experience the future of premium hardware. Designed with precision, built for excellence.',
  keywords: ['premium', 'hardware', 'technology', 'innovation'],
  openGraph: {
    title: 'Premium Hardware Co. | Innovation Redefined',
    description: 'Experience the future of premium hardware. Designed with precision, built for excellence.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
