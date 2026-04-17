'use client';

import React, { useCallback, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadBoxProps {
  onImagesSelect: (files: File[]) => void;
  disabled?: boolean;
  credits?: number;
}

export function UploadBox({ onImagesSelect, disabled, credits = 3 }: UploadBoxProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
        .filter(file => file.type.startsWith('image/'))
        .slice(0, 10); // Limit to 10 files
      if (files.length > 0) {
        onImagesSelect(files);
      }
    }
  }, [onImagesSelect, disabled]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).slice(0, 10);
      if (files.length > 0) {
        onImagesSelect(files);
      }
    }
  }, [onImagesSelect]);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center w-full max-w-[580px] p-12 mx-auto min-h-[400px] transition-all border-2 border-dashed rounded-2xl cursor-pointer group bg-white',
        isDragOver ? 'border-[#3B82F6]' : 'border-[#E5E7EB] hover:border-gray-400',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
      )}
    >
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
      <div className="flex items-center justify-center w-16 h-16 mb-6 text-black bg-white rounded-full shadow-sm ring-1 ring-gray-100">
        <UploadCloud className="w-8 h-8" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
        Start from a photo
      </h2>
      <p className="mb-8 text-sm text-center text-gray-500 max-w-[280px]">
        Drop 1 to 10 images here — free & fast. Max file size 10MB each.
        <br/><span className="text-[#059669] font-medium mt-1 inline-block">{credits} free removals remaining</span>
      </p>
      <button 
        disabled={disabled}
        className="px-[18px] py-[10px] font-semibold text-[14px] text-white transition-opacity bg-black rounded-lg hover:opacity-90"
      >
        Upload Images
      </button>
    </div>
  );
}
