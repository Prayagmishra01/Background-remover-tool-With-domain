'use client';

import { StaticPageLayout } from "@/components/StaticPageLayout";

export default function Contact() {
  return (
    <StaticPageLayout title="Contact Us">
      <p className="mb-8">
        We value your feedback and are here to assist with any questions, technical issues, or business inquiries. Please feel free to reach out to us.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all h-[42px] bg-white">
               <option>General Inquiry</option>
               <option>Technical Support</option>
               <option>Bug Report</option>
               <option>Partnership/Business</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
          </div>
          <button type="submit" className="w-full py-3 px-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors">
            Send Message
          </button>
        </form>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Direct Contact Information</h2>
      <div className="space-y-2">
        <p><strong>Support Email:</strong> <a href="mailto:support@bgremover.example.com" className="text-blue-600 hover:underline">support@bgremover.example.com</a></p>
        <p><strong>Business Inquiries:</strong> <a href="mailto:partnerships@bgremover.example.com" className="text-blue-600 hover:underline">partnerships@bgremover.example.com</a></p>
        <p className="pt-2 text-sm text-gray-500">We aim to respond to all inquiries within 24-48 business hours.</p>
      </div>
    </StaticPageLayout>
  );
}
