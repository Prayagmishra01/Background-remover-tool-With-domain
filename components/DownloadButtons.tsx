import React from 'react';
import { Download, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadButtonsProps {
  onDownloadStandard: () => void;
  onDownloadHD: () => void;
  hdUnlocked: boolean;
}

export function DownloadButtons({ onDownloadStandard, onDownloadHD, hdUnlocked }: DownloadButtonsProps) {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onDownloadStandard}
        className="w-full flex items-center justify-center gap-[10px] h-[52px] rounded-lg text-[14px] font-semibold text-[#111827] bg-[#F3F4F6] transition-colors hover:bg-gray-200"
      >
        Download Standard
        <span className="font-normal opacity-60 text-[12px]">(Free)</span>
      </button>

      <button
        onClick={onDownloadHD}
        className="w-full flex items-center justify-center gap-[10px] h-[52px] rounded-lg text-[14px] font-semibold text-white bg-black transition-colors hover:bg-gray-900"
      >
        Download HD
        {!hdUnlocked && <span className="opacity-60 text-[14px]">🔒</span>}
      </button>
    </div>
  );
}
