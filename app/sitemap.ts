import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog-api';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://promptcraftin.in';
  
  // Base Routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-conditions',
    '/disclaimer',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : (route === '/blog' ? 0.9 : 0.8),
  }));

  // Static programmatic tool pages mapped dynamically
  const tools = [
    'passports', 'pan-card', 'ecommerce', 'instagram-posts', 
    'resume-photo', 'cars', 'logos', 'real-estate', 
    'amazon-listings', 'memes', 'signatures', 'headshots', 
    'jewelry', 'youtube-thumbnails', 'clothing'
  ];

  const programmaticRoutes = tools.map((tool) => ({
    url: `${baseUrl}/remove-background-${tool}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic Blog Routes
  const posts = getAllPosts(['slug', 'date']);
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...programmaticRoutes, ...blogRoutes];
}
