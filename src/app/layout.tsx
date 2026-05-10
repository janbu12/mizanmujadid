import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mizan | UI/UX Designer & Frontend Developer',
  description: 'Personal portfolio of Mizan, UI/UX Designer and Frontend Developer. Designing with purpose. Building with precision.',
};

import { Providers } from "@/components/Providers";
import ScrollObserver from './ScrollObserver';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>
          <ScrollObserver />
          {children}
        </Providers>
      </body>
    </html>
  );
}
