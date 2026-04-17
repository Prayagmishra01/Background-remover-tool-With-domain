import React from 'react';

interface InfoPanelProps {
  originalFile: {
    size: number;
    width: number;
    height: number;
  };
  processedFile: {
    size: number;
    width: number;
    height: number;
  };
}

export function InfoPanel({ originalFile, processedFile }: InfoPanelProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-[#F3F4F6] rounded-xl">
      <div>
        <span className="block text-[16px] font-semibold text-gray-900 leading-tight">{formatSize(processedFile.size)}</span>
        <span className="block text-[11px] text-[#6B7280] mt-[2px]">File Size</span>
      </div>
      <div>
        <span className="block text-[16px] font-semibold text-gray-900 leading-tight">{processedFile.width} &times; {processedFile.height}</span>
        <span className="block text-[11px] text-[#6B7280] mt-[2px]">Resolution</span>
      </div>
    </div>
  );
}
