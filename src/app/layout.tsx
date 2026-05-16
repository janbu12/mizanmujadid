import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Muhammad Mizan Al Mujadid | Fullstack Developer (Web, Mobile, Desktop)',
  description: 'Personal portfolio of Muhammad Mizan Al Mujadid, a Fullstack Developer specializing in Web Development, Mobile Apps (Flutter), and Desktop Applications.',
  keywords: ['Muhammad Mizan Al Mujadid', 'Mizan Mujadid', 'Fullstack Developer', 'Web Developer', 'Flutter Developer', 'Mobile App Developer', 'Desktop App Developer', 'Portfolio'],
  authors: [{ name: 'Muhammad Mizan Al Mujadid' }],
  creator: 'Muhammad Mizan Al Mujadid',
  openGraph: {
    title: 'Muhammad Mizan Al Mujadid | Fullstack Developer',
    description: 'Specializing in Web Development, Mobile Apps (Flutter), and Desktop Applications.',
    type: 'website',
    url: 'https://mizanmujadid.com',
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Muhammad Mizan Al Mujadid",
  "url": "https://mizanmujadid.com",
  "jobTitle": "Fullstack Developer",
  "description": "Specialist in Web Development, Mobile Apps (Flutter), and Desktop Applications.",
  "sameAs": [
    "https://www.linkedin.com/in/mizan-mujadid",
    "https://github.com/janbu12"
  ]
};

import { Providers } from "@/components/Providers";
import ScrollObserver from './ScrollObserver';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <CustomCursor />
          <ScrollProgress />
          <ScrollObserver />
          {children}
        </Providers>
      </body>
    </html>
  );
}
