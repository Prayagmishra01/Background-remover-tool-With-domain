'use client';

import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedImg } from '@/lib/canvasUtils';

interface CropWorkspaceProps {
  originalImageUrl: string;
  onCropComplete: (croppedBlob: Blob, croppedUrl: string) => void;
  onCancel: () => void;
}

export function CropWorkspace({ originalImageUrl, onCropComplete, onCancel }: CropWorkspaceProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [aspect, setAspect] = useState<number | undefined>(undefined);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    imageRef.current = e.currentTarget;
    
    // Default to a 90% center crop
    const initialCrop = centerCrop(
      makeAspectCrop(
        { unit: '%', width: 90 },
        1, // We just default pass 1 but the aspect is unrestrained
        width,
        height
      ),
      width,
      height
    );
    // Remove the fixed aspect from the initial crop
    setCrop({ ...initialCrop, aspect: undefined } as any);
  };

  const handleApplyCrop = async () => {
    if (!completedCrop || !imageRef.current) {
        // If they didn't crop anything, we could fall back to passing the original
        return onCancel(); // For safety
    }

    // Only process crop if width and height > 0
    if (completedCrop.width > 0 && completedCrop.height > 0) {
      try {
        const croppedBlob = await getCroppedImg(imageRef.current, completedCrop);
        const croppedUrl = URL.createObjectURL(croppedBlob);
        onCropComplete(croppedBlob, croppedUrl);
      } catch (err) {
        console.error('Failed to crop image', err);
      }
    } else {
        onCancel();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[580px]">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">Crop Image</h2>
      
      <div className="flex gap-2 mb-6">
        <button className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${aspect === undefined ? 'bg-black text-white' : 'bg-white text-gray-700'}`} onClick={() => setAspect(undefined)}>Free</button>
        <button className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${aspect === 1 ? 'bg-black text-white' : 'bg-white text-gray-700'}`} onClick={() => setAspect(1)}>1:1</button>
        <button className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${aspect === 4/3 ? 'bg-black text-white' : 'bg-white text-gray-700'}`} onClick={() => setAspect(4/3)}>4:3</button>
        <button className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${aspect === 16/9 ? 'bg-black text-white' : 'bg-white text-gray-700'}`} onClick={() => setAspect(16/9)}>16:9</button>
      </div>

      <div className="max-h-[500px] overflow-hidden rounded-xl border border-gray-200 bg-white">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
        >
          <img 
            ref={imageRef} 
            src={originalImageUrl} 
            alt="Upload" 
            onLoad={onImageLoad}
            style={{ maxHeight: '500px', width: 'auto' }} 
          />
        </ReactCrop>
      </div>

      <div className="flex gap-4 mt-8 w-full max-w-[400px]">
        <button 
          onClick={onCancel}
          className="flex-1 py-3 text-sm font-semibold rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button 
          onClick={handleApplyCrop}
          className="flex-1 py-3 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-900 transform transition-all"
        >
          Apply & Continue
        </button>
      </div>
    </div>
  );
}
