import { getPostBySlug, getAllPosts } from '@/lib/blog-api';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  try {
    const post = getPostBySlug(resolvedParams.slug, ['title', 'description', 'primary_keyword']);
    return {
      title: `${post.title} - promptcraftin.in`,
      description: post.description,
      keywords: post.primary_keyword,
    };
  } catch (e) {
    return { title: 'Post Not Found' };
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts(['slug']);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  let post;
  try {
    post = getPostBySlug(resolvedParams.slug, ['title', 'date', 'content', 'primary_keyword']);
  } catch (e) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-black mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Link>
        <article className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100">
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-emerald-700 font-bold mb-4 bg-emerald-50 w-fit mx-auto px-3 py-1 rounded-full border border-emerald-100">
              <ShieldCheck className="w-4 h-4" />
              100% Client-Side Privacy
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
              {post.title}
            </h1>
            <time className="text-gray-500 font-medium">
              {new Date(post.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric'})}
            </time>
          </header>

          <div className="prose prose-lg prose-gray max-w-none prose-headings:tracking-tight prose-a:text-blue-600">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold mb-4">Try it for yourself</h3>
          <p className="text-gray-600 mb-6">Experience blazing fast offline background removal inside your browser.</p>
          <Link href="/" className="px-8 py-3 bg-black text-white font-bold rounded-xl shadow-lg border-b-4 border-gray-800 hover:translate-y-px hover:border-b-2 transition-all">
            Open Background Remover tool
          </Link>
        </div>
      </div>
    </div>
  );
}
