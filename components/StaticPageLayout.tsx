import React from 'react';
import Link from 'next/link';

export function StaticPageLayout({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans text-gray-900">
      {/* Header */}
      <header className="h-16 shrink-0 border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 bg-white">
        <Link href="/" className="flex items-center gap-2 font-bold text-[20px] tracking-tight text-gray-900 hover:opacity-80 transition-opacity">
          <img src="https://res.cloudinary.com/dz3ixer7i/image/upload/v1776431696/Background_remover_website_logo_1_vqflqm.png" alt="PromptCraft Logo" className="w-8 h-8 object-contain" />
          promptcraftin.in
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-black">Tool</Link>
          <Link href="/about" className="hover:text-black">About</Link>
          <Link href="/contact" className="hover:text-black">Contact</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 lg:p-12 bg-white lg:my-10 rounded-3xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight">{title}</h1>
        <div className="space-y-6 text-gray-600 leading-relaxed text-[15px]">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-[13px] text-gray-500 border-t border-gray-200 mt-auto bg-white">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-4">
          <Link href="/about" className="hover:text-gray-900">About Us</Link>
          <Link href="/contact" className="hover:text-gray-900">Contact</Link>
          <Link href="/privacy-policy" className="hover:text-gray-900">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-900">Terms & Conditions</Link>
          <Link href="/disclaimer" className="hover:text-gray-900">Disclaimer</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} promptcraftin.in. All rights reserved.</p>
      </footer>
    </div>
  );
}
