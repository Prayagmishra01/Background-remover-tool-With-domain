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
import { ContactButton } from '@/components/ContactButton';
import { removeBackground } from '@imgly/background-removal';
import { toast } from 'react-hot-toast';

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

  // Rate Limiting State
  const [credits, setCredits] = useState<number>(3);
  const [adIntent, setAdIntent] = useState<'hd_download' | 'unlock_removals' | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchCompleted, setBatchCompleted] = useState<{file: File, url: string}[]>([]);
  const [batchError, setBatchError] = useState<string | null>(null);

  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);
  const [loadingText, setLoadingText] = useState('Please wait, this usually takes 3-5 seconds');
  const [loadingProgress, setLoadingProgress] = useState(0);

  React.useEffect(() => {
    const saved = localStorage.getItem('bg_removal_credits');
    if (saved !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCredits(parseInt(saved, 10));
    } else {
      localStorage.setItem('bg_removal_credits', '3');
    }
  }, []);

  // Background state
  const [bgType, setBgType] = useState<BgType>('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);

  const logTelemetryError = async (err: Error | any, stage: string) => {
    try {
      await fetch('/api/telemetry/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error_message: err.message || String(err),
          stack_trace: err.stack || "",
          severity: "error",
          tool_stage: stage,
          timestamp: new Date().toISOString(),
          device: navigator.userAgent,
          screen_resolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'unknown',
          page_url: typeof window !== 'undefined' ? window.location.href : 'unknown',
          hardware_concurrency: navigator.hardwareConcurrency || 'unknown',
          device_memory: (navigator as any).deviceMemory || 'unknown'
        })
      });
    } catch(e) {
      // Intentionally silent
    }
  };

  // Helper to fetch image dimensions
  const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error('Failed to get image dimensions.'));
      img.src = url;
    });
  };

  const handleImagesSelect = (files: File[]) => {
    if (files.length === 0) return;
    
    if (files.some(file => file.size > 10 * 1024 * 1024)) {
      setError("One or more files exceed 10MB limit.");
      return;
    }

    if (credits < files.length) {
      setPendingFiles(files);
      setAdIntent('unlock_removals');
      setAdModalOpen(true);
      return;
    }

    proceedWithImagesSelect(files);
  };

  const proceedWithImagesSelect = (files: File[]) => {
    setError(null);
    setHdUnlocked(false);
    
    if (files.length === 1) {
      setBatchMode(false);
      const objUrl = URL.createObjectURL(files[0]);
      setOriginalFile(files[0]);
      setOriginalImageUrl(objUrl);
      setUploadState('cropping');
    } else {
      setBatchMode(true);
      setBatchFiles(files);
      setBatchCompleted([]);
      setBatchProgress(0);
      setBatchError(null);
      setUploadState('batchProcessing' as any);
      processBatch(files);
    }
  };

  const processBatch = async (files: File[]) => {
    let completed: {file: File, url: string}[] = [];
    
    for (let i = 0; i < files.length; i++) {
      setBatchProgress(i);
      try {
        setLoadingProgress(0);
        const config = {
          progress: (key: string, current: number, total: number) => {
            const percentage = Math.round((current / total) * 100);
            setLoadingProgress(percentage);
            setLoadingText(`Downloading ${key} AI model: ${percentage}%`);
          }
        };

        const removalPromise = removeBackground(files[i], config);
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('AI process timed out. Try a smaller image or another browser.')), 60000);
        });

        const blob = await Promise.race([removalPromise, timeoutPromise]);
        const url = URL.createObjectURL(blob);
        completed.push({ file: files[i], url });

        // Decrement credits on success
        setCredits(prev => {
          const newCredits = Math.max(0, prev - 1);
          localStorage.setItem('bg_removal_credits', newCredits.toString());
          return newCredits;
        });

      } catch (err: any) {
        console.error(err);
        logTelemetryError(err, 'processBatch');
        toast.error(`Error on ${files[i].name}: ${err.message || 'Failed'}`);
        setBatchError(err.message || 'Error processing some images.');
      }
    }
    
    setBatchProgress(files.length);
    setBatchCompleted(completed);
    setUploadState('batchDone' as any);
  };

  const processImage = async (fileToProcess: File | Blob, useUrl: string) => {
    setUploadState('processing');
    try {
      const { width, height } = await getImageDimensions(useUrl);
      setOriginalInfo({ size: fileToProcess.size, width, height });

      setLoadingText('Initializing background removal AI...');
      setLoadingProgress(0);
      const config = {
        progress: (key: string, current: number, total: number) => {
          const percentage = Math.round((current / total) * 100);
          setLoadingProgress(percentage);
          setLoadingText(`Downloading ${key} AI model: ${percentage}%. (One-time only)`);
        }
      };

      // Wrap in a promise race to protect against infinite hangs on unsupported hardware
      const removalPromise = removeBackground(fileToProcess, config);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('AI process timed out. Try a smaller image or another browser.')), 60000);
      });

      const blob = await Promise.race([removalPromise, timeoutPromise]);
      const processedObjUrl = URL.createObjectURL(blob);
      setProcessedImageUrl(processedObjUrl);

      const dims = await getImageDimensions(processedObjUrl);
      setProcessedInfo({ size: blob.size, width: dims.width, height: dims.height });

      // Decrement credits on success
      setCredits(prev => {
        const newCredits = Math.max(0, prev - 1);
        localStorage.setItem('bg_removal_credits', newCredits.toString());
        return newCredits;
      });

      setUploadState('done');
    } catch (err: any) {
      console.error(err);
      logTelemetryError(err, 'processImage');
      toast.error(err.message || 'Something went wrong removing the background!');
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
      let dlWidth = processedInfo.width;
      let dlHeight = processedInfo.height;

      // Scale down standard to max ~1000px longest edge or 50%, whichever is smaller
      if (!isHD) {
        const scale = Math.min(0.5, 1000 / Math.max(dlWidth, dlHeight));
        dlWidth = Math.floor(dlWidth * scale);
        dlHeight = Math.floor(dlHeight * scale);
      }

      // Create a final composited blob using our canvas utils
      const finalBlob = await compositeImageWithBackground(
        processedImageUrl,
        bgType,
        bgColor,
        bgImageUrl,
        dlWidth,
        dlHeight
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
      setAdIntent('hd_download');
      setAdModalOpen(true);
      return;
    }
    triggerDownload(true);
  };

  const handleAdUnlock = () => {
    if (adIntent === 'hd_download') {
      setHdUnlocked(true);
    } else if (adIntent === 'unlock_removals') {
      setCredits(3);
      localStorage.setItem('bg_removal_credits', '3');
      if (pendingFiles && pendingFiles.length > 0) {
        proceedWithImagesSelect(pendingFiles);
        setPendingFiles(null);
      }
    }
    setAdModalOpen(false);
    setAdIntent(null);
  };

  const resetState = () => {
    setUploadState('idle');
    setOriginalFile(null);
    setOriginalImageUrl(null);
    setProcessedImageUrl(null);
    setError(null);
    setBatchMode(false);
    setBatchFiles([]);
    setBatchCompleted([]);
    setBatchError(null);
    setBgType('transparent');
  };

  const handleDownloadBatchZip = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Fetch blobs from completed URLs and add to ZIP
      const folder = zip.folder("background-removed");
      
      for (let i = 0; i < batchCompleted.length; i++) {
        const item = batchCompleted[i];
        const res = await fetch(item.url);
        const blob = await res.blob();
        if (folder) {
           folder.file(`bg-removed-${i + 1}-${item.file.name}`, blob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = URL.createObjectURL(zipBlob);
      
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = `PromptCraft-Batch-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);
    } catch (err) {
      console.error("Failed to generate zip", err);
    }
  };

  return (
    <ErrorBoundary>
    <div className="h-screen w-full flex flex-col bg-white text-gray-900 font-sans overflow-hidden">
      {/* Header */}
      <header className="py-4 shrink-0 border-b border-gray-200 bg-white">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2 sm:gap-3 font-bold text-[26px] sm:text-[34px] tracking-tight leading-none text-gray-900">
            <img src="https://res.cloudinary.com/dz3ixer7i/image/upload/e_trim:10/v1776431696/Background_remover_website_logo_1_vqflqm.png" alt="PromptCraft Logo" className="h-[24px] sm:h-[32px] w-auto object-contain translate-y-1 sm:translate-y-1.5" />
            <span>promptcraftin.in</span>
          </div>
          <div className="flex gap-4 items-center">
            {(uploadState === 'done' || uploadState === 'batchDone' as any) && (
              <button 
                onClick={resetState}
                className="px-[18px] py-[10px] rounded-lg text-sm font-semibold bg-[#F3F4F6] text-[#111827] transition-colors hover:bg-gray-200"
              >
                Upload New
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#F9FAFB]">
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col items-center">
          <section className={cn(
            "flex flex-col items-center justify-center p-6 lg:p-10 w-full",
          (uploadState !== 'done' && uploadState !== 'batchDone' as any) && "shrink-0 min-h-[calc(100vh-64px)] w-full relative z-10"
        )}>
          {uploadState === 'idle' && (
             <>
               <UploadBox onImagesSelect={handleImagesSelect} credits={credits} />
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

          {/* Existing Single Processing */}
          {uploadState === 'processing' && (
            <div className="flex flex-col items-center justify-center w-full max-w-[580px] p-6 lg:p-12 mt-10 min-h-[300px] lg:min-h-[400px]">
               <Loader2 className="w-10 h-10 text-black animate-spin mb-4" />
               <h3 className="text-xl font-medium text-gray-900 mb-1 text-center">Removing background...</h3>
               <p className="text-gray-500 text-sm text-center font-medium max-w-[80%] mx-auto mb-4">{loadingText}</p>
               
               <div className="w-full max-w-[300px] bg-gray-200 rounded-full h-2 overflow-hidden mx-auto">
                 <div className="bg-black h-2 transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
               </div>
            </div>
          )}

          {uploadState === 'batchProcessing' as any && (
            <div className="flex flex-col items-center justify-center w-full max-w-[580px] p-12 mt-10 min-h-[400px]">
               <Loader2 className="w-10 h-10 text-black animate-spin mb-4" />
               <h3 className="text-xl font-medium text-gray-900 mb-1">Batch Processing...</h3>
               <p className="text-gray-500 text-sm">Processing image {batchProgress + 1} of {batchFiles.length}</p>
               <p className="text-gray-500 text-xs mt-2 text-center">{loadingText}</p>
               
               <div className="w-full bg-gray-200 rounded-full h-2 mt-6 overflow-hidden">
                 <div className="bg-black h-2 transition-all duration-300" style={{ width: `${(batchProgress / batchFiles.length) * 100}%` }}></div>
               </div>
            </div>
          )}

          {error && (
            <div className="w-full max-w-[580px] mt-10 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-sm font-medium px-6 py-4 shadow-sm border border-red-100">
              {error}
            </div>
          )}
          
          {batchError && (
             <div className="w-full max-w-[580px] mt-10 p-4 bg-yellow-50 text-yellow-800 rounded-2xl flex items-center justify-center text-sm font-medium px-6 py-4 shadow-sm border border-yellow-200">
              {batchError}
            </div>
          )}

          {/* Existing Single Upload Done */}
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

          {/* Batch Upload Done */}
          {uploadState === 'batchDone' as any && batchCompleted.length > 0 && (
            <div className="w-full max-w-[700px] flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
               <h2 className="text-2xl font-semibold mb-6">Batch Process Complete</h2>
               <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                 {batchCompleted.map((item, idx) => (
                   <div key={idx} className="relative aspect-square bg-[#ececec] rounded-lg overflow-hidden flex items-center justify-center border border-gray-200" style={{ backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURbOzs/v7+9nZ2d3d3XK0ONoAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAwSURBVBjTY2BgUGBQUGBgYEBgA2ZgDDA1AylGVjZkQZDAgA7gE0BSDJpgbAagHwsAFUoEA3eXvHIAAAAASUVORK5CYII=")'}}>
                      <img src={item.url} alt={`Processed ${idx+1}`} className="max-w-full max-h-full object-contain" />
                   </div>
                 ))}
               </div>
               
               <button 
                  onClick={handleDownloadBatchZip}
                  className="px-8 py-3 text-white bg-black rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download All as ZIP
                </button>
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

             <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-center items-center gap-4 text-[11px] text-gray-400">
                 <ContactButton variant="footer-help" />
                 <ContactButton variant="footer-feedback" />
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
        </div>
      </main>

      <AdModal 
        isOpen={adModalOpen} 
        onClose={() => {
          setAdModalOpen(false);
          setAdIntent(null);
          setPendingFiles(null);
        }} 
        onUnlock={handleAdUnlock}
        intent={adIntent}
      />
    </div>
    </ErrorBoundary>
  );
}
