'use client';

import { useState } from 'react';
import { MessageSquare, LifeBuoy } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ContactButton({ variant = 'header-help' }: { variant?: 'header-help' | 'footer-feedback' | 'footer-help' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFooter = variant.startsWith('footer');
  const isHelp = variant.includes('help');
  
  const buttonText = isHelp ? "Help Me" : "Send Feedback";
  const sourceText = variant === 'footer-feedback' ? 'Footer Feedback' 
                   : variant === 'footer-help' ? 'Footer Help' 
                   : 'Header Help';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/telegram/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: sourceText,
          message: message.trim(),
        }),
      });

      if (res.ok) {
        toast.success("Message sent! We'll look into it.");
        setIsOpen(false);
        setMessage('');
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Could not send.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-1.5 font-medium transition-colors ${
          isFooter 
            ? 'text-[11px] text-gray-500 hover:text-gray-900' 
            : 'text-sm text-gray-600 hover:text-black bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200'
        }`}
      >
        {isHelp ? <LifeBuoy className={isFooter ? "w-3.5 h-3.5" : "w-4 h-4"} /> : <MessageSquare className={isFooter ? "w-3.5 h-3.5" : "w-4 h-4"} />}
        {buttonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {isHelp ? "Need Help?" : "Feedback & Suggestions"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {isHelp 
                  ? "Tell us what went wrong. We will get back to you via Telegram bot."
                  : "Got an idea or feedback? We'd love to hear it and will follow up shortly!"}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <textarea
                className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:outline-none resize-none"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                autoFocus
              />
              
              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-900 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
