'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BgType } from '@/components/BackgroundOptions';

interface ImageSliderProps {
  originalImage: string;
  processedImage: string;
  bgType?: BgType;
  bgColor?: string;
  bgImageUrl?: string | null;
}

export function ImageSlider({ 
  originalImage, 
  processedImage,
  bgType = 'transparent',
  bgColor = '#ffffff',
  bgImageUrl = null
}: ImageSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
           setContainerWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const calculatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    calculatePosition(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      calculatePosition(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div 
      className="relative w-full aspect-[4/3] bg-white rounded-xl overflow-hidden border border-gray-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),_0_8px_10px_-6px_rgba(0,0,0,0.05)] cursor-ew-resize select-none"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      {/* Background (Processed Image - with transparency revealed) */}
      {bgType === 'transparent' && (
        <div className="absolute inset-0 checkerboard-bg pointer-events-none" />
      )}
      {bgType === 'color' && (
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: bgColor }} />
      )}
      {bgType === 'image' && bgImageUrl && (
        <div className="absolute inset-0 pointer-events-none">
           <Image
             src={bgImageUrl}
             alt="Custom Background"
             fill
             className="object-cover"
             unoptimized
           />
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        <Image 
          src={processedImage} 
          alt="Processed" 
          fill
          className="object-contain pointer-events-none" 
          unoptimized
        />
      </div>

      {/* Foreground (Original Image) */}
      <div 
        className="absolute inset-0 pointer-events-none bg-white"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <Image 
            src={originalImage} 
            alt="Original" 
            fill
            className="object-contain pointer-events-none border-r-2 border-white" 
            unoptimized
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-8 h-8 bg-white rounded-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-center gap-1">
          <div className="w-[2px] h-3 bg-gray-200 rounded-[1px]"></div>
          <div className="w-[2px] h-3 bg-gray-200 rounded-[1px]"></div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute bottom-4 left-4 px-2.5 py-1 text-[11px] font-semibold tracking-[0.05em] uppercase text-white bg-black/50 rounded pointer-events-none z-20">
        Original
      </div>
      <div className="absolute bottom-4 right-4 px-2.5 py-1 text-[11px] font-semibold tracking-[0.05em] uppercase text-white bg-black/50 rounded pointer-events-none z-20">
        Removed
      </div>
    </div>
  );
}

