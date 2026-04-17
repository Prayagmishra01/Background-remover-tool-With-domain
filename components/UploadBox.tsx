'use client';

import React, { useCallback, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadBoxProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export function UploadBox({ onImageSelect, disabled }: UploadBoxProps) {
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
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  }, [onImageSelect, disabled]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelect(e.target.files[0]);
    }
  }, [onImageSelect]);

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
        Remove background instantly — free & fast. Max file size 10MB.
      </p>
      <button 
        disabled={disabled}
        className="px-[18px] py-[10px] font-semibold text-[14px] text-white transition-opacity bg-black rounded-lg hover:opacity-90"
      >
        Upload Image
      </button>
    </div>
  );
}
