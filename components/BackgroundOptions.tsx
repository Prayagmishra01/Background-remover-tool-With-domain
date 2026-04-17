import React, { useRef } from 'react';
import { Image as ImageIcon, PaintBucket, CircleOff } from 'lucide-react';

export type BgType = 'transparent' | 'color' | 'image';

interface BackgroundOptionsProps {
  bgType: BgType;
  setBgType: (type: BgType) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  bgImageUrl: string | null;
  setBgImageUrl: (url: string | null) => void;
}

export function BackgroundOptions({
  bgType,
  setBgType,
  bgColor,
  setBgColor,
  bgImageUrl,
  setBgImageUrl
}: BackgroundOptionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setBgImageUrl(url);
      setBgType('image');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#6B7280]">Background</h3>
      <div className="flex bg-[#F3F4F6] p-1 rounded-lg">
        <button
          onClick={() => setBgType('transparent')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-md transition-all text-xs font-semibold ${
            bgType === 'transparent' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <CircleOff className="w-5 h-5 mb-1" strokeWidth={1.5} />
          Transparent
        </button>
        <button
          onClick={() => setBgType('color')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-md transition-all text-xs font-semibold ${
            bgType === 'color' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
           <PaintBucket className="w-5 h-5 mb-1" strokeWidth={1.5} />
           Color
        </button>
        <button
          onClick={() => {
            if (bgImageUrl) {
                setBgType('image');
            } else {
                fileInputRef.current?.click();
            }
          }}
          className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 rounded-md transition-all text-xs font-semibold ${
            bgType === 'image' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
           <ImageIcon className="w-5 h-5 mb-1" strokeWidth={1.5} />
           {bgImageUrl && bgType !== 'image' ? 'Image' : 'Custom'}
        </button>
      </div>

      <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/jpeg, image/png, image/webp"
          onChange={handleImageUpload}
      />

      {bgType === 'color' && (
        <div className="mt-2 flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
          <span className="text-sm font-medium text-gray-700">Select Color</span>
          <div className="flex items-center gap-3">
             <input 
               type="color" 
               value={bgColor}
               onChange={(e) => setBgColor(e.target.value)}
               className="w-8 h-8 rounded cursor-pointer border-0 p-0"
             />
          </div>
        </div>
      )}

      {bgType === 'image' && bgImageUrl && (
          <div className="mt-2 flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
              <span className="text-sm font-medium text-gray-700">Custom Image</span>
              <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                  Change
              </button>
          </div>
      )}
    </div>
  );
}
