'use client';

import React, { useEffect, useState } from 'react';
import { X, PlayCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  intent?: 'hd_download' | 'unlock_removals' | null;
}

export function AdModal({ isOpen, onClose, onUnlock, intent = 'hd_download' }: AdModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [adFinished, setAdFinished] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setAdFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        // Reset state on unmount or when modal closes
      };
    } else {
      // Reset state when not open
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCountdown(5);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdFinished(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm sm:p-0">
      <div 
        className="relative w-full max-w-md p-6 overflow-hidden bg-white shadow-xl rounded-3xl animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          disabled={!adFinished}
          className={cn(
            "absolute top-4 right-4 p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-500",
            !adFinished && "opacity-50 cursor-not-allowed"
          )}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mt-4">
          {!adFinished ? (
            <>
               <div className="flex items-center justify-center w-16 h-16 mb-4 text-blue-500 bg-blue-50 rounded-full animate-pulse">
                <PlayCircle className="w-8 h-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 text-center">
                {intent === 'hd_download' 
                  ? 'Watch an ad to unlock HD Download' 
                  : 'Watch an ad to unlock 3 more background removals'}
              </h3>
              <p className="min-h-[60px] text-sm text-center text-gray-500 mb-6 bg-gray-50 rounded-xl p-4 w-full flex items-center justify-center border border-gray-100 italic">
                {/* Simulated Ad Space */}
                Advertisement playing... {countdown}s
              </p>
            </>
          ) : (
            <>
               <div className="flex items-center justify-center w-16 h-16 mb-4 text-green-500 bg-green-50 rounded-full">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 text-center">
                {intent === 'hd_download' 
                  ? 'HD Download Unlocked!' 
                  : '3 Removals Unlocked!'}
              </h3>
              <p className="text-sm text-center text-gray-500 mb-6">
                {intent === 'hd_download'
                  ? 'Thank you. You can now download your image in high resolution.'
                  : 'Thank you. You can now remove backgrounds for 3 more images.'}
              </p>
            </>
          )}

          <button
            onClick={() => {
              if (adFinished) {
                  onUnlock();
              }
            }}
            disabled={!adFinished}
            className={cn(
              "w-full px-6 py-3 text-sm font-medium text-white transition-all rounded-full shadow-sm",
              adFinished 
                ? "bg-black hover:bg-gray-900" 
                : "bg-gray-300 cursor-not-allowed"
            )}
          >
            {adFinished 
              ? (intent === 'hd_download' ? 'Continue to Download' : 'Continue to Upload') 
              : `Wait ${countdown}s`}
          </button>
        </div>
      </div>
    </div>
  );
}
