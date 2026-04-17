'use client';

import React, { useState, useRef } from 'react';
import { UploadBox } from '@/components/UploadBox';
import { ImageSlider } from '@/components/ImageSlider';
import { InfoPanel } from '@/components/InfoPanel';
import { DownloadButtons } from '@/components/DownloadButtons';
import { AdModal } from '@/components/AdModal';
import { CropWorkspace } from '@/components/CropWorkspace';
import { BackgroundOptions, type BgType } from '@/components/BackgroundOptions';
import { HomeSEOContent } from '@/components/HomeSEOContent';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { compositeImageWithBackground } from '@/lib/canvasUtils';

import { ErrorBoundary } from '@/components/ErrorBoundary';

interface FileInfo {
  size: number;
  width: number;
  height: number;
}

export default function Home() {
  const [uploadState, setUploadState] = useState<'idle' | 'cropping' | 'processing' | 'done'>('idle');

  // ... (keeping inner state the same)
  // Wrap return in ErrorBoundary

  // We need to inject <ErrorBoundary> at the very root of the return.

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [originalInfo, setOriginalInfo] = useState<FileInfo | null>(null);

  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processedInfo, setProcessedInfo] = useState<FileInfo | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [hdUnlocked, setHdUnlocked] = useState(false);
  const [adModalOpen, setAdModalOpen] = useState(false);

  // Background state
  const [bgType, setBgType] = useState<BgType>('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);

  // Helper to fetch image dimensions
  const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error('Failed to get image dimensions.'));
      img.src = url;
    });
  };

  const handleImageSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    setError(null);
    setHdUnlocked(false);
    
    const objUrl = URL.createObjectURL(file);
    setOriginalFile(file);
    setOriginalImageUrl(objUrl);
    setUploadState('cropping');
  };

  const processImage = async (fileToProcess: File | Blob, useUrl: string) => {
    setUploadState('processing');
    try {
      const { width, height } = await getImageDimensions(useUrl);
      setOriginalInfo({ size: fileToProcess.size, width, height });

      const formData = new FormData();
      formData.append('image', fileToProcess);

      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to process image');
      }

      const blob = await res.blob();
      const processedObjUrl = URL.createObjectURL(blob);
      setProcessedImageUrl(processedObjUrl);

      const isMock = res.headers.get('X-Mock-Mode') === 'true';

      if (isMock) {
         setProcessedInfo({ size: fileToProcess.size * 0.4, width, height });
      } else {
         const dims = await getImageDimensions(processedObjUrl);
         setProcessedInfo({ size: blob.size, width: dims.width, height: dims.height });
      }

      setUploadState('done');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
      setOriginalFile(null);
      setOriginalImageUrl(null);
      setOriginalInfo(null);
      setUploadState('idle');
    }
  };

  const handleCropComplete = async (croppedBlob: Blob, croppedUrl: string) => {
    setOriginalImageUrl(croppedUrl); // update for slider
    await processImage(croppedBlob, croppedUrl);
  };

  const handleCropCancel = () => {
    // If they cancel crop, process the original file
    if (originalFile && originalImageUrl) {
        processImage(originalFile, originalImageUrl);
    } else {
        setUploadState('idle');
    }
  };

  const triggerDownload = async (isHD: boolean) => {
    if (!processedImageUrl || !processedInfo) return;
    
    try {
      // Create a final composited blob using our canvas utils
      const finalBlob = await compositeImageWithBackground(
        processedImageUrl,
        bgType,
        bgColor,
        bgImageUrl,
        processedInfo.width,
        processedInfo.height
      );

      const finalUrl = URL.createObjectURL(finalBlob);

      const a = document.createElement('a');
      a.href = finalUrl;
      const prefix = isHD ? 'bg-remover-hd' : 'bg-remover-standard';
      a.download = `${prefix}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Cleanup
      setTimeout(() => URL.revokeObjectURL(finalUrl), 1000);
    } catch (err) {
      console.error('Error generating download with background:', err);
      // Fallback
      const a = document.createElement('a');
      a.href = processedImageUrl;
      a.download = `bg-remover-fallback-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleDownloadStandard = () => triggerDownload(false);

  const handleDownloadHD = () => {
    if (!hdUnlocked) {
      setAdModalOpen(true);
      return;
    }
    triggerDownload(true);
  };

  const resetState = () => {
    setUploadState('idle');
    setOriginalFile(null);
    setOriginalImageUrl(null);
    setProcessedImageUrl(null);
    setError(null);
    setBgType('transparent');
  };

  return (
    <ErrorBoundary>
    <div className="h-screen w-full flex flex-col bg-white text-gray-900 font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 shrink-0 border-b border-gray-200 flex items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-2 font-bold text-[20px] tracking-tight">
          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
            {/* Logo icon inner */}
          </div>
          promptcraftin.in
        </div>
        <div className="flex gap-4">
          {uploadState === 'done' && (
            <button 
              onClick={resetState}
              className="px-[18px] py-[10px] rounded-lg text-sm font-semibold bg-[#F3F4F6] text-[#111827] transition-colors hover:bg-gray-200"
            >
              Upload New
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#F9FAFB]">
        <section className={cn(
          "flex flex-col items-center justify-center p-6 lg:p-10",
          uploadState !== 'done' && "shrink-0 min-h-[calc(100vh-64px)] w-full relative z-10"
        )}>
          {uploadState === 'idle' && (
             <>
               <UploadBox onImageSelect={handleImageSelect} />
               <div className="mt-12 flex flex-col items-center gap-4 animate-in fade-in duration-700">
                 <p className="text-sm text-gray-500 max-w-md text-center">
                   By uploading an image, you agree to our <a href="/terms" className="underline hover:text-gray-800">Terms of Service</a> and <a href="/privacy-policy" className="underline hover:text-gray-800">Privacy Policy</a>.
                 </p>
                 <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] text-gray-400 mt-8">
                    <a href="/about" className="hover:text-gray-800">About</a>
                    <a href="/contact" className="hover:text-gray-800">Contact</a>
                    <a href="/privacy-policy" className="hover:text-gray-800">Privacy Policy</a>
                    <a href="/terms" className="hover:text-gray-800">Terms</a>
                    <a href="/disclaimer" className="hover:text-gray-800">Disclaimer</a>
                 </div>
               </div>
             </>
          )}

          {uploadState === 'cropping' && originalImageUrl && (
            <CropWorkspace 
              originalImageUrl={originalImageUrl}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
            />
          )}

          {uploadState === 'processing' && (
            <div className="flex flex-col items-center justify-center w-full max-w-[580px] p-12 mt-10 min-h-[400px]">
               <Loader2 className="w-10 h-10 text-black animate-spin mb-4" />
               <h3 className="text-xl font-medium text-gray-900 mb-1">Removing background...</h3>
               <p className="text-gray-500 text-sm">Please wait, this usually takes 3-5 seconds</p>
            </div>
          )}

          {error && (
            <div className="w-full max-w-[580px] mt-10 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-sm font-medium px-6 py-4 shadow-sm border border-red-100">
              {error}
            </div>
          )}

          {uploadState === 'done' && originalImageUrl && processedImageUrl && originalInfo && processedInfo && (
            <div className="w-full max-w-[580px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
               <ImageSlider 
                 originalImage={originalImageUrl} 
                 processedImage={processedImageUrl} 
                 bgType={bgType}
                 bgColor={bgColor}
                 bgImageUrl={bgImageUrl}
               />
               <div className="mt-6 flex items-center gap-[6px] text-[#059669] text-[13px] font-medium">
                 <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                 Background removed successfully
               </div>
            </div>
          )}
        </section>

        {uploadState === 'done' && originalImageUrl && processedImageUrl && originalInfo && processedInfo && (
           <aside className="p-8 flex flex-col gap-8 bg-white max-w-[580px] w-full mx-auto rounded-3xl border border-gray-200 mb-10 shadow-sm">
             
             <BackgroundOptions
               bgType={bgType}
               setBgType={setBgType}
               bgColor={bgColor}
               setBgColor={setBgColor}
               bgImageUrl={bgImageUrl}
               setBgImageUrl={setBgImageUrl}
             />

             <div className="flex flex-col gap-3">
               <h3 className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#6B7280]">Image Details</h3>
               <InfoPanel 
                 originalFile={originalInfo}
                 processedFile={processedInfo}
               />
             </div>

             <div className="flex flex-col gap-3">
               <h3 className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#6B7280]">Download</h3>
               <DownloadButtons 
                 onDownloadStandard={handleDownloadStandard}
                 onDownloadHD={handleDownloadHD}
                 hdUnlocked={hdUnlocked}
               />
               <p className="text-[11px] text-center text-[#6B7280] leading-[1.4] mt-1">
                 HD download requires watching a 5s sponsored video
               </p>
             </div>

             {/* Placeholder for Ad Banners */}
             <div className="mt-2 bg-[#FEF3C7] border border-dashed border-[#F59E0B] p-4 rounded-xl text-center">
               <p className="text-[12px] font-medium text-[#92400E]">Your ad here</p>
               <span className="text-[10px] uppercase opacity-50 tracking-wider">Advertisement</span>
             </div>

             <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-center gap-4 text-[11px] text-gray-400">
                 <a href="/privacy-policy" className="hover:text-gray-800">Privacy</a>
                 <a href="/terms" className="hover:text-gray-800">Terms</a>
                 <a href="/disclaimer" className="hover:text-gray-800">Disclaimer</a>
                 <a href="/contact" className="hover:text-gray-800">Contact</a>
             </div>
           </aside>
        )}
        
        {uploadState === 'idle' && (
          <HomeSEOContent />
        )}
      </main>

      <AdModal 
        isOpen={adModalOpen} 
        onClose={() => setAdModalOpen(false)} 
        onUnlock={() => {
          setHdUnlocked(true);
        }}
      />
    </div>
    </ErrorBoundary>
  );
}
