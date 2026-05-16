import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Protect admin panel from being indexed
    },
    sitemap: 'https://mizanmujadid.com/sitemap.xml',
  };
}
