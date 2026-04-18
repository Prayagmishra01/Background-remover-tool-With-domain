import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://promptcraftin.in';
  
  // Base Routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Scalable Landing Page Ideas
  const tools = [
    'remove-background-from-image',
    'remove-background-hd',
    'background-remover-free-online',
    'remove-background-from-logo',
    'transparent-background-maker-hd',
    'bulk-background-remover'
  ];

  const programmaticRoutes = tools.map((tool) => ({
    url: `${baseUrl}/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...programmaticRoutes];
}
