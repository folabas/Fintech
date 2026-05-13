import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ApexVault Finance Bank — Secure Online Banking',
  description:
    'ApexVault Finance Bank — Achieve Your Financial Potential. Secure online banking, wire transfers, account management and more.',
  keywords: 'online banking, wire transfer, secure banking, ApexVault, finance',
  openGraph: {
    title: 'ApexVault Finance Bank',
    description: 'Achieve Your Financial Potential',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
