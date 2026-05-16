import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mizanmujadid.com';

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  try {
    await dbConnect();
    const projects = await Project.find({}).lean();

    // Dynamic routes for each project
    const projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...routes, ...projectRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
