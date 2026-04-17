import { getAllPosts } from '@/lib/blog-api';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

export const metadata = {
  title: 'Blog - promptcraftin.in',
  description: 'Articles, tutorials, and deep-dives on private, offline background removal.',
};

export default function BlogMenu() {
  const posts = getAllPosts(['title', 'date', 'slug', 'description', 'primary_keyword']);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 tracking-tighter">
            Privacy & Performance Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Learn more about client-side AI, protecting your image data, and keeping your workflow entirely offline and login-free.
          </p>
        </header>

        <div className="grid gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-3">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>{new Date(post.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                {post.primary_keyword && (
                  <>
                    <span className="opacity-50">•</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{post.primary_keyword}</span>
                  </>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-black">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-5 leading-relaxed">
                {post.description}
              </p>
              <Link 
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-sm font-semibold text-black hover:text-gray-600 transition-colors"
              >
                Read Article <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
